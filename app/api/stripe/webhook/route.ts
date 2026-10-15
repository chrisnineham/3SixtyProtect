import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { confirmBookingPayment, expireBookingPayment } from '@/lib/booking-payments';

// Stripe signature verification needs the raw body + Node runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook: the authoritative confirmation of payment.
 *  - checkout.session.completed → booking paid + confirmed, one space taken
 *  - checkout.session.expired   → unpaid booking released
 * Both handlers are idempotent, so Stripe re-deliveries are harmless.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response('Stripe webhook not configured', { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error('[stripe] webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await confirmBookingPayment(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === 'checkout.session.expired') {
      await expireBookingPayment(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    console.error('[stripe] failed to update booking:', err);
    // 500 so Stripe retries delivery.
    return new Response('Failed to update booking', { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
