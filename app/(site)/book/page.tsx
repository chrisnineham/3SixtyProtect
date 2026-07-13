import type { Metadata } from 'next';
import { CalendarX } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { BookingForm } from '@/components/booking/BookingForm';
import { Button } from '@/components/ui/Button';
import { getPublicCourses } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Book a Course Online',
  description:
    'Book your SIA Door Supervision or Close Protection course online with 3Sixty Protect. Choose a date, enter your details and reserve your place in minutes.',
  alternates: { canonical: '/book' },
};

const assurances = ['Takes 2 minutes', 'No payment taken now', 'Team confirms by email'];

export default async function BookPage({
  searchParams,
}: {
  searchParams: { course?: string };
}) {
  const courses = await getPublicCourses();

  return (
    <>
      <PageHeader
        eyebrow="Book Online"
        title="Reserve your place"
        description="Select your course, tell us a little about yourself, and we’ll confirm your booking. It only takes a couple of minutes."
      >
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400">
          {assurances.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden>·</span>}
              {label}
            </li>
          ))}
        </ul>
      </PageHeader>

      <section className="section">
        <div className="container">
          {courses.length > 0 ? (
            <BookingForm courses={courses} initialCourseId={searchParams.course} />
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center border border-ink-950 bg-background px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center border border-ink-950 text-ink-800">
                <CalendarX className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-heading text-headline-md uppercase tracking-tight text-ink-900">
                No courses are open for booking right now
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-500">
                New dates are added regularly. Get in touch and we’ll let you know
                the moment the next intake opens.
              </p>
              <Button href="/contact" className="mt-6">
                Enquire about dates
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
