import { ArrowRight, CalendarDays, GraduationCap, ListChecks, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { CheckList } from '@/components/ui/CheckList';
import { SectionHeading } from '@/components/ui/Section';
import { CourseCard } from '@/components/CourseCard';
import { CtaBand } from '@/components/CtaBand';
import { PageHeader } from '@/components/ui/PageHeader';
import type { CourseOverview } from '@/lib/course-overviews';
import type { Course } from '@/lib/types';

/**
 * Overview page for a course type without its own bespoke landing page.
 * Deliberately lighter than CoursePageTemplate: no duration, entry
 * requirements or assessment sections, because those facts vary by awarding
 * body and aren't confirmed. Dates and prices come from the courses table.
 */
export function CourseOverviewTemplate({
  overview,
  typeLabel,
  typeShortLabel,
  courses,
}: {
  overview: CourseOverview;
  /** Full qualification title, e.g. "Level 2 Award in Conflict Management (RQF)". */
  typeLabel: string;
  typeShortLabel: string;
  courses: Course[];
}) {
  return (
    <>
      <PageHeader
        eyebrow={overview.level}
        title={typeShortLabel}
        description={overview.summary}
        image={overview.heroImage}
        imageAlt={`${typeShortLabel} training`}
        compact
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/book" variant="light">
            Book this course
          </Button>
          <Button href={`/contact?course=${overview.slug}#enquiry`} variant="outline-light">
            Ask a question
          </Button>
        </div>
      </PageHeader>

      {/* ── What it is ── */}
      <section className="section">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            01 / Overview
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Reveal>
              <h2 className="text-balance font-heading text-headline-md font-bold uppercase tracking-tight text-ink-900">
                About this qualification
              </h2>
              {overview.whatIs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-5 text-lg leading-relaxed text-ink-600">
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal className="h-full">
              <div className="border border-ink-950 p-7">
                <div className="flex h-12 w-12 items-center justify-center border border-ink-950 text-ink-950">
                  <GraduationCap className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
                  Qualification
                </p>
                <p className="mt-2 font-semibold leading-snug text-ink-900">{typeLabel}</p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">
                  Level
                </p>
                <p className="mt-2 font-semibold text-ink-900">{overview.level}</p>
                <Button
                  href={`/contact?course=${overview.slug}#enquiry`}
                  variant="outline"
                  size="sm"
                  className="mt-7 w-full"
                >
                  Enquire about dates
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Who it's for + what's covered ── */}
      <section className="section bg-ink-950">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/50">
            02 / Course Detail
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal className="flex h-full flex-col border border-white/20 bg-ink-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 text-white">
                <Users className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-white">
                Who it&rsquo;s for
              </h3>
              <CheckList dark className="mt-5" items={overview.whoFor} />
            </Reveal>

            <Reveal delay={70} className="flex h-full flex-col border border-white/20 bg-ink-950 p-7">
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 text-white">
                <ListChecks className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-white">
                What&rsquo;s covered
              </h3>
              <CheckList dark className="mt-5" items={overview.covered} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="section">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            03 / Outcomes
          </p>
          <div className="mt-6">
            <SectionHeading
              title="What you come away with"
              description="What this qualification gives you once you've completed it."
              className="max-w-xl"
            />
            <CheckList className="mt-10" columns={2} items={overview.outcomes} />
          </div>
        </div>
      </section>

      {/* ── Dates ── */}
      <section className="section bg-ink-50">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            04 / Dates &amp; Locations
          </p>
          {courses.length > 0 ? (
            <>
              <div className="mt-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                <SectionHeading
                  eyebrow="Dates &amp; Locations"
                  title={`Upcoming ${typeShortLabel} courses`}
                  description="Choose a date that works for you and book your place online."
                  className="max-w-xl"
                />
                <Button href="/calendar" variant="outline" className="shrink-0">
                  View all dates
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course, i) => (
                  <Reveal key={course.id} delay={i * 70} className="h-full">
                    <CourseCard course={course} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal className="mt-6 border border-ink-950 bg-background p-8 md:p-10">
              <div className="flex h-12 w-12 items-center justify-center border border-ink-950 text-ink-950">
                <CalendarDays className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 text-balance font-heading text-headline-md font-bold uppercase tracking-tight text-ink-900">
                No scheduled dates right now
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                We run this course on demand and for group bookings. Get in touch
                and we&rsquo;ll let you know the next available dates, or arrange a
                date that suits your team.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={`/contact?course=${overview.slug}#enquiry`}>
                  Enquire about this course
                </Button>
                <Button href="/calendar" variant="outline">
                  See all scheduled courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <CtaBand
        eyebrow="Enquire Today"
        title={`Ready to start your ${typeShortLabel} training?`}
        description="Book online or get in touch with our team, we're happy to answer any questions before you enrol."
        primaryLabel="Book a Course"
        primaryHref="/book"
        secondaryLabel="Ask a Question"
        secondaryHref={`/contact?course=${overview.slug}#enquiry`}
      />
    </>
  );
}
