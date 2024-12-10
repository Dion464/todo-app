import { pool } from './lib/db.js';  // Import pool from db.js

const initDB = async () => {
  try {
    // Drop existing tables if they exist
    await pool.query(`DROP TABLE IF EXISTS subtasks`);
    await pool.query(`DROP TABLE IF EXISTS tasks`);
    await pool.query(`DROP TABLE IF EXISTS users`);

    // Create 'users' table
    await pool.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
      )
    `);

    // Create 'tasks' table
    await pool.query(`
      CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create 'subtasks' table
    await pool.query(`
      CREATE TABLE subtasks (
          id SERIAL PRIMARY KEY,
          task_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          FOREIGN KEY (task_id) REFERENCES tasks (id)
      )
    `);

    console.log('Database reinitialized successfully.');
  } catch (error) {
    console.error('Error reinitializing the database:', error);
  } finally {
    pool.end(); // Close the connection
  }
};

initDB();
