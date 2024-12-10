// lib/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted PostgreSQL
  },
};

const pool = new Pool(dbConfig);

// Export the pool and any other functions you need
export const openDB = async () => {
  return pool.connect();  // Returns the connection to the database
};

export const queryDB = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
