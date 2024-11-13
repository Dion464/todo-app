import { openDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body;

            // Check if both username and password are provided
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const db = await openDB();
            const user = await db.get('SELECT * FROM users WHERE username = ?', username);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.status(200).json({ token });
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
