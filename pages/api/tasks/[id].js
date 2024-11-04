// pages/api/tasks/[id].js
import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;
    const db = await openDB();

    if (req.method === 'GET') {
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        return res.json(task);
    } else if (req.method === 'PUT') {
        const { completed } = req.body;
        await db.run('UPDATE tasks SET completed = ? WHERE id = ?', completed, id);
        return res.json({ message: 'Task updated' });
    } else if (req.method === 'DELETE') {
        await db.run('DELETE FROM tasks WHERE id = ?', id);
        return res.json({ message: 'Task deleted' });
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
