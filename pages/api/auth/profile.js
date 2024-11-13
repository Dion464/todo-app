import jwt from 'jsonwebtoken';
import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = await openDB();
      const userData = await db.get('SELECT * FROM users WHERE id = ?', decoded.id);

      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(userData);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    const token = req.headers.authorization?.split(' ')[1];
    const { newUsername } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = await openDB();

      // Check if the new username is already taken
      const existingUser = await db.get('SELECT * FROM users WHERE username = ?', newUsername);
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already in use' });
      }

      // Update the username
      await db.run('UPDATE users SET username = ? WHERE id = ?', [newUsername, decoded.id]);
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
      console.error('Error updating username:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
