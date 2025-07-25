const pool = require('../services/database');
const bcrypt = require('bcrypt');

const seedAndVerifyUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Clean up existing user to ensure a clean state for the test
    await pool.query('DELETE FROM users WHERE email = $1', [email]);

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user and mark as verified
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, name, email',
      ['Test User', email, passwordHash]
    );

    res.status(201).json({
      message: 'Test user created and verified successfully.',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Test user seeding error:', error);
    res.status(500).json({ message: 'Failed to seed test user.' });
  }
};

const getResetToken = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const result = await pool.query(
      'SELECT reset_password_token FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ token: result.rows[0].reset_password_token });
  } catch (error) {
    console.error('Get reset token error:', error);
    res.status(500).json({ message: 'Failed to get reset token.' });
  }
};

module.exports = {
  seedAndVerifyUser,
  getResetToken,
};
