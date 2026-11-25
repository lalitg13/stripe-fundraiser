/**
 * TODO (Night 7): send a receipt or confirmation email after a payment
 * is fulfilled.
 *
 * Options:
 *  - Enable Stripe's built-in receipts, then also send a short "your
 *    ticket is confirmed" email of your own if you want a custom message.
 *    https://docs.stripe.com/receipts
 *  - Use a provider such as Resend, or Nodemailer with a school-safe
 *    SMTP account.
 *
 * Only call this from the fulfillment path after the webhook has been
 * verified, and only once per order (see Night 8, idempotency).
 */

export async function sendReceipt(_input: {
  to: string;
  customerName?: string;
  productName: string;
  amountCents: number;
  currency: string;
  orderId: string;
}): Promise<void> {
  throw new Error("TODO: implement sendReceipt() — see BUILD_PLAN.md Night 7.");
}
