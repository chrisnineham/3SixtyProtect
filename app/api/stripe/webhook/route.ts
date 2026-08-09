import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { isServiceRoleConfigured } from '@/lib/supabase/config';

// Stripe signature verification needs the raw body + Node runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook — the authoritative confirmation of deposit payment.
 * On `checkout.session.completed` (paid), marks the linked booking as
 * deposit_paid. Idempotent: re-delivery just re-applies the same update.
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (session.payment_status === 'paid' && bookingId && isServiceRoleConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('bookings')
          .update({
            payment_status: 'deposit_paid',
            stripe_session_id: session.id,
          })
          .eq('id', bookingId);
      } catch (err) {
        console.error('[stripe] failed to mark booking paid:', err);
        // Return 500 so Stripe retries delivery.
        return new Response('Failed to update booking', { status: 500 });
      }
    }
  }

  return new Response('ok', { status: 200 });
}
