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
      <div className="flex flex-col gap-4 border-b border-ink-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Filter courses by type">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'inline-flex items-center gap-2 pb-1 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors',
                  active
                    ? 'border-b-2 border-ink-950 text-ink-950'
                    : 'border-b-2 border-transparent text-ink-500 hover:text-ink-950',
                )}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
                <sup className="font-mono text-[10px] text-ink-400">{counts[f.value]}</sup>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
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
        <div className="mt-10 flex flex-col items-center justify-center border border-ink-950 bg-background p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center border border-ink-950 text-ink-950">
            <CalendarX className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-heading text-headline-md uppercase tracking-tight text-ink-900">
            No courses scheduled right now
          </h3>
          <p className="mt-3 max-w-sm font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
            We’re busy scheduling new dates. Get in touch and we’ll let you know as
            soon as the next intake opens.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
