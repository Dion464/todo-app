import { queryDB } from '../../../lib/db';  // Use queryDB instead of openDB

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Query for total number of tasks
      const totalTasksResult = await queryDB('SELECT COUNT(*) AS total FROM tasks');
      const totalTasks = totalTasksResult.rows[0].total;

      // Query for total number of completed tasks
      const completedTasksResult = await queryDB('SELECT COUNT(*) AS completed FROM tasks WHERE completed = $1', [true]);
      const completedTasks = completedTasksResult.rows[0].completed;

      // If queries are successful, send the data
      res.status(200).json({
        total: totalTasks,
        completed: completedTasks,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
