import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDB();
  const { userId, completed, category } = req.query; // Get userId, completed, and category from query parameters

  if (req.method === 'GET') {
    try {
      let tasks;
      // Filter by userId and category (if provided)
      if (userId) {
        if (completed !== undefined && category) {
          tasks = await db.all(
            'SELECT * FROM tasks WHERE user_id = ? AND completed = ? AND category = ?',
            [userId, completed === '1' ? 1 : 0, category]
          );
        } else if (completed !== undefined) {
          tasks = await db.all('SELECT * FROM tasks WHERE user_id = ? AND completed = ?', [userId, completed === '1' ? 1 : 0]);
        } else if (category) {
          tasks = await db.all('SELECT * FROM tasks WHERE user_id = ? AND category = ?', [userId, category]);
        } else {
          tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        }
      } else {
        tasks = await db.all('SELECT * FROM tasks');
      }

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
  } else if (req.method === 'POST') {
    const { title, description, userId, category } = req.body;
    if (!title || !userId || !category) {
      return res.status(400).json({ message: 'Task title, user ID, and category are required' });
    }

    try {
      const result = await db.run(
        'INSERT INTO tasks (title, description, completed, user_id, category) VALUES (?, ?, ?, ?, ?)',
        [title, description, false, userId, category]
      );
      const newTask = { id: result.lastID, title, description, completed: false, user_id: userId, category };
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
