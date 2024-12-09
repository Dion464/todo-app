import bcrypt from 'bcrypt';
import { Pool } from 'pg';  // PostgreSQL client
const  { dbConfig } = required('../../../lib/db');  // Adjust the path to your DB config file

const pool = new Pool(dbConfig);

export default async function handler(req, res) {
  console.log(req.method)
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
      const client = await pool.connect();

      try {
        // Check if email is already in use
        const emailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailResult = await client.query(emailQuery, [email]);
        if (emailResult.rows.length > 0) {
          return res.status(400).json({ message: 'Email is already in use' });
        }

        // Check if username is already in use
        const usernameQuery = 'SELECT * FROM users WHERE username = $1';
        const usernameResult = await client.query(usernameQuery, [username]);
        if (usernameResult.rows.length > 0) {
          return res.status(400).json({ message: 'Username is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const insertQuery =
          'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
        await client.query(insertQuery, [username, email, hashedPassword]);

        // Return success response
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error('Error interacting with DB:', error);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        client.release(); // Release the client back to the pool
      }
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
