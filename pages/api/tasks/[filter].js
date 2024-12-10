import { queryDB } from '../../../lib/db';  // Use queryDB instead of openDB

export default async function handler(req, res) {
  const { filter } = req.query;
  const isTaskId = !isNaN(parseInt(filter));

  if (req.method === 'PUT') {
    if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for updating' });

    const { completed, description } = req.body;

    try {
      const result = await queryDB(
        'UPDATE tasks SET completed = $1, description = $2 WHERE id = $3 RETURNING *',
        [completed, description, filter]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task updated successfully', task: result.rows[0] });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ message: 'Error updating task', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    if (!isTaskId) return res.status(400).json({ message: 'Invalid task ID for deletion' });

    try {
      const result = await queryDB('DELETE FROM tasks WHERE id = $1 RETURNING *', [filter]);

      if (result.rows.length === 0) {
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
      const result = await queryDB('SELECT * FROM tasks WHERE id = $1', [filter]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error retrieving task:', error);
      return res.status(500).json({ message: 'Error retrieving task', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
