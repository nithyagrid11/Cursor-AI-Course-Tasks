import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.resolve(
  process.cwd(),
  process.env.DATABASE_URL ?? "data/orders.db"
);

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id          TEXT PRIMARY KEY,
      items_json  TEXT NOT NULL,
      subtotal    REAL NOT NULL,
      discount    REAL NOT NULL,
      total       REAL NOT NULL,
      created_at  TEXT NOT NULL
    )
  `);

  _db = db;
  return _db;
}

export function saveOrder(order: {
  id: string;
  itemsJson: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
}): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO orders (id, items_json, subtotal, discount, total, created_at)
    VALUES (@id, @itemsJson, @subtotal, @discount, @total, @createdAt)
  `);
  stmt.run(order);
}

export function getOrder(id: string): Record<string, unknown> | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM orders WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
}
