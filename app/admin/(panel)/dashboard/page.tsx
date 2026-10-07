import Link from 'next/link';
import {
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Inbox,
  ArrowRight,
  Users,
  PlusCircle,
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import {
  BookingStatusBadge,
  CourseStatusBadge,
} from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { getAllCoursesAdmin } from '@/lib/courses';
import { getAllBookingsAdmin } from '@/lib/bookings';
import { courseShortType } from '@/lib/constants';
import { formatDate, formatDateRange } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const [courses, bookings] = await Promise.all([
    getAllCoursesAdmin(),
    getAllBookingsAdmin(),
  ]);

  const today = todayIso();
  const published = courses.filter((c) => c.status === 'published');
  const upcoming = courses
    .filter((c) => c.end_date >= today && c.status !== 'cancelled')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  const newBookings = bookings.filter((b) => b.booking_status === 'new');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-ink-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            An overview of your courses and bookings.
          </p>
        </div>
        <Button href="/admin/courses/new" className="shrink-0">
          <PlusCircle className="h-4 w-4" />
          New course
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Total courses"
          value={courses.length}
          hint={`${published.length} published`}
        />
        <StatCard
          icon={CalendarCheck}
          label="Upcoming courses"
          value={upcoming.length}
          hint="Not yet finished"
        />
        <StatCard
          icon={ClipboardList}
          label="Total bookings"
          value={bookings.length}
        />
        <StatCard
          icon={Inbox}
          label="New bookings"
          value={newBookings.length}
          hint="Awaiting action"
          accent
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <section className="border border-ink-950 bg-white">
          <div className="flex items-center justify-between border-b border-ink-950 px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900">
              Recent bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {bookings.length > 0 ? (
            <ul className="divide-y divide-ink-200">
              {bookings.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">
                      {b.customer_name}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {b.course?.title ?? 'Course'} · {formatDate(b.created_at.slice(0, 10))}
                    </p>
                  </div>
                  <BookingStatusBadge status={b.booking_status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow icon={ClipboardList} text="No bookings yet." />
          )}
        </section>

        {/* Upcoming courses */}
        <section className="border border-ink-950 bg-white">
          <div className="flex items-center justify-between border-b border-ink-950 px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900">
              Upcoming courses
            </h2>
            <Link
              href="/admin/courses"
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900 hover:underline"
            >
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <ul className="divide-y divide-ink-200">
              {upcoming.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-900">
                      {courseShortType(c)}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {formatDateRange(c.start_date, c.end_date)} · {c.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Users className="h-3.5 w-3.5" />
                      {c.available_spaces}/{c.max_spaces}
                    </span>
                    <CourseStatusBadge status={c.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow icon={CalendarCheck} text="No upcoming courses scheduled." />
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyRow({
  icon: Icon,
  text,
}: {
  icon: typeof ClipboardList;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
      <Icon className="h-7 w-7 text-ink-300" />
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  );
}
