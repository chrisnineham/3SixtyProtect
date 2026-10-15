import 'server-only';

import type Stripe from 'stripe';
import { createAdminClient } from './supabase/admin';
import { isServiceRoleConfigured } from './supabase/config';

/**
 * Mark a booking paid from a completed Checkout session. Idempotent: only the
 * first call (unpaid → paid) takes a space off the course, so the webhook and
 * the success page can both call it safely.
 */
export async function confirmBookingPayment(session: Stripe.Checkout.Session): Promise<void> {
  const bookingId = session.metadata?.bookingId;
  if (session.payment_status !== 'paid' || !bookingId || !isServiceRoleConfigured()) return;

  const db = createAdminClient();
  const full = session.metadata?.payment === 'full';
  const update: Record<string, unknown> = {
    payment_status: full ? 'paid' : 'deposit_paid',
    stripe_session_id: session.id,
    amount_paid: (session.amount_total ?? 0) / 100,
    paid_at: new Date().toISOString(),
  };
  if (full) update.booking_status = 'confirmed';

  let { data: changed, error } = await db
    .from('bookings')
    .update(update)
    .eq('id', bookingId)
    .in('payment_status', ['unpaid', 'expired'])
    .select('id, course_id');
  if (error && error.code === 'PGRST204') {
    // Pay-online columns not migrated yet: record the essentials only.
    ({ data: changed, error } = await db
      .from('bookings')
      .update({ payment_status: update.payment_status, stripe_session_id: session.id, ...(full ? { booking_status: 'confirmed' } : {}) })
      .eq('id', bookingId)
      .in('payment_status', ['unpaid', 'expired'])
      .select('id, course_id'));
  }
  if (error) throw error;

  const courseId = changed?.[0]?.course_id as string | undefined;
  if (!courseId) return; // already confirmed earlier

  // Take one space off the course; mark it fully booked at zero.
  const { data: course } = await db.from('courses').select('available_spaces, status').eq('id', courseId).maybeSingle();
  if (course) {
    const left = Math.max(0, (course.available_spaces as number) - 1);
    await db
      .from('courses')
      .update({ available_spaces: left, ...(left === 0 && course.status === 'published' ? { status: 'fully_booked' } : {}) })
      .eq('id', courseId);
  }
}

/** An abandoned / expired Checkout session releases the unpaid booking. */
export async function expireBookingPayment(session: Stripe.Checkout.Session): Promise<void> {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId || !isServiceRoleConfigured()) return;
  await createAdminClient()
    .from('bookings')
    .update({ payment_status: 'expired', booking_status: 'cancelled' })
    .eq('id', bookingId)
    .eq('payment_status', 'unpaid');
}
