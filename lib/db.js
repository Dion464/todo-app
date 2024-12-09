import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { join } from 'path';

export async function openDB() {
    // Use absolute path for better compatibility in production
    const dbPath = process.env.DATABASE_URL ? join(process.cwd(), process.env.DATABASE_URL) : join(process.cwd(), 'lib', 'database.sqlite');
    
    console.log('Database path:', dbPath); // Debug log to verify the path
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
}
