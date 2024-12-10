import { openDB } from '../../../lib/db';

async function openDBConnection() {
  try {
    return await openDB();
  } catch (error) {
    console.error('Failed to open DB connection:', error);
    throw error;  // Re-throw the error after logging
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await openDBConnection();
      
      // Query for total number of tasks
      const totalTasksQuery = await db.get('SELECT COUNT(*) AS total FROM tasks');
      const totalTasks = totalTasksQuery.total;

      // Query for total number of completed tasks
      const completedTasksQuery = await db.get(
        'SELECT COUNT(*) AS completed FROM tasks WHERE completed = 1'
      );
      const completedTasks = completedTasksQuery.completed;

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
