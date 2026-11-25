/**
 * TODO (Night 9–10): build a simple admin page.
 *
 * - Gate it with ADMIN_PASSWORD (or a better auth method if you prefer).
 * - List orders: email, item, amount, status, date.
 * - Show totals (paid, refunded, net) and counts by status.
 * - Add a refund action that calls POST /api/refunds (Night 10).
 *
 * This page should only run on the server or behind an API that checks
 * the password. Do not put the admin password in client-side code.
 */

export default function AdminPage() {
  return (
    <main>
      <h1>Admin</h1>
      <p className="muted">
        TODO: protect this page, list orders and totals, and add refunds.
        See BUILD_PLAN.md, Nights 9 and 10.
      </p>
    </main>
  );
}
