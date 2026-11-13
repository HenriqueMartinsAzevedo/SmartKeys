
import * as SQLite from 'expo-sqlite';

let database: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase() {
  if (!database) {
    database = SQLite.openDatabaseAsync('smartkeys.db');
  }

  const db = await database;

  await db.execAsync('PRAGMA foreign_keys = ON;');

  return db;
}
