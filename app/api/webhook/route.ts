import { NextResponse } from "next/server";

/**
 * TODO (Night 6–8): verify and handle Stripe webhook events.
 *
 * High-level steps (you write the code):
 *  1. Read the RAW request body as text. If you parse JSON first,
 *     signature verification will fail.
 *  2. Verify the Stripe-Signature header with your webhook secret
 *     (stripe.webhooks.constructEvent). Reject invalid signatures
 *     with 400.
 *  3. Handle checkout.session.completed (and async_payment_succeeded
 *     if you allow delayed payment methods). Retrieve the session if
 *     you need line items, then fulfill the order and send the receipt
 *     (Night 7).
 *  4. Handle refund events on Night 10 (refund.created, refund.updated,
 *     refund.failed, charge.refunded).
 *  5. Return a 2xx quickly after you have accepted the event.
 *  6. Night 8: record event.id in processed_events so retries do not
 *     fulfill twice. Also make fulfill-by-session-id safe if two
 *     events arrive at the same time.
 *
 * Local testing:
 *  stripe listen --forward-to localhost:3000/api/webhook
 *
 * Docs:
 *  https://docs.stripe.com/webhooks
 *  https://docs.stripe.com/events/manage-webhook-endpoints
 *  https://docs.stripe.com/checkout/fulfillment
 */

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented. See the TODO in this file and BUILD_PLAN.md Night 6." },
    { status: 501 },
  );
}
