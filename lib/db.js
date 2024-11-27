// lib/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const openDB = async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
  return db;
};

export { openDB };
