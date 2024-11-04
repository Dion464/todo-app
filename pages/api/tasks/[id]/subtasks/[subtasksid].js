import openDb from '../../../../lib/db';

export default async function handler(req, res) {
  const { subtaskId } = req.query; // Subtask ID from the URL
  const db = await openDb();

  if (req.method === 'PUT') {
    const { completed } = req.body;
    try {
      await db.run('UPDATE subtasks SET completed = ? WHERE id = ?', completed, subtaskId);
      res.json({ message: 'Subtask updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating subtask', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.run('DELETE FROM subtasks WHERE id = ?', subtaskId);
      res.json({ message: 'Subtask deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting subtask', error });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
