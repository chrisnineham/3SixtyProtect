import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { CalendarView } from '@/components/calendar/CalendarView';
import { getPublicCourses } from '@/lib/courses';
import type { CourseType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Training Calendar: Upcoming SIA Courses',
  description:
    'View all upcoming 3Sixty Protect training dates. Filter SIA Door Supervision and Close Protection courses by type, see locations, prices and availability, and book online.',
  alternates: { canonical: '/calendar' },
};

const SLUG_TO_TYPE: Record<string, CourseType> = {
  'door-supervision': 'door_supervision',
  'close-protection': 'close_protection',
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const courses = await getPublicCourses();
  const initialFilter = searchParams.type
    ? SLUG_TO_TYPE[searchParams.type] ?? 'all'
    : 'all';

  return (
    <>
      <PageHeader
        eyebrow="Training Calendar"
        title="Upcoming SIA training courses"
        description="Browse our scheduled Door Supervision and Close Protection courses. Filter by course type, check availability and book your place in minutes."
      />
      <CalendarView courses={courses} initialFilter={initialFilter} />
    </>
  );
}
