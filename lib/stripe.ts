import 'server-only';

import Stripe from 'stripe';

/**
 * Stripe is wired but OPTIONAL. Online card payment can be switched on later
 * without touching the booking flow: set STRIPE_SECRET_KEY, then call
 * `createCheckoutSession()` from the booking action and redirect to its URL.
 *
 * Returns null until a key is configured, so the build never requires Stripe.
 */
let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    // Use the account's default API version (avoids pinning a literal that
    // must match the installed SDK's type). Pin explicitly when you go live.
    stripe = new Stripe(key);
  }
  return stripe;
}

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Placeholder for the future payment step. When ready, call this from the
 * booking server action with the chosen course and the new booking id.
 */
export async function createCheckoutSession(params: {
  courseTitle: string;
  amount: number; // in GBP
  bookingId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<{ url: string } | null> {
  const client = getStripe();
  if (!client) return null;

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(params.amount * 100),
          product_data: { name: params.courseTitle },
        },
      },
    ],
    metadata: { bookingId: params.bookingId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session.url ? { url: session.url } : null;
}
