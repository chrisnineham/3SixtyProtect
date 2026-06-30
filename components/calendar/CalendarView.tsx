'use client';

import { useMemo, useState } from 'react';
import { CalendarX, ShieldCheck, UserRoundCheck, LayoutGrid } from 'lucide-react';
import { CourseListItem } from './CourseListItem';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Course, CourseType } from '@/lib/types';

type Filter = 'all' | CourseType;

const FILTERS: { value: Filter; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'all', label: 'All Courses', icon: LayoutGrid },
  { value: 'door_supervision', label: 'Door Supervision', icon: ShieldCheck },
  { value: 'close_protection', label: 'Close Protection', icon: UserRoundCheck },
];

export function CalendarView({
  courses,
  initialFilter = 'all',
}: {
  courses: Course[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const counts = useMemo(
    () => ({
      all: courses.length,
      door_supervision: courses.filter((c) => c.course_type === 'door_supervision')
        .length,
      close_protection: courses.filter((c) => c.course_type === 'close_protection')
        .length,
    }),
    [courses],
  );

  const visible = useMemo(
    () =>
      filter === 'all'
        ? courses
        : courses.filter((c) => c.course_type === filter),
    [courses, filter],
  );

  return (
    <div className="container section">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter courses by type">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                  active
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900',
                )}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
                <span
                  className={cn(
                    'rounded-full px-1.5 text-xs',
                    active ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500',
                  )}
                >
                  {counts[f.value]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-500">
          {visible.length} {visible.length === 1 ? 'course' : 'courses'} available
        </p>
      </div>

      {/* List */}
      {visible.length > 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          {visible.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-ink-50 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink-400 shadow-sm">
            <CalendarX className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-ink-900">
            No courses scheduled right now
          </h3>
          <p className="mt-2 max-w-sm text-sm text-ink-500">
            We’re busy scheduling new dates. Get in touch and we’ll let you know as
            soon as the next intake opens.
          </p>
          <div className="mt-6 flex gap-3">
            <Button href="/contact">Enquire about dates</Button>
            {filter !== 'all' && (
              <Button variant="outline" onClick={() => setFilter('all')}>
                View all courses
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
