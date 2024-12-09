import { openDB } from './lib/db.js';

const initDB = async () => {
    const db = await openDB();
    try {
        // Drop existing tables if they exist
        await db.exec(`DROP TABLE IF EXISTS subtasks`);
        await db.exec(`DROP TABLE IF EXISTS tasks`);
        await db.exec(`DROP TABLE IF EXISTS users`);

        // Create 'users' table
        await db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        // Create 'tasks' table
        await db.exec(`
            CREATE TABLE tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Create 'subtasks' table
        await db.exec(`
            CREATE TABLE subtasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (task_id) REFERENCES tasks (id)
            )
        `);

        console.log('Database reinitialized successfully.');
    } catch (error) {
        console.error('Error reinitializing the database:', error);
    } finally {
        db.close();
    }
};

initDB();
