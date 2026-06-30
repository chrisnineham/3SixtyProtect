import Link from 'next/link';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { COURSE_TYPE_META } from '@/lib/constants';
import {
  cn,
  durationInDays,
  formatPrice,
  formatTimeRange,
} from '@/lib/utils';
import type { Course } from '@/lib/types';

/** Parse the start date into month / day parts for the date chip. */
function dateParts(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(d),
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(d),
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(d),
  };
}

export function CourseListItem({ course }: { course: Course }) {
  const meta = COURSE_TYPE_META[course.course_type];
  const isCP = course.course_type === 'close_protection';
  const parts = dateParts(course.start_date);
  const days = durationInDays(course.start_date, course.end_date);
  const soldOut = course.status === 'fully_booked' || course.available_spaces <= 0;

  return (
    <article className="group relative flex flex-col gap-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all duration-300 hover:border-ink-200 hover:shadow-card-hover sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      {/* Date chip */}
      <div
        className={cn(
          'flex shrink-0 flex-row items-center gap-4 sm:w-24 sm:flex-col sm:gap-1 sm:text-center',
        )}
      >
        <div
          className={cn(
            'flex h-16 w-16 flex-col items-center justify-center rounded-xl text-white',
            isCP ? 'bg-ink-900' : 'bg-ink-800',
          )}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-sky-400">
            {parts.month}
          </span>
          <span className="text-2xl font-bold leading-none">{parts.day}</span>
        </div>
        <div className="text-sm text-ink-500 sm:text-xs">
          <span className="font-medium text-ink-700">{parts.weekday}</span>
          <span className="block">
            {days} {days === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="gold">{meta.shortLabel}</Badge>
          {soldOut ? (
            <Badge tone="danger">Fully booked</Badge>
          ) : course.available_spaces <= 4 ? (
            <Badge tone="warning">Only {course.available_spaces} left</Badge>
          ) : (
            <Badge tone="success">{course.available_spaces} spaces</Badge>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-ink-900">
          <Link
            href={`/book?course=${course.id}`}
            className="transition-colors before:absolute before:inset-0 hover:text-sky-700"
          >
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">
          {course.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-sky-500" />
            {course.location}
          </span>
          {(course.start_time || course.end_time) && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-sky-500" />
              {formatTimeRange(course.start_time, course.end_time)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-sky-500" />
            Max {course.max_spaces}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink-100 pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="sm:text-right">
          <span className="block text-xs font-medium uppercase tracking-wide text-ink-400">
            From
          </span>
          <span className="text-xl font-bold text-ink-900">
            {formatPrice(course.price)}
          </span>
        </div>
        <span
          className={cn(
            'relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            soldOut
              ? 'text-ink-400'
              : 'bg-ink-900 text-white group-hover:bg-sky-400 group-hover:text-ink-950',
          )}
        >
          {soldOut ? 'Waitlist' : 'Book'}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
