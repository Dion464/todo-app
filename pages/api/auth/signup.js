import bcrypt from 'bcrypt';
import { queryDB } from '../../../lib/db';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const usernameRegex = /^(?=.*[A-Z]).{5,}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: 'Username must be at least 5 characters long and include one uppercase letter',
      });
    }

    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and include one uppercase letter',
      });
    }

    try {
      const emailCheck = await queryDB('SELECT * FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      const usernameCheck = await queryDB('SELECT * FROM users WHERE username = $1', [username]);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Username is already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await queryDB(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
