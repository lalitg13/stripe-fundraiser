/**
 * TODO (Night 11): test refunds.
 *
 * Manual and webhook tests to cover:
 *  - A full refund updates the order to refunded and the totals change.
 *  - A partial refund marks the order partially_refunded.
 *  - Asynchronous refunds (see test cards in https://docs.stripe.com/testing):
 *      4000 0000 0000 7726  refund starts pending, later succeeds
 *      4000 0000 0000 5126  refund appears succeeded, later fails
 *  - A double click on Refund does not refund twice (idempotency key).
 *
 * You can also use `stripe trigger refund.created` while `stripe listen`
 * is running.
 */

import { describe, it } from "vitest";

describe("refunds", () => {
  it.todo("records a full refund and updates order status");
  it.todo("handles a refund that later fails without losing money twice");
  it.todo("does not create two refunds when the admin button is clicked twice");
});
