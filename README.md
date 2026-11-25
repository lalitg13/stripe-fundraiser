# School Fundraiser Checkout

Stripe **test-mode** checkout for school fundraiser tickets and donations
(for example, Hill Top News). Buyers pay on Stripe-hosted Checkout. A
webhook records the order and sends a receipt. An admin page lists orders,
totals, and refunds.

This repository started from a scaffold with empty route stubs. The payment
logic, webhook handling, refunds, and idempotency in this project were
implemented by me, following `BUILD_PLAN.md`.

> This project uses test keys only. Do not enter a real card. Do not add
> live Stripe keys.

**Live demo (test mode):** _[add your Vercel URL after Night 12]_

---

## The problem

_[In your own words, after you have built it.]_

- Who is this for, and what were they doing before (cash, a form, nothing)?
- What could go wrong if a payment succeeds but the order is never recorded?
- Why was Stripe Checkout a better fit than a custom card form?

## What it does

- Storefront for tickets and donation amounts
- Stripe Checkout in test mode (one-time payments)
- Webhook that verifies Stripe's signature, records the order, and emails a receipt
- Admin list of orders, totals, and refunds
- Idempotent checkout and fulfillment so retries and double-clicks stay safe

## How it works

_[Add a short architecture paragraph and, if it helps, a simple diagram.]_

```
Browser  →  POST /api/checkout  →  Stripe Checkout
                                      ↓
Buyer pays (test card)                ↓
                                      ↓
Stripe  →  POST /api/webhook  →  verify signature
                                 fulfill order once
                                 send receipt
Admin   →  POST /api/refunds  →  Stripe Refunds API
                                 webhook updates status
```

Stack: Next.js (TypeScript, App Router), SQLite locally, `stripe` Node
library, Stripe CLI for local webhooks, Vercel for the demo.

## Hardest technical decisions

_[Replace these prompts with what you actually decided and why.]_

- **Fulfillment belongs in the webhook, not on the success page.** Why?
  What does Stripe recommend?
  ([Fulfill orders](https://docs.stripe.com/checkout/fulfillment))
- **Signature verification.** What breaks if you parse the JSON body before
  verifying? How did you keep the raw body in Next.js?
  ([Webhooks](https://docs.stripe.com/webhooks))
- **Idempotency.** How do you stop a double-click from creating two payable
  sessions, and how do you stop the same `event.id` from inserting two
  orders or sending two emails?
  ([Idempotent requests](https://docs.stripe.com/api/idempotent_requests))
- **Refunds that are not instant.** What did the async refund test cards
  teach you about status?

## How I tested

_[Fill this in on Night 11. Be specific.]_

| Scenario | How I tested it | What I saw |
| --- | --- | --- |
| Successful payment | Test card `4242 4242 4242 4242` | |
| Generic decline | `4000 0000 0000 0002` | |
| Insufficient funds | `4000 0000 0000 9995` | |
| Duplicate webhook | Replayed the same event / called fulfill twice | |
| Invalid signature | POST without a valid `Stripe-Signature` | |
| Full refund | Admin refund button | |
| Async refund success / failure | Cards `4000 0000 0000 7726` and `4000 0000 0000 5126` | |
| Double-click Pay or Refund | | |

Automated tests: `npm test` (Vitest). Notes on anything I could only verify
manually:

_[your notes]_

Official card list: [Testing Stripe](https://docs.stripe.com/testing).

## What I would improve next

_[Examples — keep only the ones you mean, and add your own.]_

- Real authentication for admin, instead of a shared password
- A database that persists on Vercel (Turso or Supabase) with migrations
- Open-amount donations with nicer validation and receipts
- Ticket QR codes or a check-in list at the door
- Better email templates and delivery logging
- Rate limits and tighter abuse checks on the checkout endpoint

## Setup (local)

Prerequisites: Node.js 20+, a Stripe account in **test mode**, and the
[Stripe CLI](https://docs.stripe.com/stripe-cli).

```bash
git clone https://github.com/lalitg13/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
cp .env.example .env.local
# Add sk_test_, pk_test_, and (after stripe listen) the whsec_ secret
npm install
npm run dev
```

In a second terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the `whsec_` value into `.env.local` and restart the dev server.

| Env var | Where it comes from |
| --- | --- |
| `STRIPE_SECRET_KEY` | [Test API keys](https://dashboard.stripe.com/test/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` locally; Dashboard endpoint after deploy |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` locally; your Vercel URL in production |
| `DATABASE_PATH` | Local SQLite file, e.g. `./data/fundraiser.db` |
| `ADMIN_PASSWORD` | A password you choose; never commit the real value |

Useful scripts: `npm run dev`, `npm test`, `npm run build`.

## Project layout

```
app/page.tsx                 Storefront
app/success/page.tsx         Post-checkout confirmation (display only)
app/cancel/page.tsx          Canceled checkout
app/admin/page.tsx           Orders, totals, refunds
app/api/checkout/route.ts    Create a Checkout Session
app/api/webhook/route.ts     Verify events and fulfill
app/api/orders/route.ts      Admin order list
app/api/refunds/route.ts     Create a refund
db/schema.sql                SQLite schema
lib/                         Stripe client, db, products, email
tests/                       Declines, refunds, duplicate events
BUILD_PLAN.md                Night-by-night milestones
```

## License

Personal project. Not affiliated with Stripe or with any school club.
