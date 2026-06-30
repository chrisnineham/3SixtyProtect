import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, MapPin, Users, ArrowRight, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { COURSE_TYPE_META } from '@/lib/constants';
import {
  cn,
  durationInDays,
  formatDateRange,
  formatPrice,
  formatTimeRange,
} from '@/lib/utils';
import type { Course } from '@/lib/types';

function spacesBadge(course: Course) {
  if (course.status === 'fully_booked' || course.available_spaces <= 0) {
    return <Badge tone="danger">Fully booked</Badge>;
  }
  if (course.available_spaces <= 4) {
    return <Badge tone="warning">Only {course.available_spaces} left</Badge>;
  }
  return <Badge tone="success">{course.available_spaces} spaces</Badge>;
}

export function CourseCard({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const meta = COURSE_TYPE_META[course.course_type];
  const isCP = course.course_type === 'close_protection';
  const Icon = isCP ? UserRoundCheck : ShieldCheck;
  const days = durationInDays(course.start_date, course.end_date);
  const soldOut = course.status === 'fully_booked' || course.available_spaces <= 0;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:shadow-card-hover',
        className,
      )}
    >
      {/* Visual header */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {course.image_url ? (
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br',
              isCP
                ? 'from-ink-800 via-ink-900 to-ink-950'
                : 'from-ink-700 via-ink-800 to-ink-950',
            )}
          >
            <div className="absolute inset-0 bg-grid-faint [background-size:22px_22px] opacity-50" />
            <div className="absolute -right-6 -top-10 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" />
            <Icon className="absolute bottom-4 right-4 h-20 w-20 text-white/10" strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone="gold">{meta.shortLabel}</Badge>
        </div>
        <div className="absolute right-4 top-4">{spacesBadge(course)}</div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-pretty text-lg font-semibold leading-snug text-ink-900">
          <Link
            href={`/book?course=${course.id}`}
            className="transition-colors before:absolute before:inset-0 before:z-10 hover:text-sky-700"
          >
            {course.title}
          </Link>
        </h3>

        <dl className="mt-4 space-y-2.5 text-sm text-ink-600">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-sky-500" />
            <span>{formatDateRange(course.start_date, course.end_date)}</span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-500">{days} {days === 1 ? 'day' : 'days'}</span>
          </div>
          {(course.start_time || course.end_time) && (
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-sky-500" />
              <span>{formatTimeRange(course.start_time, course.end_time)}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
            <span className="line-clamp-1">{course.location}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4 shrink-0 text-sky-500" />
            <span>{course.max_spaces} max group size</span>
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-ink-400">
              From
            </span>
            <span className="text-xl font-bold text-ink-900">
              {formatPrice(course.price)}
            </span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-semibold',
              soldOut ? 'text-ink-400' : 'text-sky-600 group-hover:text-sky-700',
            )}
          >
            {soldOut ? 'Join waitlist' : 'Book now'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
