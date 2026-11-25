# Build plan: school fundraiser checkout

You are building this project. This folder is only a starter: routes and helpers
are stubs with TODOs. Write the real logic yourself, and make a git commit at
the end of each night after the acceptance checks pass. Small, real commits
over several days are more useful than one giant dump — and they should
reflect work you actually did, because you will have to explain it.

Suggested cadence: one milestone a night, about two weeks. Skip ahead only if
you already understand that step.

Stack: Next.js (App Router, TypeScript), SQLite on your laptop, the official
`stripe` Node library, the Stripe CLI, later Vercel. Stay in **test mode** the
whole time. No real money, no live keys, no real card numbers.

---

## Setup (do this before Night 1 coding)

### 1. Stripe test account

1. Create or sign in at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Turn **Test mode** on (toggle in the Dashboard). You should see test data
   only, and keys that start with `sk_test_` and `pk_test_`.
3. Open [API keys](https://dashboard.stripe.com/test/apikeys) and copy the
   secret key and the publishable key.

Read [API keys](https://docs.stripe.com/keys) and
[key best practices](https://docs.stripe.com/keys-best-practices). Never put a
secret key in a client component, a git commit, a README, or a screenshot.

### 2. This repo, on your machine

```bash
cd stripe-fundraiser-starter
cp .env.example .env.local
# paste your sk_test_ and pk_test_ values into .env.local
npm install
npm run dev
```

If `better-sqlite3` fails to install, it is because it uses a native
addon. Approve its install script (`npm install-scripts approve better-sqlite3`
on npm 11+) or install build tools (`python3`, `make`, a C++ compiler) and
rerun `npm install`.

Open [http://localhost:3000](http://localhost:3000). You should see the
placeholder storefront. The API routes currently return `501 Not implemented`
until you fill them in.

### 3. Stripe CLI

Install the CLI: [https://docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli).

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

The CLI prints a webhook signing secret that starts with `whsec_`. Put that
value in `.env.local` as `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`
whenever the secret changes. Leave `stripe listen` running in its own terminal
while you test payments locally.

You can fire a fake event with `stripe trigger checkout.session.completed`.
Until Night 6, the webhook route will still return 501, which is expected.

### 4. Create your git repo (you do this, not the starter)

This starter is not a git repository on purpose. When you are ready:

```bash
cd stripe-fundraiser-starter
git init
git add .
git status   # confirm .env.local is NOT listed
git commit -m "Initial commit: fundraiser starter scaffold"
```

Add the GitHub remote for your `lalitg13` account and push when you want.
Commit after each milestone below, using the suggested message or something
just as specific.

---

## Night 1 — Project setup and a working Stripe client

**Goal.** Run the app locally with test keys loaded, and initialize the Stripe
SDK on the server only.

**Concepts to learn**

- Test mode vs live mode; why this project never uses `sk_live_` keys.
  [API keys](https://docs.stripe.com/keys),
  [Testing](https://docs.stripe.com/testing)
- Official Node library:
  [Server-side SDKs (Node)](https://docs.stripe.com/sdks/server-side?lang=node)
- Stripe CLI login and listen:
  [Stripe CLI](https://docs.stripe.com/stripe-cli)

**What to implement**

- `getStripe()` in `lib/stripe.ts` using `STRIPE_SECRET_KEY`.
- Confirm `.env.local` is ignored by git.

**Acceptance checks**

- [ ] `npm run dev` starts without errors.
- [ ] `stripe listen --forward-to localhost:3000/api/webhook` connects and
      prints a `whsec_` secret.
- [ ] A temporary server-only log (remove it before you commit if it prints
      the key) can construct a Stripe client. Missing keys should throw a
      clear error.
- [ ] `git status` does not show `.env.local`.

**Suggested commit message:** `Initialize Stripe test client and local env setup`

---

## Night 2 — Database schema and product catalog

**Goal.** Apply `db/schema.sql`, seed the example products, and read them from
code.

**Concepts to learn**

- Amounts are integers in **cents**, not dollars.
  [Zero-decimal currencies](https://docs.stripe.com/currencies)
- The server is the source of truth for prices. If the browser says "charge
  $1," ignore that and look up the product.
- Local SQLite (via `better-sqlite3`) is perfect on your laptop. A SQLite
  *file* will not survive on Vercel serverless. When you deploy (Night 12),
  switch the same SQL to [Turso](https://docs.turso.tech/) (libSQL) or
  [Supabase](https://supabase.com/docs). You do not need to do that tonight.

**What to implement**

- `getDb()` in `lib/db.ts`: open `DATABASE_PATH`, create the folder if needed,
  and execute `db/schema.sql`.
- `listProducts()` and `getProduct()` in `lib/products.ts`.
- Optional: change the seed products so they match a real Hill Top News
  fundraiser or club event.

**Acceptance checks**

- [ ] Restarting the app creates `data/fundraiser.db` (or your configured path).
- [ ] The products table contains the ticket and donation rows.
- [ ] `getProduct('ticket-general')` returns 1500 cents (or your price), not a
      value from the request.

**Suggested commit message:** `Add SQLite schema and fundraiser product catalog`

---

## Night 3 — Storefront UI (no charges yet)

**Goal.** Build the home page so a buyer can pick a ticket or donation and
enter their name and email.

**Concepts to learn**

- Keep this page simple. A form that posts a `productId`, `quantity`, and
  maybe `customAmountCents` is enough.
- For a custom donation, decide a minimum and maximum (for example $1–$500)
  and enforce them later on the server, not only in the browser.
- Styling can stay minimal. A clean page beats a fancy one you can't explain.

**What to implement**

- Replace the placeholder in `app/page.tsx` with a real catalog and form.
- You can leave the submit handler wired to `/api/checkout` even though that
  route still returns 501 until tomorrow.

**Acceptance checks**

- [ ] The home page lists each active product and its price in dollars
      (convert from cents only for display).
- [ ] The form collects name, email, and quantity or a custom amount.
- [ ] Submitting without a finished checkout route fails clearly, not silently.

**Suggested commit message:** `Add fundraiser storefront for tickets and donations`

---

## Night 4 — Create a Stripe Checkout Session

**Goal.** Clicking Pay on your site redirects the buyer to Stripe-hosted
Checkout in test mode.

**Concepts to learn**

- A Checkout Session is created **on your server**, then the browser goes to
  `session.url`.
  [Checkout quickstart (Next.js)](https://docs.stripe.com/checkout/quickstart?client=next&lang=node),
  [Create a Session](https://docs.stripe.com/api/checkout/sessions/create)
- Use `mode: 'payment'` for one-time tickets and donations.
- `line_items` should use `price_data` (or a Price you created in the
  Dashboard). The amount must come from your catalog.
- Set `success_url` and `cancel_url`. You can include
  `{CHECKOUT_SESSION_ID}` in the success URL.
- Put your own `orderId`, product id, and email in `metadata` so the webhook
  can fulfill later.
- You may create a `pending` order row before redirecting the buyer.

**What to implement**

- `POST` in `app/api/checkout/route.ts`.
- On the storefront, after a successful response, redirect with
  `window.location.href = url` (or a server redirect). Don't try to `fetch`
  Stripe's Checkout page directly.

**Acceptance checks**

- [ ] Choosing a ticket and submitting lands you on Stripe Checkout (test).
- [ ] The amount shown by Stripe matches your catalog, even if you tamper
      with a hidden form field.
- [ ] A custom donation of $0 or a negative amount is rejected.
- [ ] Pay with card `4242 4242 4242 4242`, any future expiry, any CVC, any
      ZIP. Use any test email. You should reach `/success` after paying
      (the success page can still be a placeholder tonight).
  [Test cards](https://docs.stripe.com/testing)

**Suggested commit message:** `Create Stripe Checkout Sessions for tickets and donations`

---

## Night 5 — Success and cancel pages

**Goal.** After Checkout, the buyer sees a clear confirmation or a "try
again" page.

**Concepts to learn**

- Fulfillment must **not** happen only on the success page. The buyer can
  pay and close the tab, or their connection can drop.
  [Fulfill orders](https://docs.stripe.com/checkout/fulfillment)
- The success page may *display* session details (retrieve the session by
  id on the server). It should not be the only place you insert the order
  or send email.

**What to implement**

- `app/success/page.tsx` and `app/cancel/page.tsx`.
- Link back to the storefront from the cancel page.

**Acceptance checks**

- [ ] A successful test payment shows a thank-you message (name or amount
      is a plus).
- [ ] Clicking back on Checkout lands on `/cancel` with a way to retry.
- [ ] Completing a payment and then closing the tab before `/success` loads
      does not prevent you from seeing the payment in the Stripe Dashboard.
      (Order fulfillment still comes next.)

**Suggested commit message:** `Add checkout success and cancel pages`

---

## Night 6 — Webhook endpoint and signature verification

**Goal.** Your app accepts Stripe events, proves they really came from
Stripe, and logs the event type. You do not have to fulfill orders yet.

**Concepts to learn**

- Why webhooks exist, and how `stripe listen` forwards them to localhost.
  [Receive webhooks](https://docs.stripe.com/webhooks)
- Signature verification: `Stripe-Signature` header + raw body +
  `STRIPE_WEBHOOK_SECRET`. If the framework parses JSON first, verification
  fails.
  [Manage webhook endpoints](https://docs.stripe.com/events/manage-webhook-endpoints)
  (see the Next.js App Router note)
- Return a 2xx after you have accepted the event. Return 400 for a bad
  signature so you notice during development.

**What to implement**

- `POST` in `app/api/webhook/route.ts`: read `await request.text()`, verify
  with `stripe.webhooks.constructEvent`, log `event.type` and `event.id`.

**Acceptance checks**

- [ ] With `stripe listen` running, `stripe trigger checkout.session.completed`
      shows a `200` in the CLI (not 400 or 501).
- [ ] Your server log shows the event type.
- [ ] A request with no signature, or a made-up body, returns 400 and is
      not treated as a real event.

**Suggested commit message:** `Verify Stripe webhook signatures and log events`

---

## Night 7 — Fulfill orders and send receipts

**Goal.** When a payment succeeds, you record the order and email a receipt.
The webhook is the source of truth.

**Concepts to learn**

- Listen for `checkout.session.completed`. If you later add delayed payment
  methods, also handle `checkout.session.async_payment_succeeded` and
  `checkout.session.async_payment_failed`.
  [Fulfill orders](https://docs.stripe.com/checkout/fulfillment)
- Retrieve the Session from the API if you need `line_items` or a
  `payment_intent`. Check `payment_status` before fulfilling.
- Receipts: you can enable
  [Stripe receipts](https://docs.stripe.com/receipts) and/or send your own
  confirmation from `lib/email.ts` (Resend, Nodemailer, etc.).
- Do not fulfill from the success page even if you now have a webhook.

**What to implement**

- A `fulfillOrder(session)` function used by the webhook.
- Insert or update the `orders` row: amount, email, `checkout_session_id`,
  `payment_intent_id`, status `paid` / `fulfilled`.
- `sendReceipt()` — even a "write to console / save a file" stand-in is OK
  tonight if email setup is slow, but aim for a real test email to yourself.

**Acceptance checks**

- [ ] After a successful test payment, a row appears in `orders` with the
      right amount and email, without you having to open `/success`.
- [ ] You receive a receipt (or you can show a saved email body in the
      project).
- [ ] A failed or canceled Checkout does not create a paid order.

**Suggested commit message:** `Fulfill orders from webhooks and send receipts`

---

## Night 8 — Idempotency: no double charges, no double fulfillment

**Goal.** A double-click on Pay, or Stripe delivering the same event twice,
does not charge twice, insert two orders, or send two emails.

This is the decision interviewers will ask about. Be ready to explain it.

**Concepts to learn**

- [Idempotent requests](https://docs.stripe.com/api/idempotent_requests):
  send an `Idempotency-Key` when you create a Checkout Session or a refund,
  so a retried API call cannot create a second object.
- [Prevent extra fulfillments](https://docs.stripe.com/checkout/fulfillment):
  your fulfill function must be safe to run twice for the same Session,
  including at the same time.
- Use the unique `checkout_session_id` on `orders`, and insert
  `event.id` into `processed_events` (see the schema). If the insert is a
  no-op because the id already exists, skip the work. If fulfillment
  *fails*, do not keep a "processed" row that would hide a retry — or
  return an error so Stripe retries.

**What to implement**

- Idempotency keys on Checkout Session creation (Night 4 route).
- Deduping in the webhook / fulfill path.
- Optional but strong: if the buyer submits the same form twice quickly,
  reuse a pending session instead of opening two payable sessions.

**Acceptance checks**

- [ ] Delivering the same webhook event twice (or calling fulfill twice
      with the same session id) creates one order and one receipt.
- [ ] Clicking Pay twice in a row does not leave you with two successful
      charges for one intended purchase. (Test carefully in test mode and
      write down what you observed.)

**Suggested commit message:** `Make checkout and webhook fulfillment idempotent`

---

## Night 9 — Admin page: orders and totals

**Goal.** A protected `/admin` page lists orders and shows totals.

**Concepts to learn**

- This is a personal demo, so a shared `ADMIN_PASSWORD` checked only on
  the server is enough. Do not put that password in client-side JavaScript.
  Do not ship it in the README.
- Totals should come from the database: count and sum by status, plus
  refunded amounts (even if refunds land tomorrow).

**What to implement**

- `GET` in `app/api/orders/route.ts` (password-gated).
- `app/admin/page.tsx`: table of orders (date, email, item, amount, status)
  and a summary (paid, refunded, net, number of tickets).

**Acceptance checks**

- [ ] Without the password, admin data is not visible.
- [ ] A test purchase you just made shows up in the list with the correct
      amount.
- [ ] Summary numbers match the rows on the page.

**Suggested commit message:** `Add admin page for orders and fundraising totals`

---

## Night 10 — Refunds

**Goal.** From the admin page, refund all or part of a paid order. The
order status and totals update, including when a refund is delayed or fails.

**Concepts to learn**

- [Refunds](https://docs.stripe.com/refunds),
  [Create a refund (Node)](https://docs.stripe.com/api/refunds/create?lang=node)
- Refund the PaymentIntent (or Charge). Partial refunds use `amount` in
  cents. You cannot refund more than remains.
- Refunds are not always instant. Test cards in
  [Testing](https://docs.stripe.com/testing) cover a refund that starts
  `pending` then succeeds (`4000 0000 0000 7726`) and one that later fails
  (`4000 0000 0000 5126`).
- Listen for `refund.created`, `refund.updated`, `refund.failed`, and/or
  `charge.refunded`, and keep your `refunds` table in sync.
- Use an idempotency key so a double click does not issue two refunds.

**What to implement**

- `POST` in `app/api/refunds/route.ts`.
- A refund button (and optional amount field) on the admin page.
- Webhook handling that updates refund and order status.

**Acceptance checks**

- [ ] A full refund of a test payment shows up in the Stripe Dashboard and
      in your admin list.
- [ ] Totals decrease correctly for full and partial refunds.
- [ ] Clicking Refund twice does not refund twice.
- [ ] You have tried at least one of the async refund test cards and
      recorded what happened to the status.

**Suggested commit message:** `Add admin refunds and refund webhook handling`

---

## Night 11 — Tests for declines, refunds, and duplicate events

**Goal.** Prove the tricky cases, in writing. Manual test notes plus
automated tests in `tests/`.

**Concepts to learn**

- [Test cards and payment scenarios](https://docs.stripe.com/testing)
  - Success: `4242 4242 4242 4242`
  - Generic decline: `4000 0000 0000 0002`
  - Insufficient funds: `4000 0000 0000 9995`
  - Async refund cards: see Night 10
- `stripe trigger` and `stripe listen` for webhook replay.
- Vitest is already listed (`npm test`). Replace the `it.todo` cases in
  `tests/` with real assertions against your helpers (especially fulfill
  and signature rejection). You do not need to browser-automate Checkout
  for every case.

**What to implement**

- Fill in `tests/declines.test.ts`, `tests/refunds.test.ts`, and
  `tests/duplicate-events.test.ts`.
- A short "How I tested" section you can paste into the README tomorrow
  (cards used, events replayed, what you saw).

**Acceptance checks**

- [ ] A declined card never marks an order paid and never sends a receipt.
- [ ] `npm test` covers: duplicate event / double fulfill, invalid webhook
      signature, and at least one refund rule (for example, no double
      refund, or status updates).
- [ ] You have written down the manual Checkout tests you ran.

**Suggested commit message:** `Add tests for declines, refunds, and duplicate events`

---

## Night 12 — README, polish, and a public test-mode deploy

**Goal.** A stranger (or an interviewer) can understand the problem, your
decisions, and how you tested, and can click a live demo that still uses
test keys only.

**Concepts to learn**

- [Vercel environment variables](https://vercel.com/docs/environment-variables)
  for `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the database URL.
- After you have a public HTTPS URL, add a Dashboard webhook endpoint
  pointing at `https://your-domain/api/webhook` (still in test mode) and
  use *that* endpoint's `whsec_` secret in Vercel. `stripe listen` is
  only for localhost.
  [Webhooks](https://docs.stripe.com/webhooks)
- SQLite file storage will not persist on Vercel. Move the database to
  Turso or Supabase before you rely on the live demo.

**What to implement**

- Fill in `README.md` using the template already in that file.
- Fix rough edges (empty states, error messages, a 1–2 minute demo video
  or GIF: start checkout, pay with `4242`, see the admin order, refund).
- Deploy to Vercel, confirm a test payment works end to end, and link the
  repo and the demo from the README.

**Acceptance checks**

- [ ] README covers the problem, your technical decisions (especially
      idempotency and "fulfill in the webhook"), how you tested, and what
      you would improve.
- [ ] A test-mode payment against the deployed URL creates an order.
- [ ] No live keys, no real customer data, and no `.env.local` in git.

**Suggested commit message:** `Document the project and deploy the test-mode demo`

---

## After the plan

Practice explaining, out loud, for one of your strongest moments:

1. What problem you were solving.
2. What you personally built.
3. The hardest technical decision (double fulfillment and double charges
   is a good one).
4. How you tested it.
5. What you would do next if you had another week.

Those are the same questions a software internship application will ask.
If you cannot answer them from memory, the README is not done, and neither
is the project.

Keep every commit honest. If a friend or a tool helps you debug, that is
fine — you should still be able to walk through every file you ship.
