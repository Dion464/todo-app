import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const openDB = async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  return db;
};
