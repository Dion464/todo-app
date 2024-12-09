import { Pool } from 'pg';  // PostgreSQL client
const  { dbConfig } = required('../../../lib/db');  // Adjust the path to your DB config file

const pool = new Pool(dbConfig)
export default async function handler(req, res) {
  if (req.method === 'GET') {
     return res.status(422).json({ message: 'Worked' });
  }
  // Handle method not allowed for non-POST requests
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
