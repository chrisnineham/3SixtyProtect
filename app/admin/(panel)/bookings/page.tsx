import {
  Mail,
  Phone,
  CalendarDays,
  Clock,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BookingStatusControl } from '@/components/admin/BookingStatusControl';
import { getAllBookingsAdmin } from '@/lib/bookings';
import { COURSE_TYPE_META } from '@/lib/constants';
import { formatDate, formatPrice } from '@/lib/utils';

export const metadata = { title: 'Bookings' };
export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await getAllBookingsAdmin();

  const counts = {
    new: bookings.filter((b) => b.booking_status === 'new').length,
    confirmed: bookings.filter((b) => b.booking_status === 'confirmed').length,
    total: bookings.length,
  };

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-ink-900">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Online bookings received from the website.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge tone="ink">{counts.total} total</Badge>
        <Badge tone="warning">{counts.new} new</Badge>
        <Badge tone="success">{counts.confirmed} confirmed</Badge>
      </div>

      {bookings.length > 0 ? (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <article
              key={b.id}
              className="border border-ink-950 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading font-semibold text-ink-900">{b.customer_name}</h2>
                    {b.course ? (
                      <Badge tone="gold">
                        {COURSE_TYPE_META[b.course.course_type].shortLabel}
                      </Badge>
                    ) : null}
                    {b.payment_status === 'deposit_paid' ? (
                      <Badge tone="success">
                        Deposit paid
                        {b.deposit_amount ? ` · ${formatPrice(b.deposit_amount)}` : ''}
                      </Badge>
                    ) : b.deposit_amount ? (
                      <Badge tone="warning">
                        Deposit due · {formatPrice(b.deposit_amount)}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
                    <a
                      href={`mailto:${b.customer_email}`}
                      className="flex items-center gap-1.5 hover:text-ink-900"
                    >
                      <Mail className="h-4 w-4 text-ink-500" />
                      {b.customer_email}
                    </a>
                    <a
                      href={`tel:${b.customer_phone}`}
                      className="flex items-center gap-1.5 hover:text-ink-900"
                    >
                      <Phone className="h-4 w-4 text-ink-500" />
                      {b.customer_phone}
                    </a>
                  </div>
                </div>
                <div className="shrink-0">
                  <BookingStatusControl id={b.id} status={b.booking_status} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-ink-200 pt-4 text-sm text-ink-600 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-ink-400" />
                  <span className="font-medium text-ink-800">
                    {b.course?.title ?? 'Course'}
                  </span>
                </p>
                {b.course?.start_date ? (
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-ink-400" />
                    Course date: {formatDate(b.course.start_date)}
                  </p>
                ) : null}
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ink-400" />
                  Booked: {formatDate(b.created_at.slice(0, 10))}
                </p>
                {b.reference ? (
                  <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.05em] text-ink-500">
                    Ref: {b.reference}
                  </p>
                ) : null}
              </div>

              {b.message ? (
                <div className="mt-3 flex gap-2 border border-ink-200 bg-ink-50 p-3 text-sm text-ink-600">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <p className="whitespace-pre-line">{b.message}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
          <ClipboardList className="h-9 w-9 text-ink-300" />
          <h2 className="mt-4 font-heading text-lg font-semibold text-ink-900">No bookings yet</h2>
          <p className="mt-1 text-sm text-ink-500">
            Bookings made on the website will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
