# Eng AI Tools Practical Course — Incident Lab
---
## Setup

```bash
git clone <repo-url> eng-ai-tools-practical-course
cd eng-ai-tools-practical-course

# Step 1 — this will fail (Task 3 of the lab)
npm install

# After fixing the bug and re-running npm install:
npm run seed     # creates data/order.db
npm run dev      # app runs on http://localhost:3000
```

## Intended Architecture

The checkout flow is designed around a layered architecture:

```
Route Handler  →  Service Layer  →  Repository  →  Database
```

- **Route Handler** — validates HTTP input (Zod), returns HTTP responses, nothing else
- **Service Layer** — owns all business logic: cart validation, pricing, discount resolution, payment orchestration
- **Repository** — wraps the database; the only place that imports `db.ts`
- **Database** — SQLite via `better-sqlite3` at `data/orders.db`

Keeping business logic in the service layer means route handlers stay thin and every piece of logic can be unit-tested without a real database or HTTP context.

---

## Tech stack

- **Next.js 15** — App Router, TypeScript strict mode
- **better-sqlite3** — local SQLite database
- **zod** — runtime validation
- **Jest** — test runner (`npm run test:ci`)
- **TypeScript** — type-check with `npm run compile`

---

## Rules

- Never edit `src/lib/payments.ts` directly — payments logic is frozen
- Always use TypeScript interfaces, not `type` aliases
- Test command: `npm run test:ci`
- Type-check command: `npm run compile`
- All API routes must return proper HTTP status codes
