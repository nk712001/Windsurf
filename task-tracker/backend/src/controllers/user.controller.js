const pool = require('../services/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  // Password complexity validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain both letters and numbers.',
    });
  }

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );

    const user = newUser.rows[0];

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set expiration
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await pool.query(
      'UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3',
      [hashedToken, tokenExpires, user.id]
    );

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;

    try {
      await sendVerificationEmail(user, verificationUrl);

      res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ message: 'User registered, but failed to send verification email.' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Find user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email address before logging in.' });
    }

    // User is authenticated, create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // IMPORTANT: Move secret to environment variables in production
    const jwtSecret = 'your_jwt_secret_key_here';

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  // Hash the token to match the one in the DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  try {
    // Find the user by the hashed token and check if it's not expired
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).send('<h1>Error</h1><p>Token is invalid or has expired.</p>');
    }

    const user = userResult.rows[0];

    // Update user to be verified and clear token fields
    await pool.query(
      'UPDATE users SET is_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL WHERE id = $1',
      [user.id]
    );

    // For now, just send a simple success page. In a real app, you'd redirect to a frontend page.
    res.status(200).send('<h1>Success!</h1><p>Your email has been verified. You can now close this tab and log in.</p>');

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).send('<h1>Error</h1><p>An error occurred during email verification. Please try again later.</p>');
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Always send a success-like response to prevent email enumeration
    if (userResult.rows.length === 0) {
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token to DB
    await pool.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [hashedToken, tokenExpires, user.id]
    );

    // Send email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user, resetUrl);
      res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (emailError) {
      console.error('Forgot password email error:', emailError);
      // Even if email fails, we send a generic success response to prevent enumeration
      res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Please provide a new password.' });
  }

  try {
    // Hash the token to find the user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const userResult = await pool.query(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    const user = userResult.rows[0];

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset fields
    await pool.query(
      'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
