import { Pool } from 'pg';  // Importing Pool from pg module
import dotenv from 'dotenv';  // Importing dotenv for environment variable support

dotenv.config();  // Loading environment variables from .env file

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted PostgreSQL
  },
};

const pool = new Pool(dbConfig); // Creating a Pool instance with the configuration

// Logs for debugging
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

export const queryDB = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
