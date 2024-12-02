import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
    const db = await openDB();
    const { filter } = req.query;

    // Check if the filter is a numeric ID (task ID)
    const isTaskId = !isNaN(parseInt(filter));

    if (req.method === 'PUT') {
        if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for updating' });

        const { completed, description } = req.body; // Include description in the PUT request

        try {
            // Update task completion status and description
            const result = await db.run(
                'UPDATE tasks SET completed = ?, description = ? WHERE id = ?',
                [completed, description, filter]
            );
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Task not found' });
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
            const task = await db.get('SELECT * FROM tasks WHERE id = ?', [filter]);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Perform the deletion
            const result = await db.run('DELETE FROM tasks WHERE id = ?', [filter]);

            // Return success if deletion was successful
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }

            console.log(`Task successfully deleted: ID ${filter}`);
            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            // Fetch all tasks
            const tasks = await db.all('SELECT * FROM tasks');
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            return res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
        }
    } else if (req.method === 'POST') {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }
        if (!description) {
            return res.status(400).json({ message: 'Task description is required' });
        }
        try {
            const result = await db.run('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)', [title, description, false]);
            return res.status(201).json({ id: result.lastID, title, description, completed: false });
        } catch (error) {
            console.error('Error adding task:', error);
            return res.status(500).json({ message: 'Error adding task', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
