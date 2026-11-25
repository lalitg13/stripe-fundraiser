import { NextResponse } from "next/server";

/**
 * TODO (Night 10): create a Stripe refund for a paid order.
 *
 * High-level steps (you write the code):
 *  1. Require the admin password (or better auth).
 *  2. Load the order. Only refund paid (or partially refunded) orders.
 *  3. Call stripe.refunds.create with the PaymentIntent (or Charge) and
 *     an optional amount for partial refunds.
 *  4. Use an idempotency key (for example based on the order id and
 *     amount) so a double-click does not issue two refunds.
 *  5. Store the refund row and let webhooks update the final status
 *     (refunds can stay pending or later fail — see test cards).
 *
 * Docs:
 *  https://docs.stripe.com/refunds
 *  https://docs.stripe.com/api/refunds/create?lang=node
 *  https://docs.stripe.com/api/idempotent_requests
 */

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented. See the TODO in this file and BUILD_PLAN.md Night 10." },
    { status: 501 },
  );
}
