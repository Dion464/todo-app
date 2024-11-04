// pages/api/tasks/index.js
import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
    const db = await openDB();

    if (req.method === 'GET') {
        try {
            const tasks = await db.all('SELECT * FROM tasks');
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            res.status(500).json({ message: 'Error retrieving tasks', error });
        }
    } else if (req.method === 'POST') {
        const { title, userId } = req.body; // Assume userId is provided from session or context
        if (!title || !userId) {
            return res.status(400).json({ message: 'Task title and user ID are required' });
        }

        try {
            const result = await db.run('INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)', title, false, userId);
            const newTask = { id: result.lastID, title, completed: false, user_id: userId };
            res.status(201).json(newTask);
        } catch (error) {
            console.error('Error adding task:', error);
            res.status(500).json({ message: 'Error adding task', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
