import {
  ArrowRight,
  ShieldCheck,
  UserRoundCheck,
  Award,
  Clock,
  CalendarDays,
  GraduationCap,
  Users,
  Briefcase,
  ClipboardCheck,
  ListChecks,
  BadgeCheck,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/Section';
import { CheckList } from '@/components/ui/CheckList';
import { CourseCard } from '@/components/CourseCard';
import { CtaBand } from '@/components/CtaBand';
import { COURSE_TYPE_META } from '@/lib/constants';
import { formatDateRange } from '@/lib/utils';
import type { CoursePageContent } from '@/lib/course-content';
import type { Course } from '@/lib/types';

export function CoursePageTemplate({
  content,
  courses,
}: {
  content: CoursePageContent;
  courses: Course[];
}) {
  const isCP = content.type === 'close_protection';
  const HeroIcon = isCP ? UserRoundCheck : ShieldCheck;
  const meta = COURSE_TYPE_META[content.type];
  const nextCourse = courses[0];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-background border-b border-ink-950">
        <div className="container relative z-10 pb-14 pt-40 sm:pt-44 lg:pb-20 lg:pt-52">
          <div className="max-w-4xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 border border-ink-950 bg-background px-4 py-1.5 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-800">
                <HeroIcon className="h-3.5 w-3.5" />
                {content.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-8 text-left font-heading font-bold uppercase tracking-tight text-display-lg-mobile leading-[0.95] text-ink-900 md:text-display-2xl">
                {content.hero.title}{' '}
                <span className="text-ink-500">{content.hero.highlight}</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-800">
                {content.hero.description}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/book" size="lg">
                  Book a Course
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href={`/calendar?type=${meta.slug}`}
                  variant="outline"
                  size="lg"
                >
                  View Upcoming Courses
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal delay={240}>
          <dl className="border-t border-ink-950 grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-ink-950">
            {[
              { icon: Award, label: 'Qualification', value: content.level },
              { icon: Clock, label: 'Duration', value: content.durationLabel },
              {
                icon: BadgeCheck,
                label: 'Outcome',
                value: 'SIA licence-linked',
              },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-4 px-6 py-6 sm:px-8 lg:px-10"
              >
                <fact.icon className="h-5 w-5 shrink-0 text-ink-900" />
                <div>
                  <dt className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-heading font-bold uppercase tracking-tight text-ink-900">
                    {fact.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── What is + At a glance ── */}
      <section className="section bg-ink-50">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
              01 / Overview
            </p>
            <div className="mt-6">
              <SectionHeading
                eyebrow="Overview"
                title={content.whatIs.heading}
              />
            </div>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-800">
              {content.whatIs.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="sticky top-24 border border-ink-950 bg-ink-950 text-white divide-y divide-white/20">
                <p className="px-7 py-5 font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">
                  Course at a glance
                </p>
                <ul className="divide-y divide-white/20">
                  {[
                    { icon: GraduationCap, label: 'Qualification', value: content.level },
                    { icon: Clock, label: 'Duration', value: content.durationLabel },
                    { icon: CalendarDays, label: 'Format', value: 'Classroom + practical' },
                    {
                      icon: nextCourse ? CalendarDays : Users,
                      label: 'Next intake',
                      value: nextCourse
                        ? formatDateRange(nextCourse.start_date, nextCourse.end_date)
                        : 'Dates coming soon',
                    },
                  ].map((row) => (
                    <li key={row.label} className="flex items-center gap-4 px-7 py-4">
                      <row.icon className="h-5 w-5 shrink-0 text-white" />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-white/60">
                          {row.label}
                        </span>
                        <span className="text-right text-sm font-semibold text-white">
                          {row.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-7">
                  <Button href="/book" className="w-full">
                    Book your place
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="mt-3 text-center font-mono text-[12px] uppercase tracking-[0.05em] text-white/60">
                    Limited spaces · Secure online booking
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Who it's for + What you'll gain ── */}
      <section className="section bg-ink-950 text-white">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
            02 / Who it's for
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal className="border border-white/20 bg-ink-950 p-8">
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 text-white">
                <Users className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-bold uppercase tracking-tight text-white">
                {content.whoFor.heading}
              </h2>
              <p className="mt-3 text-white/70">{content.whoFor.intro}</p>
              <CheckList className="mt-6" items={content.whoFor.items} />
            </Reveal>

            <Reveal delay={100} className="border border-white/20 bg-ink-950 p-8">
              <div className="flex h-12 w-12 items-center justify-center border border-white/20 text-white">
                <Star className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-bold uppercase tracking-tight text-white">
                {content.whatGain.heading}
              </h2>
              <p className="mt-3 text-white/70">{content.whatGain.intro}</p>
              <CheckList className="mt-6" items={content.whatGain.items} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Areas covered ── */}
      <section className="section bg-ink-50">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            03 / The Curriculum
          </p>
          <div className="mt-6">
            <SectionHeading
              eyebrow="The Curriculum"
              title={content.areasCovered.heading}
              description={content.areasCovered.intro}
              className="max-w-2xl"
            />
          </div>
          <div className="mt-10 border border-ink-950 bg-background p-8 md:p-10">
            <CheckList columns={2} items={content.areasCovered.items} />
          </div>
        </div>
      </section>

      {/* ── Professional standards (CP only) ── */}
      {content.standards ? (
        <section className="section bg-ink-950 text-white">
          <div className="container">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
              04 / Professionalism
            </p>
            <div className="mt-6">
              <SectionHeading
                dark
                eyebrow="Professionalism"
                title={content.standards.heading}
                description={content.standards.intro}
                className="max-w-2xl"
              />
            </div>
            <div className="mt-10 grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-3">
              {content.standards.items.map((item, i) => (
                <Reveal
                  key={item}
                  delay={i * 50}
                  className="flex items-start gap-3 bg-ink-950 p-5"
                >
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <span className="text-[0.95rem] text-white/80">{item}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Careers ── */}
      <section className="section bg-ink-50">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
              {content.standards ? '05' : '04'} / Your Future
            </p>
            <div className="mt-6">
              <SectionHeading
                eyebrow="Your Future"
                title={content.careers.heading}
                description={content.careers.intro}
              />
            </div>
            <Button href="/book" className="mt-8">
              Start your security career
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {content.careers.items.map((item, i) => (
                <Reveal
                  key={item}
                  delay={i * 60}
                  className="group flex items-center gap-4 border border-ink-950 bg-background p-5 transition-colors hover:bg-ink-950"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-950 text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-ink-900 transition-colors group-hover:text-white">
                    {item}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Duration / Entry / Assessment ── */}
      <section className="section bg-ink-950 text-white">
        <div className="container">
          <p className="text-center font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
            {content.standards ? '06' : '05'} / The Detail
          </p>
          <div className="mt-6">
            <SectionHeading
              dark
              align="center"
              eyebrow="The Detail"
              title="Everything you need to know"
              description="Duration, entry requirements and how you’ll be assessed, all in one place."
            />
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <DetailCard
              icon={Clock}
              title={content.duration.heading}
              intro={content.duration.summary}
              items={content.duration.points}
            />
            <DetailCard
              icon={ListChecks}
              title={content.entryRequirements.heading}
              intro={content.entryRequirements.intro}
              items={content.entryRequirements.items}
            />
            <DetailCard
              icon={ClipboardCheck}
              title={content.assessment.heading}
              intro={content.assessment.intro}
              items={content.assessment.items}
            />
          </div>
        </div>
      </section>

      {/* ── Upcoming courses ── */}
      {courses.length > 0 ? (
        <section className="section bg-ink-50">
          <div className="container">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
              {content.standards ? '07' : '06'} / Dates &amp; Locations
            </p>
            <div className="mt-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Dates &amp; Locations"
                title={`Upcoming ${meta.shortLabel} courses`}
                description="Choose a date that works for you and book your place online."
                className="max-w-xl"
              />
              <Button
                href={`/calendar?type=${meta.slug}`}
                variant="outline"
                className="shrink-0"
              >
                View all dates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course, i) => (
                <Reveal key={course.id} delay={i * 70}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow="Enquire Today"
        title={`Ready to start your ${meta.shortLabel} training?`}
        description="Book your place online or get in touch with our team, we’re happy to answer any questions before you enrol."
        primaryLabel="Book a Course"
        primaryHref="/book"
        secondaryLabel="Ask a Question"
        secondaryHref="/contact"
      />
    </>
  );
}

function DetailCard({
  icon: Icon,
  title,
  intro,
  items,
}: {
  icon: typeof Clock;
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <Reveal className="flex h-full flex-col border border-white/20 bg-ink-950 p-7">
      <div className="flex h-12 w-12 items-center justify-center border border-white/20 text-white">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{intro}</p>
      <CheckList className="mt-5" items={items} />
    </Reveal>
  );
}
