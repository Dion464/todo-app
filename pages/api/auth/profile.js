
import jwt from 'jsonwebtoken';
import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      // Log the token to see if it's correct
      console.log('Token:', token);

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Log the decoded token to check the payload

      // Open the database connection
      const db = await openDB();

      // Fetch user data from the database
      const userData = await db.get('SELECT * FROM users WHERE id = ?', decoded.id);

      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(userData); // Return the profile data
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Only GET method is allowed for profile
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
