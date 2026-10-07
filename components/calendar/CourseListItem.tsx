import Link from 'next/link';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { courseShortType } from '@/lib/constants';
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
  const parts = dateParts(course.start_date);
  const days = durationInDays(course.start_date, course.end_date);
  const soldOut = course.status === 'fully_booked' || course.available_spaces <= 0;

  return (
    <article className="group relative flex flex-col gap-5 border border-ink-950 bg-background p-5 transition-colors sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      {/* Date block */}
      <div className="flex shrink-0 flex-row items-center gap-4 sm:w-24 sm:flex-col sm:gap-1 sm:text-center">
        <div className="flex h-16 w-16 flex-col items-center justify-center border border-ink-950 bg-ink-950 text-white">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/60">
            {parts.month}
          </span>
          <span className="font-heading text-2xl font-bold leading-none">
            {parts.day}
          </span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500 sm:text-center">
          <span className="text-ink-800">{parts.weekday}</span>
          <span className="block">
            {days} {days === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{courseShortType(course)}</Badge>
          {soldOut ? (
            <Badge tone="danger">Fully booked</Badge>
          ) : course.available_spaces <= 4 ? (
            <Badge tone="warning">Only {course.available_spaces} left</Badge>
          ) : (
            <Badge tone="success">{course.available_spaces} spaces</Badge>
          )}
        </div>
        <h3 className="mt-3 font-heading text-lg font-bold uppercase tracking-tight text-ink-900">
          <Link
            href={`/book?course=${course.id}`}
            className="underline-offset-4 transition-colors before:absolute before:inset-0 hover:underline"
          >
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">
          {course.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-ink-400" strokeWidth={1.5} />
            {course.location}
          </span>
          {(course.start_time || course.end_time) && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-ink-400" strokeWidth={1.5} />
              {formatTimeRange(course.start_time, course.end_time)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-ink-400" strokeWidth={1.5} />
            Max {course.max_spaces}
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink-200 pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="sm:text-right">
          <span className="block font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
            From
          </span>
          <span className="font-heading text-xl font-bold text-ink-900">
            {formatPrice(course.price)}
          </span>
        </div>
        <Link
          href={`/book?course=${course.id}`}
          className={cn(
            'relative z-10 inline-flex items-center gap-1.5 border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.05em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2',
            soldOut
              ? 'border-ink-200 text-ink-400'
              : 'border-ink-950 bg-ink-950 text-white group-hover:bg-background group-hover:text-ink-950',
          )}
        >
          {soldOut ? 'Waitlist' : 'Book'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
