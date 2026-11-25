/**
 * TODO: Open the SQLite database and apply db/schema.sql if tables are missing.
 *
 * Suggested approach:
 *  - Read DATABASE_PATH from the environment (see .env.example).
 *  - Make sure the data/ directory exists.
 *  - Use better-sqlite3 (already listed in package.json).
 *  - Read and exec the SQL in db/schema.sql once on startup.
 *
 * Then add small helper functions as you need them in later milestones
 * (getProduct, insertOrder, markFulfilled, recordEvent, and so on).
 * Do not put Stripe API calls in this file.
 *
 * Note: a local SQLite file works on your laptop. It will not persist on
 * Vercel serverless. Plan on Turso (libSQL) or Supabase when you deploy.
 * See BUILD_PLAN.md, Night 2 and Night 12.
 */

export function getDb(): never {
  throw new Error("TODO: implement getDb() in lib/db.ts — see BUILD_PLAN.md Night 2.");
}
