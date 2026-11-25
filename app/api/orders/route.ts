import { NextResponse } from "next/server";

/**
 * TODO (Night 9): return orders and totals for the admin page.
 *
 * High-level steps (you write the code):
 *  1. Require the admin password (or better auth).
 *  2. Query orders (and refunds) from SQLite.
 *  3. Return a JSON list plus totals: paid, refunded, net, counts.
 *
 * Keep this on the server. Do not expose it without a secret.
 */

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented. See the TODO in this file and BUILD_PLAN.md Night 9." },
    { status: 501 },
  );
}
