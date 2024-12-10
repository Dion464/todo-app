import dotenv from 'dotenv';
import pkg from 'pg'; // Import pg as a default package
const { Pool } = pkg; // Destructure Pool from the imported package

dotenv.config();

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

// Export pool and queryDB function
export { pool, queryDB }; 
