/**
 * Catalog types for the fundraiser.
 *
 * You can keep the source of truth in the products table (db/schema.sql)
 * or start with a hard-coded list here and load it into SQLite on Night 2.
 * Either way, the server must look up the price. Never take a dollar
 * amount from the request body and charge it as-is (except a custom
 * donation, which you still validate: integer cents, minimum, maximum).
 */

export type ProductKind = "ticket" | "donation";

export type Product = {
  id: string;
  name: string;
  description?: string;
  kind: ProductKind;
  /** Unit price in cents. Null means the buyer chooses an amount. */
  unitAmountCents: number | null;
  currency: "usd";
  active: boolean;
};

// TODO (Night 2 or 3): export a function that returns active products
// from the database (or a temporary hard-coded list while you build the UI).
export function listProducts(): Product[] {
  throw new Error("TODO: implement listProducts() — see BUILD_PLAN.md Night 2.");
}

export function getProduct(_id: string): Product | undefined {
  throw new Error("TODO: implement getProduct() — see BUILD_PLAN.md Night 2.");
}
