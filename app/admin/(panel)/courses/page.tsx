import Link from 'next/link';
import {
  PlusCircle,
  CalendarDays,
  MapPin,
  Users,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CourseStatusBadge } from '@/components/admin/StatusBadge';
import { CourseRowActions } from '@/components/admin/CourseRowActions';
import { getAllCoursesAdmin } from '@/lib/courses';
import { COURSE_TYPE_META } from '@/lib/constants';
import { formatDateRange, formatPrice } from '@/lib/utils';

export const metadata = { title: 'Courses' };
export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: { created?: string; updated?: string };
}) {
  const courses = await getAllCoursesAdmin();
  const toast = searchParams.created
    ? 'Course created.'
    : searchParams.updated
      ? 'Course updated.'
      : null;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Courses</h1>
          <p className="mt-1 text-sm text-ink-500">
            Create, edit and publish your training courses.
          </p>
        </div>
        <Button href="/admin/courses/new" className="shrink-0">
          <PlusCircle className="h-4 w-4" />
          New course
        </Button>
      </div>

      {toast ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </p>
      ) : null}

      {courses.length > 0 ? (
        <div className="mt-6 space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="gold">
                    {COURSE_TYPE_META[course.course_type].shortLabel}
                  </Badge>
                  <CourseStatusBadge status={course.status} />
                </div>
                <h2 className="mt-2 truncate font-semibold text-ink-900">
                  {course.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-sky-500" />
                    {formatDateRange(course.start_date, course.end_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-sky-500" />
                    {course.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-500" />
                    {course.available_spaces}/{course.max_spaces} available
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <span className="text-lg font-bold text-ink-900">
                  {formatPrice(course.price)}
                </span>
                <CourseRowActions id={course.id} status={course.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
          <GraduationCap className="h-9 w-9 text-ink-300" />
          <h2 className="mt-4 text-lg font-semibold text-ink-900">No courses yet</h2>
          <p className="mt-1 text-sm text-ink-500">
            Create your first course to publish it to the website.
          </p>
          <Button href="/admin/courses/new" className="mt-6">
            <PlusCircle className="h-4 w-4" />
            New course
          </Button>
        </div>
      )}
    </div>
  );
}
