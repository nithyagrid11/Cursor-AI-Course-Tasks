# Project conventions

- This project is a Next.js 15 application. Follow Next.js 15 App Router conventions when adding or changing application code.
- Write TypeScript that passes strict mode. Keep types explicit where inference is unclear, handle nullable values, and do not introduce `any` without a compelling reason.
- Use `better-sqlite3` for SQLite database access. Keep database operations in server-only code and use its synchronous API consistently.
- Run the CI test suite with `npm run test:ci` after making relevant changes.
- The payments module (`src/lib/payments.ts`) must never be edited directly.
- All API routes must return proper HTTP status codes; never return a silent `200` for errors.
- Always use TypeScript interfaces, not type aliases.

## Testing standards for `src/**/*.ts`

When creating or modifying a TypeScript `.ts` source file under `src/`:

1. **Test file required** — Every `src/lib/*.ts` file must have a corresponding test at `src/__tests__/*.test.ts`.
2. **Test structure** — Import and use `describe` and `it` from `@jest/globals`; do not rely on Jest globals.
3. **Edge cases** — Every function must have at least one edge-case test, such as empty input, boundary values, or error paths.
4. **No database mocks** — Use a real SQLite database for integration tests. Mock only external HTTP calls.
5. **Naming** — Test descriptions must start with a verb, such as "returns", "throws", or "calculates".
