import openDb from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query; // Task ID from the URL
  const db = await openDb();

  if (req.method === 'GET') {
    try {
      const subtasks = await db.all('SELECT * FROM subtasks WHERE task_id = ?', id); // Fetch subtasks for a specific task
      res.json(subtasks);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving subtasks', error });
    }
  } else if (req.method === 'POST') {
    const { title } = req.body;
    const userId = 1; // Replace this with your actual user logic

    try {
      await db.run('INSERT INTO subtasks (task_id, title, completed, user_id) VALUES (?, ?, ?, ?)', [id, title, false, userId]);
      return res.status(201).json({ message: 'Subtask created successfully' });
    } catch (error) {
      console.error('Error creating subtask:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
