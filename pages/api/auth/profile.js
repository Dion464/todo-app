import jwt from 'jsonwebtoken';
import { queryDB } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await queryDB(userQuery, [decoded.id]);
      const userData = userResult.rows[0];

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

    // Validate username
    const usernameRegex = /^(?=.*[A-Z]).{5,}$/;
    if (!usernameRegex.test(newUsername)) {
      return res
        .status(400)
        .json({ message: 'Username must have at least one uppercase letter and be at least 5 characters long.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usernameCheckQuery = 'SELECT * FROM users WHERE username = $1';
      const existingUser = await queryDB(usernameCheckQuery, [newUsername]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Username is already in use' });
      }

      const updateUsernameQuery = 'UPDATE users SET username = $1 WHERE id = $2';
      await queryDB(updateUsernameQuery, [newUsername, decoded.id]);
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
