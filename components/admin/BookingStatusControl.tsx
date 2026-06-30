'use client';

import { useRef } from 'react';
import { setBookingStatusAction } from '@/app/admin/_actions/bookings';
import { BOOKING_STATUS_OPTIONS } from '@/lib/constants';
import type { BookingStatus } from '@/lib/types';

export function BookingStatusControl({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={setBookingStatusAction} className="flex items-center">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Booking status
      </label>
      <select
        id={`status-${id}`}
        name="booking_status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 rounded-lg border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      >
        {BOOKING_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}
