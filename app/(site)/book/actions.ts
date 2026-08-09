'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from '@/lib/supabase/config';
import { getCourseById } from '@/lib/courses';
import { bookingSchema, fieldErrors } from '@/lib/validation';
import { isStripeEnabled, createCheckoutSession } from '@/lib/stripe';
import { depositAmount } from '@/lib/payments';

export interface BookingFormState {
  status: 'idle' | 'success' | 'error' | 'redirect';
  message?: string;
  errors?: Record<string, string>;
  reference?: string;
  /** Stripe Checkout URL to send the browser to when status === 'redirect'. */
  url?: string;
  summary?: {
    courseTitle: string;
    name: string;
    email: string;
  };
}

function reference(): string {
  // e.g. 3SP-8F2A9C — short, human-friendly booking reference.
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `3SP-${id}`;
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  );
}

export async function createBookingAction(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const raw = {
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    customer_phone: formData.get('customer_phone'),
    course_id: formData.get('course_id'),
    preferred_date: formData.get('preferred_date'),
    message: formData.get('message'),
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields and try again.',
      errors: fieldErrors(parsed.error),
    };
  }

  const values = parsed.data;
  const course = await getCourseById(values.course_id);
  if (!course) {
    return {
      status: 'error',
      message: 'That course could not be found. Please choose another date.',
      errors: { course_id: 'Please select a valid course' },
    };
  }

  // Fold the optional "preferred date" note into the stored message.
  const noteParts: string[] = [];
  if (values.preferred_date) {
    noteParts.push(`Preferred date: ${values.preferred_date}`);
  }
  if (values.message) noteParts.push(values.message);
  const message = noteParts.join('\n') || null;

  const ref = reference();
  const deposit = depositAmount(course.price);

  const summary = {
    courseTitle: course.title,
    name: values.customer_name,
    email: values.customer_email,
  };

  // No Supabase yet → simulate a successful booking so the flow is testable.
  if (!isSupabaseConfigured()) {
    return { status: 'success', reference: ref, summary };
  }

  try {
    // Trusted (service-role) client can read back the inserted id (needed to
    // link the Stripe session) and bypass RLS for the write.
    const trusted = isServiceRoleConfigured();
    const supabase = trusted ? createAdminClient() : createClient();

    const insertPayload = {
      course_id: course.id,
      customer_name: values.customer_name,
      customer_email: values.customer_email,
      customer_phone: values.customer_phone,
      message,
      booking_status: 'new' as const,
      reference: ref,
      payment_status: 'unpaid' as const,
      deposit_amount: deposit,
    };

    // Take a deposit only when Stripe is configured AND we can read the new
    // booking id back (service role). Otherwise fall back to a no-payment
    // booking so the site keeps working.
    const takePayment = isStripeEnabled() && trusted;

    if (takePayment) {
      const { data: inserted, error } = await supabase
        .from('bookings')
        .insert(insertPayload)
        .select('id')
        .single();
      if (error || !inserted) throw error ?? new Error('Booking insert returned no id');

      const session = await createCheckoutSession({
        courseTitle: course.title,
        courseId: course.id,
        fee: course.price,
        amount: deposit,
        bookingId: inserted.id,
        reference: ref,
        customerEmail: values.customer_email,
        successUrl: `${siteUrl()}/book/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${siteUrl()}/book?course=${course.id}&canceled=1`,
      });

      // Runtime Stripe issue → the booking is stored; confirm without payment.
      if (!session) {
        return { status: 'success', reference: ref, summary };
      }

      // Best-effort: record the session id for reconciliation.
      await supabase
        .from('bookings')
        .update({ stripe_session_id: session.id })
        .eq('id', inserted.id);

      return { status: 'redirect', url: session.url, reference: ref };
    }

    // No-payment path.
    const { error } = await supabase.from('bookings').insert(insertPayload);
    if (error) throw error;

    return { status: 'success', reference: ref, summary };
  } catch (err) {
    console.error('[book] createBookingAction failed:', err);
    return {
      status: 'error',
      message:
        'Sorry, something went wrong submitting your booking. Please try again or call us.',
    };
  }
}
