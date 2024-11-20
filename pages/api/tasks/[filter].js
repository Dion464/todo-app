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
        console.log('Decoded user info:', decoded); // Log decoded user info
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

    if (req.method === 'PUT') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for updating' });

        const { completed, userId: taskUserId } = req.body;
        if (taskUserId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        try {
            // Update task completion status
            const result = await db.run('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed, filter, userId]);
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Task not found or not authorized' });
            }
            return res.status(200).json({ message: 'Task updated successfully' });
        } catch (error) {
            console.error('Error updating task:', error);
            return res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for deletion' });

        try {
            // Check if the task exists before attempting to delete it
            const task = await db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [filter, userId]);
            if (!task) {
                console.log(`Task not found or not authorized: ID ${filter}, User ${userId}`);
                return res.status(404).json({ message: 'Task not found or not authorized' });
            }

            // Perform the deletion
            const result = await db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [filter, userId]);

            // Log and return success if deletion was successful
            if (result.changes === 0) {
                console.log(`No changes made during deletion: ID ${filter}, User ${userId}`);
                return res.status(404).json({ message: 'Task not found or not authorized' });
            }

            console.log(`Task successfully deleted: ID ${filter}, User ${userId}`);
            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            // Fetch tasks for the authenticated user
            const tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
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
            return res.status(201).json({ id: result.lastID, title, completed: false });
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(500).json({ message: 'Error adding task', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
