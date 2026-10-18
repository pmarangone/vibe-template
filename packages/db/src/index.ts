import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { items } from "./schema.js";

export { items };

/** SQLite file for the app data. Defaults under apps/api/data (gitignored).
 * Time: O(1); Space: O(1). */
export function dbPathFromEnv(): string {
  return process.env.VIBE_DB_PATH ?? "../api/data/app.db";
}

export type Db = ReturnType<typeof openDb>;

/** Open the database and create the items table if missing.
 * Time: O(1) statements; Space: O(1) single connection. */
export function openDb(dbPath?: string) {
  const path = dbPath ?? dbPathFromEnv();
  mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created_at TEXT NOT NULL)"
  );
  return drizzle(sqlite, { schema: { items } });
}
