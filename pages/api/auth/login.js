import { openDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      // Check if both username and password are provided
      if (!username ) {
        console.error('Username is missing');
        return res.status(400).json({ message: 'Username is required' });
      }
// Check if both username and password are provided
if (!password ) {
  console.error('  password is missing');
  return res.status(400).json({ message: 'Password is required' });
}
      // Validate password length and uppercase requirement
      const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        console.error('Password does not meet the requirements');
        return res.status(400).json({ message: 'Password is incorrect ' });
      }

      // Open the DB and fetch the user
      const db = await openDB();
      console.log('Opening database connection...');
      const user = await db.get('SELECT * FROM users WHERE username = ?', username);

      if (!user) {
        console.error('User not found:', username);
        return res.status(401).json({ message: 'User not found' });
      }

      // Debug the user object
      console.log('User found:', user);

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.error('Invalid password for user:', username);
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Debug token generation
      console.log('Password valid. Generating token...');
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      // Log the token (be cautious in production)
      console.log('Generated token:', token);

      // Send the token back to the client
      return res.status(200).json({ token });
      
    } catch (error) {
      console.error('Error during login:', error); // Detailed logging of errors
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Handle method not allowed for non-POST requests
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
