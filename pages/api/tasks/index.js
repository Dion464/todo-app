import { queryDB } from '../../../lib/db';  // Use queryDB instead of openDB

export default async function handler(req, res) {
  const { userId, completed, category } = req.query;

  if (req.method === 'GET') {
    try {
      let query = 'SELECT * FROM tasks';
      const params = [];

      // Handle filters based on query parameters
      if (userId) {
        query += ' WHERE user_id = $1';
        params.push(userId);

        if (completed !== undefined && category) {
          query += ' AND completed = $2 AND category = $3';
          params.push(completed === '1' ? true : false, category);
        } else if (completed !== undefined) {
          query += ' AND completed = $2';
          params.push(completed === '1' ? true : false);
        } else if (category) {
          query += ' AND category = $2';
          params.push(category);
        }
      } else {
        if (completed !== undefined && category) {
          query += ' WHERE completed = $1 AND category = $2';
          params.push(completed === '1' ? true : false, category);
        } else if (completed !== undefined) {
          query += ' WHERE completed = $1';
          params.push(completed === '1' ? true : false);
        } else if (category) {
          query += ' WHERE category = $1';
          params.push(category);
        }
      }

      // Execute the query
      const result = await queryDB(query, params);
      return res.status(200).json(result.rows);
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
      const result = await queryDB(
        'INSERT INTO tasks (title, description, completed, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, false, userId, category]
      );

      const newTask = result.rows[0];
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
