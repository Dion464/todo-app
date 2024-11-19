import { openDB } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET; // Ensure this is set in your environment

// Middleware to verify JWT and extract user ID
const verifyUser = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('No authorization header provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Token missing');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('decoded', decoded)
        return decoded.id;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export default async function handler(req, res) {
    const db = await openDB();
    const { filter } = req.query;

    let userId;
    try {
        userId = verifyUser(req); // Get the authenticated user's ID
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }

    // Check if the filter is a numeric ID
    const isTaskId = !isNaN(parseInt(filter));

    if (req.method === 'GET') {
        try {
            let tasks;
            if (isTaskId) {
                // Fetch a single task by ID
                tasks = await db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [filter, userId]);
                if (!tasks) return res.status(404).json({ message: 'Task not found' });
            } else {
                // Filter tasks based on 'completed' status
                const completedStatus = filter === 'completed' ? 1 : filter === 'incomplete' ? 0 : null;
                
                if (completedStatus !== null) {
                    tasks = await db.all('SELECT * FROM tasks WHERE user_id = ? AND completed = ?', [userId, completedStatus]);
                } else {
                    tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
                }
            }
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            return res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
        }
    } else if (req.method === 'POST') {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        try {
            const result = await db.run('INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)', [title, false, userId]);
            const newTask = { id: result.lastID, title, completed: false, user_id: userId };
            return res.status(201).json(newTask);
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(500).json({ message: 'Error adding task', error: error.message });
        }
    } else if (req.method === 'PUT') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for update' });
        
        const { completed } = req.body;
        if (completed === undefined) return res.status(400).json({ message: 'Completed status is required' });

        try {
            console.log('userId', userId)
            await db.run('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed, filter, userId]);
            return res.status(200).json({ message: 'Task updated successfully' });
        } catch (error) {
            console.error('Error updating task:', error);
            return res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for deletion' });

        try {
            const result = await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [filter, userId]);
            if (result.changes === 0) return res.status(404).json({ message: 'Task not found or not authorized' });
            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
