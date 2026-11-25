/**
 * TODO (Night 11): test declined payments.
 *
 * Start by testing manually with Stripe test cards
 * (https://docs.stripe.com/testing), then automate what you can:
 *  - 4000 0000 0000 0002  generic decline
 *  - 4000 0000 0000 9995  insufficient funds
 *
 * After a decline, no order should be marked paid or fulfilled, and no
 * receipt should be sent. A pending row is OK if you created it before
 * Checkout, but it must not flip to paid.
 */

import { describe, it } from "vitest";

describe("declined cards", () => {
  it.todo("does not mark an order paid when the card is declined");
  it.todo("does not send a receipt for a declined payment");
});
