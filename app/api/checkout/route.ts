import { NextResponse } from "next/server";

/**
 * TODO (Night 4): create a Stripe Checkout Session and return its URL.
 *
 * High-level steps (you write the code):
 *  1. Parse the request (product id, quantity, optional custom donation
 *     amount, customer name and email).
 *  2. Look up the product and price on the server. Reject invalid input.
 *  3. Create a Checkout Session in mode: "payment" with line_items,
 *     success_url, and cancel_url.
 *  4. Include metadata (order id, product id) so the webhook can
 *     fulfill later.
 *  5. Return the session URL and redirect the browser to it.
 *
 * Night 8: add an idempotency key so a double-click does not create
 * two sessions that can both be paid.
 *
 * Docs:
 *  https://docs.stripe.com/checkout/quickstart?client=next&lang=node
 *  https://docs.stripe.com/api/checkout/sessions/create
 */

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented. See the TODO in this file and BUILD_PLAN.md Night 4." },
    { status: 501 },
  );
}
