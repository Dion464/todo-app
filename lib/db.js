import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { initDB } from './initDb'; 


initDB();

const openDB = async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
  return db;
};

export { openDB };
