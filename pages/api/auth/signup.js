import bcrypt from 'bcrypt';
import { openDB } from '../../../lib/db'; // Adjust this path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Validate username length and uppercase requirement
    const usernameRegex = /^(?=.*[A-Z]).{5,}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: 'Username must be at least 5 characters long and include at least one uppercase letter',
      });
    }

    // Validate password length and uppercase requirement
    const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and include an uppercase letter',
      });
    }

    try {
      // Open the database connection
      const db = await openDB();

      // Check if email is already in use
      const existingEmail = await db.get('SELECT * FROM users WHERE email = ?', email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      // Check if username is already in use
      const existingUsername = await db.get('SELECT * FROM users WHERE username = ?', username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
        username,
        email,
        hashedPassword,
      ]);

      // Return success response
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
