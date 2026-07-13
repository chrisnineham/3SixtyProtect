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
        className="h-9 border border-ink-400 bg-background px-3 font-mono uppercase text-[11px] tracking-[0.05em] text-ink-800 transition-colors focus:border-ink-950 focus:border-2 focus:outline-none"
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
