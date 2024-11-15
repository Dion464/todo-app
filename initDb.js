import { openDB } from './lib/db.js';

const initDB = async () => {
    const db = await openDB();
    try {
        // Create 'users' table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        // Create 'tasks' table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Create 'subtasks' table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS subtasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (task_id) REFERENCES tasks (id)
            )
        `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        db.close();
    }
};

initDB();