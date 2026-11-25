/**
 * TODO: Create and export a Stripe client from STRIPE_SECRET_KEY.
 *
 * Use the official stripe Node package (already in package.json).
 * Docs: https://docs.stripe.com/sdks/server-side?lang=node
 *
 * Rules:
 *  - Only import this file from server code (Route Handlers, server
 *    components, or other lib/* helpers). Never import it in a Client
 *    Component, and never send the secret key to the browser.
 *  - If the key is missing, throw a clear error so you notice before
 *    you try to charge anyone.
 *  - Do not create Checkout Sessions, refunds, or webhook handlers here.
 *    Those belong in the API routes, which you will write later.
 */

export function getStripe(): never {
  throw new Error("TODO: implement getStripe() in lib/stripe.ts — see BUILD_PLAN.md Night 1.");
}

import Stripe from 'stripe';
const key = process.env.STRIPE_SECRET_KEY;  /**Pulls in secret API key from .env.local file */

if(!key) {
  throw new Error('Missing STRIPE_SECRET_KEY in .env.local'); /**checks if the key is set and stops the app to check */
}

const stripe = new Stripe(key);

export default stripe; /** exports stripe object to be used in other files */