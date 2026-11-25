/**
 * TODO (Night 11): test duplicate webhook events.
 *
 * Stripe retries events, and `stripe listen` plus `stripe trigger`
 * can send the same type of event more than once.
 *
 * Ideas:
 *  - Call your fulfill function twice with the same session id /
 *    event id and assert the order is inserted once and the receipt
 *    is sent once.
 *  - Replay the same event.id through the webhook handler.
 *  - Confirm a forged or unsigned payload is rejected.
 *
 * Docs: https://docs.stripe.com/webhooks
 *       https://docs.stripe.com/checkout/fulfillment
 */

import { describe, it } from "vitest";

describe("duplicate webhook events", () => {
  it.todo("fulfills an order only once when the same event is delivered twice");
  it.todo("rejects a webhook with a missing or invalid Stripe signature");
});
