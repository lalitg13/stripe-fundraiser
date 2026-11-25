/**
 * TODO (Night 3): turn this page into the fundraiser storefront.
 *
 * - List tickets and donation presets from your catalog (lib/products.ts / the database).
 * - Let a buyer enter their name, email, quantity, or a custom donation amount.
 * - On submit, POST to /api/checkout (you will build that on Night 4) and
 *   redirect the browser to the URL Stripe returns.
 * - Keep prices on the server. The form should send a product id (and
 *   quantity or custom amount), not a price the buyer can edit.
 */

export default function HomePage() {
  return (
    <main>
      <p className="muted">Hill Top News · test-mode starter</p>
      <h1>School fundraiser checkout</h1>
      <p>
        This is an empty storefront. Follow <code>BUILD_PLAN.md</code> and commit
        each milestone as you finish it.
      </p>
      <div className="card">
        <h2>Night 3 — what to build here</h2>
        <ul className="todo">
          <li>Show ticket and donation options from your catalog.</li>
          <li>Collect the buyer&apos;s name and email.</li>
          <li>Submit to <code>POST /api/checkout</code> and redirect to Stripe Checkout.</li>
        </ul>
      </div>
    </main>
  );
}
