/**
 * TODO (Night 5): thank the buyer after Stripe redirects them here.
 *
 * You may read the Checkout Session ID from the query string and display
 * a confirmation, but do NOT fulfill the order or send the receipt on
 * this page. The buyer might close the tab before it loads. Fulfillment
 * belongs in the webhook (Night 6–7).
 *
 * Docs: https://docs.stripe.com/checkout/fulfillment
 */

export default function SuccessPage() {
  return (
    <main>
      <h1>Payment complete</h1>
      <p className="muted">
        TODO: show a confirmation. Do not record the order or email a receipt
        from this page — wait for the webhook.
      </p>
    </main>
  );
}
