import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDB();
  const { userId, completed } = req.query; // Get userId and completed filter from query parameters

  if (req.method === 'GET') {
    try {
      let tasks;
      // If userId is provided, filter tasks by userId
      if (userId) {
        if (completed !== undefined) {
          tasks = await db.all('SELECT * FROM tasks WHERE user_id = ? AND completed = ?', [userId, completed === '1' ? 1 : 0]);
        } else {
          // If no completed filter, fetch all tasks for the user
          tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        }
      } else {
        // If no userId is provided, fetch all tasks (if needed)
        tasks = await db.all('SELECT * FROM tasks');
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
      const result = await db.run(
        'INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)',
        [title, false, userId]
      );
      const newTask = { id: result.lastID, title, completed: false, user_id: userId };
      return res.status(201).json(newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      return res.status(500).json({ message: 'Error adding task', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } 
}
