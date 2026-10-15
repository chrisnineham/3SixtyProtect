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
 * Create a Stripe Checkout session for the FULL course fee.
 * Booking context travels in metadata so the webhook and success page can
 * reconcile the booking. Sessions expire after 30 minutes if not completed.
 */
export async function createCheckoutSession(params: {
  courseTitle: string;
  courseId?: string;
  courseDates: string;
  location: string;
  amount: number; // full course fee (GBP)
  bookingId: string;
  reference: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<{ url: string; id: string } | null> {
  const client = getStripe();
  if (!client) return null;

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.customerEmail,
    client_reference_id: params.reference,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(params.amount * 100),
          product_data: {
            name: params.courseTitle,
            description: `${params.courseDates}, ${params.location}. Booking ref ${params.reference}.`,
          },
        },
      },
    ],
    payment_intent_data: {
      description: `${params.courseTitle} (${params.reference})`,
      metadata: { bookingId: params.bookingId, reference: params.reference },
    },
    metadata: {
      bookingId: params.bookingId,
      reference: params.reference,
      courseTitle: params.courseTitle,
      courseId: params.courseId ?? '',
      fee: String(params.amount),
      payment: 'full',
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session.url ? { url: session.url, id: session.id } : null;
}
