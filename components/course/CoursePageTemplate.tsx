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
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 spotlight" aria-hidden />
        <div
          className="absolute inset-0 bg-grid-faint [background-size:34px_34px] opacity-30"
          aria-hidden
        />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow-on-dark">
                <HeroIcon className="h-4 w-4" />
                {content.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                {content.hero.title}{' '}
                <span className="text-gradient-gold">{content.hero.highlight}</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200">
                {content.hero.description}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/book" size="lg">
                  Book a Course
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href={`/calendar?type=${meta.slug}`}
                  variant="outline-light"
                  size="lg"
                >
                  View Upcoming Courses
                </Button>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { icon: Award, label: 'Qualification', value: content.level },
                  { icon: Clock, label: 'Duration', value: content.durationLabel },
                  {
                    icon: BadgeCheck,
                    label: 'Outcome',
                    value: 'SIA licence-linked',
                  },
                ].map((fact) => (
                  <div key={fact.label} className="flex items-center gap-3">
                    <fact.icon className="h-5 w-5 text-gold-400" />
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-ink-400">
                        {fact.label}
                      </dt>
                      <dd className="font-semibold text-white">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What is + At a glance ── */}
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Overview"
              title={content.whatIs.heading}
            />
            <div className="mt-6 space-y-5 text-pretty text-lg leading-relaxed text-ink-600">
              {content.whatIs.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="sticky top-24 rounded-3xl border border-ink-100 bg-ink-950 p-7 text-white shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Course at a glance
                </p>
                <ul className="mt-5 divide-y divide-white/10">
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
                    <li key={row.label} className="flex items-center gap-4 py-3.5">
                      <row.icon className="h-5 w-5 shrink-0 text-gold-400" />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <span className="text-sm text-ink-300">{row.label}</span>
                        <span className="text-right text-sm font-semibold text-white">
                          {row.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button href="/book" className="mt-6 w-full">
                  Book your place
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-xs text-ink-400">
                  Limited spaces · Secure online booking
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Who it's for + What you'll gain ── */}
      <section className="section bg-ink-50">
        <div className="container grid gap-10 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-ink-100 bg-white p-8 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-gold-400">
              <Users className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-ink-900">
              {content.whoFor.heading}
            </h2>
            <p className="mt-3 text-ink-500">{content.whoFor.intro}</p>
            <CheckList className="mt-6" items={content.whoFor.items} />
          </Reveal>

          <Reveal
            delay={100}
            className="rounded-3xl border border-ink-100 bg-white p-8 shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-gold-400">
              <Star className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-ink-900">
              {content.whatGain.heading}
            </h2>
            <p className="mt-3 text-ink-500">{content.whatGain.intro}</p>
            <CheckList className="mt-6" items={content.whatGain.items} />
          </Reveal>
        </div>
      </section>

      {/* ── Areas covered ── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="The Curriculum"
            title={content.areasCovered.heading}
            description={content.areasCovered.intro}
            className="max-w-2xl"
          />
          <div className="mt-10 rounded-3xl border border-ink-100 bg-white p-8 shadow-card md:p-10">
            <CheckList columns={2} items={content.areasCovered.items} />
          </div>
        </div>
      </section>

      {/* ── Professional standards (CP only) ── */}
      {content.standards ? (
        <section className="section bg-ink-950 text-white">
          <div className="container">
            <SectionHeading
              dark
              eyebrow="Professionalism"
              title={content.standards.heading}
              description={content.standards.intro}
              className="max-w-2xl"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.standards.items.map((item, i) => (
                <Reveal
                  key={item}
                  delay={i * 50}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <span className="text-[0.95rem] text-ink-200">{item}</span>
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
            <SectionHeading
              eyebrow="Your Future"
              title={content.careers.heading}
              description={content.careers.intro}
            />
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
                  className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-ink-800">{item}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Duration / Entry / Assessment ── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="The Detail"
            title="Everything you need to know"
            description="Duration, entry requirements and how you’ll be assessed — all in one place."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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
        description="Book your place online or get in touch with our team — we’re happy to answer any questions before you enrol."
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
    <Reveal className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-gold-400">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-xl font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{intro}</p>
      <CheckList className="mt-5" items={items} />
    </Reveal>
  );
}
