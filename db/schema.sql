-- School fundraiser data model (SQLite).
-- Amounts are integers in the smallest currency unit (cents for USD).
-- Never trust a price sent from the browser; look it up here on the server.
--
-- This file is a starting schema only. You will write the code that reads
-- and writes these tables. See BUILD_PLAN.md.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  -- 'ticket' = fixed-price item; 'donation' = may use unit_amount_cents as a preset
  kind TEXT NOT NULL CHECK (kind IN ('ticket', 'donation')),
  -- Unit price in cents. For an open-amount donation, you may leave this NULL
  -- and validate a buyer-chosen amount on the server.
  unit_amount_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  kind TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  customer_name TEXT,
  customer_email TEXT,
  -- Fill these in when you implement Checkout and webhooks
  checkout_session_id TEXT UNIQUE,
  payment_intent_id TEXT,
  -- Suggested values: pending, paid, fulfilled, refunded, partially_refunded, failed, canceled
  status TEXT NOT NULL DEFAULT 'pending',
  fulfilled_at TEXT,
  receipt_sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  stripe_refund_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  -- Suggested values: pending, succeeded, failed, canceled
  status TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Store Stripe event IDs you have already handled so webhook retries
-- (and accidental double delivery) do not fulfill or email twice.
-- You will write the insert/check logic in a later milestone.
CREATE TABLE IF NOT EXISTS processed_events (
  stripe_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);

-- Example seed data. Safe to re-run because of INSERT OR IGNORE.
INSERT OR IGNORE INTO products (id, name, description, kind, unit_amount_cents, currency) VALUES
  ('ticket-general', 'Hill Top News Fundraiser Ticket', 'General admission ticket for the school fundraiser.', 'ticket', 1500, 'usd'),
  ('donation-10', 'Donation — $10', 'Support Hill Top News with a $10 donation.', 'donation', 1000, 'usd'),
  ('donation-25', 'Donation — $25', 'Support Hill Top News with a $25 donation.', 'donation', 2500, 'usd'),
  ('donation-custom', 'Custom donation', 'Choose your own donation amount (validate a minimum on the server).', 'donation', NULL, 'usd');
