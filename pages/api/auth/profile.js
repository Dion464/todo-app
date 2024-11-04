// pages/api/auth/profile.js
import { openDB } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { token } = req.headers; // Assuming you send a JWT token in headers

        // Verify token and get user ID (you may need to use a library like jsonwebtoken)
        // Replace this with your actual JWT verification logic
        const userId = verifyToken(token); // You need to implement the verifyToken function

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const db = await openDB();
        const user = await db.get('SELECT * FROM users WHERE id = ?', userId);
        const completedTasks = await db.all('SELECT * FROM tasks WHERE user_id = ? AND completed = 1', userId);

        if (user) {
            return res.status(200).json({ user, completedTasks });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

// Add your verifyToken function here
const verifyToken = (token) => {
    // Implement your logic to verify the JWT and extract the user ID
    // Return the user ID if valid; otherwise, return null
};
