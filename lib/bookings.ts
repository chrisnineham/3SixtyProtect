import 'server-only';

import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { MOCK_BOOKINGS } from './mock-data';
import type { Booking } from './types';

/** Admin: all bookings with their joined course, newest first. */
export async function getAllBookingsAdmin(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return [...MOCK_BOOKINGS].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select(
        'id, course_id, customer_name, customer_email, customer_phone, message, booking_status, created_at, updated_at, course:courses ( id, title, course_type, start_date )',
      )
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as unknown as Booking[]) ?? [];
  } catch (err) {
    console.error('[bookings] getAllBookingsAdmin failed:', err);
    return [...MOCK_BOOKINGS].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  }
}

/** Count of bookings per course id (for "spaces" display in admin). */
export async function getBookingCountsByCourse(): Promise<Record<string, number>> {
  const bookings = await getAllBookingsAdmin();
  return bookings.reduce<Record<string, number>>((acc, b) => {
    if (b.booking_status === 'cancelled') return acc;
    acc[b.course_id] = (acc[b.course_id] ?? 0) + 1;
    return acc;
  }, {});
}
