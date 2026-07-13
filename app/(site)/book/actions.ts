'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from '@/lib/supabase/config';
import { getCourseById } from '@/lib/courses';
import { bookingSchema, fieldErrors } from '@/lib/validation';

export interface BookingFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string>;
  reference?: string;
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

  // No Supabase yet → simulate a successful booking so the flow is testable.
  if (!isSupabaseConfigured()) {
    return {
      status: 'success',
      reference: ref,
      summary: {
        courseTitle: course.title,
        name: values.customer_name,
        email: values.customer_email,
      },
    };
  }

  try {
    // Prefer the service-role client for trusted server writes; fall back to
    // the anon client (covered by the "bookings public insert" RLS policy).
    const supabase = isServiceRoleConfigured()
      ? createAdminClient()
      : createClient();

    const { error } = await supabase.from('bookings').insert({
      course_id: course.id,
      customer_name: values.customer_name,
      customer_email: values.customer_email,
      customer_phone: values.customer_phone,
      message,
      booking_status: 'new',
    });

    if (error) throw error;

    // ── Stripe-ready hook ────────────────────────────────────────────
    // When online payment is enabled, create a checkout session here and
    // return its URL for the client to redirect to. See lib/stripe.ts.

    return {
      status: 'success',
      reference: ref,
      summary: {
        courseTitle: course.title,
        name: values.customer_name,
        email: values.customer_email,
      },
    };
  } catch (err) {
    console.error('[book] createBookingAction failed:', err);
    return {
      status: 'error',
      message:
        'Sorry, something went wrong submitting your booking. Please try again or call us.',
    };
  }
}
