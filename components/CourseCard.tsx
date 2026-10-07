import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { courseShortType } from '@/lib/constants';
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
  const typeLabel = courseShortType(course);
  const Icon =
    course.course_type === 'close_protection'
      ? UserRoundCheck
      : course.course_type === 'door_supervision'
        ? ShieldCheck
        : GraduationCap;
  const days = durationInDays(course.start_date, course.end_date);
  const soldOut = course.status === 'fully_booked' || course.available_spaces <= 0;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col border border-ink-950 bg-background transition-colors',
        className,
      )}
    >
      {/* Visual header */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {course.image_url ? (
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container">
            <Icon className="h-16 w-16 text-ink-300" strokeWidth={1.2} />
            <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
              {typeLabel}
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone="gold">{typeLabel}</Badge>
        </div>
        <div className="absolute right-4 top-4">{spacesBadge(course)}</div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
          {typeLabel}
        </span>
        <h3 className="mt-2 text-pretty font-heading text-xl font-bold uppercase leading-snug tracking-tight text-ink-900">
          <Link
            href={`/book?course=${course.id}`}
            className="transition-colors before:absolute before:inset-0 before:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
          >
            {course.title}
          </Link>
        </h3>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-ink-200 pt-4">
          <div className="flex flex-col gap-1">
            <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
              Dates
            </dt>
            <dd className="text-sm text-ink-800">
              {formatDateRange(course.start_date, course.end_date)}
              <span className="text-ink-500"> · {days} {days === 1 ? 'day' : 'days'}</span>
            </dd>
          </div>
          {(course.start_time || course.end_time) && (
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
                Time
              </dt>
              <dd className="text-sm text-ink-800">
                {formatTimeRange(course.start_time, course.end_time)}
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
              Location
            </dt>
            <dd className="line-clamp-1 text-sm text-ink-800">{course.location}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
              Group size
            </dt>
            <dd className="text-sm text-ink-800">{course.max_spaces} max</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between border-t border-ink-200 pt-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
              From
            </span>
            <span className="font-heading text-xl font-bold text-ink-900">
              {formatPrice(course.price)}
            </span>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.05em]',
              soldOut ? 'text-error' : 'text-ink-900',
            )}
          >
            {soldOut ? 'Join waitlist' : 'View course'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
