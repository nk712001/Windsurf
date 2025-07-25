const jwt = require('jsonwebtoken');
const pool = require('../services/database');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      // IMPORTANT: Move secret to environment variables in production
      const jwtSecret = 'your_jwt_secret_key_here';
      const decoded = jwt.verify(token, jwtSecret);

      // Get user from the token payload and attach to request (excluding password)
      const userResult = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [decoded.user.id]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = userResult.rows[0];
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
