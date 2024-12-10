import bcrypt from 'bcrypt';
import { queryDB } from '../../../lib/db'; // Import the queryDB function from db.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Validate the username: at least 5 characters, and include one uppercase letter
    const usernameRegex = /^(?=.*[A-Z]).{5,}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: 'Username must be at least 5 characters long and include one uppercase letter',
      });
    }

    // Validate the password: at least 6 characters, and include one uppercase letter
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and include one uppercase letter',
      });
    }

    try {
      // Check if the email already exists in the database
      const emailCheck = await queryDB('SELECT * FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      // Check if the username already exists in the database
      const usernameCheck = await queryDB('SELECT * FROM users WHERE username = $1', [username]);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Username is already in use' });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await queryDB(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );

      // Respond with success message
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
