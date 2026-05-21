import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const DB_PATH = path.resolve(
  process.cwd(),
  process.env.DATABASE_URL ?? "data/orders.db"
);

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

interface SeedItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface SeedOrder {
  items: SeedItem[];
  discount: number;
  createdAt: string;
}

const SEED_ORDERS: SeedOrder[] = [
  {
    items: [
      { productId: "prod_001", name: "TypeScript Handbook", price: 49.99, quantity: 1 },
      { productId: "prod_002", name: "Mechanical Keyboard", price: 149.99, quantity: 1 },
    ],
    discount: 0,
    createdAt: "2026-05-15T09:12:00Z",
  },
  {
    items: [
      { productId: "prod_003", name: "USB-C Hub", price: 39.5, quantity: 2 },
    ],
    discount: 7.9,
    createdAt: "2026-05-17T14:03:00Z",
  },
  {
    items: [
      { productId: "prod_004", name: "Standing Desk Mat", price: 60.0, quantity: 1 },
    ],
    // Intentionally suspicious row: discount > 50% of subtotal.
    discount: 45.0,
    createdAt: "2026-05-18T08:48:00Z",
  },
  {
    items: [
      { productId: "prod_001", name: "TypeScript Handbook", price: 49.99, quantity: 3 },
    ],
    discount: 15.0,
    createdAt: "2026-05-19T11:30:00Z",
  },
  {
    items: [
      { productId: "prod_002", name: "Mechanical Keyboard", price: 149.99, quantity: 1 },
      { productId: "prod_003", name: "USB-C Hub", price: 39.5, quantity: 1 },
    ],
    discount: 18.95,
    createdAt: "2026-05-20T16:15:00Z",
  },
];

const insert = db.prepare(`
  INSERT INTO orders (id, items_json, subtotal, discount, total, created_at)
  VALUES (@id, @itemsJson, @subtotal, @discount, @total, @createdAt)
`);

const insertMany = db.transaction((orders: SeedOrder[]) => {
  for (const o of orders) {
    const subtotal = o.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const total = Math.max(0, subtotal - o.discount);
    insert.run({
      id: randomUUID(),
      itemsJson: JSON.stringify(o.items),
      subtotal,
      discount: o.discount,
      total,
      createdAt: o.createdAt,
    });
  }
});

insertMany(SEED_ORDERS);

const count = db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number };
console.log(`Seeded ${SEED_ORDERS.length} order(s). Total rows in orders table: ${count.n}`);
console.log(`Database: ${DB_PATH}`);
