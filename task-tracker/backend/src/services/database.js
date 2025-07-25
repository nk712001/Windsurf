const { Pool } = require('pg');
const config = require('../config/db.config');

// Determine the connection configuration.
// Prioritize DATABASE_URL if it's available (common for production/deployment environments).
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : config.development;

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
