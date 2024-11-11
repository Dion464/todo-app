import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
    const db = await openDB();
    const { filter } = req.query; 

    // Check if the filter is a numeric ID
    const isTaskId = !isNaN(parseInt(filter));

    if (req.method === 'GET') {
        try {
            let tasks;
            if (isTaskId) {
                // Fetch a single task by ID
                tasks = await db.get('SELECT * FROM tasks WHERE id = ?', [filter]);
                if (!tasks) return res.status(404).json({ message: 'Task not found' });
            } else {
                // Filter tasks based on 'completed' status
                const userId = req.query.userId || 1; // Replace 1 with actual user ID logic as needed
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
        const { title, userId } = req.body;
        if (!title || !userId) {
            return res.status(400).json({ message: 'Task title and user ID are required' });
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
            await db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, filter]);
            return res.status(200).json({ message: 'Task updated successfully' });
        } catch (error) {
            console.error('Error updating task:', error);
            return res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for deletion' });

        try {
            await db.run('DELETE FROM tasks WHERE id = ?', [filter]);
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
