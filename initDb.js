import { openDB } from './lib/db.js';

const initDB = async () => {
    const db = await openDB();
    try {
        // Ensure the 'tasks' table exists with 'category' column, if not already there
        await db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                completed BOOLEAN NOT NULL DEFAULT 0,
                category TEXT, -- Added category column
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // If the 'category' column doesn't exist, add it
        await db.exec(`
            ALTER TABLE tasks ADD COLUMN category TEXT;
        `);

        // Create 'subtasks' table if not already created
        await db.exec(`
            CREATE TABLE IF NOT EXISTS subtasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (task_id) REFERENCES tasks (id)
            )
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        db.close();
    }
};

// Call the function to initialize the database
initDB();
