// lib/db.js
const { Pool } = require('pg');  // Use CommonJS 'require'
const dotenv = require('dotenv');

dotenv.config();  // Ensure environment variables are loaded

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted PostgreSQL
  },
};

const pool = new Pool(dbConfig);

// Logs for debugging
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

// Export the pool connection and query function using CommonJS syntax
module.exports = {
  pool,
  queryDB: async (query, params) => {
    try {
      const result = await pool.query(query, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};
