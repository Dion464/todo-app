import pg from 'pg';
const { Client } =  pg;

export async function openDB() {
    // Get PostgreSQL connection details from environment variables
    const dbHost = 'ep-snowy-darkness-a2nfi7so-pooler.eu-central-1.aws.neon.tech';
    const dbPort = 5432;
    const dbName = 'neondb'
    const dbPassword = 'tBv4iLQCHM9J';

    const client = new Client({
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: 'neondb_owner',
        password: dbPassword,
        ssl: {
          rejectUnauthorized: false,  // Optional: If you want to bypass SSL certificate verification
      },
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL', error);
        throw error;
    }

    return client;
}
