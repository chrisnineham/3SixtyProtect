import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  UserRoundCheck,
  Award,
  Users,
  Target,
  BadgeCheck,
  GraduationCap,
  CalendarCheck,
  ClipboardCheck,
  Star,
  Quote,
  CalendarDays,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/Section';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { CourseCard } from '@/components/CourseCard';
import { CtaBand } from '@/components/CtaBand';
import { CloudGlow } from '@/components/ui/CloudGlow';
import { getUpcomingCourses } from '@/lib/courses';
import { COURSE_TYPE_META } from '@/lib/constants';
import { formatDateRange, formatPrice } from '@/lib/utils';

export default async function HomePage() {
  const upcoming = await getUpcomingCourses(3);
  const nextCourse = upcoming[0];

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <CloudGlow />

        <div className="container relative z-10 grid items-center gap-12 pb-16 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-40">
          {/* Left — text */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-ink-600 shadow-sm backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
                SIA Door Supervision &amp; Close Protection
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-6 text-balance font-display text-[2.4rem] font-extrabold leading-[1.06] tracking-[-0.02em] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
                Professional SIA security training built around{' '}
                <span className="text-gradient-sky">real-world standards</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-500">
                3Sixty Protect delivers high-quality Door Supervision and Close
                Protection training for people looking to enter or progress within
                the private security industry.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/book" size="lg">
                  Book a Course
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/calendar" variant="outline" size="lg">
                  View Training Calendar
                </Button>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 border-t border-ink-200/70 pt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  What you get
                </p>
                <ul className="flex flex-wrap gap-2">
                  {[
                    'SIA-aligned curriculum',
                    'Industry-active trainers',
                    'Full licence support',
                  ].map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-sm"
                    >
                      <BadgeCheck className="h-3.5 w-3.5 text-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right — floating card cluster */}
          <div className="lg:col-span-6">
            <Reveal delay={160}>
              <div className="relative mx-auto max-w-sm lg:mr-0 lg:max-w-md">
                {/* Main next-intake card */}
                <div className="relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white p-6 shadow-[0_18px_50px_-16px_rgba(15,23,42,0.25)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                      Next intake
                    </span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-sky-400/70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                    </span>
                  </div>

                  {nextCourse ? (
                    <div className="mt-4">
                      <Badge tone="gold">
                        {COURSE_TYPE_META[nextCourse.course_type].shortLabel}
                      </Badge>
                      <h2 className="mt-3 text-lg font-bold text-ink-900">
                        {nextCourse.title}
                      </h2>
                      <dl className="mt-4 space-y-2.5 text-sm text-ink-600">
                        <div className="flex items-center gap-2.5">
                          <CalendarDays className="h-4 w-4 text-sky-500" />
                          {formatDateRange(nextCourse.start_date, nextCourse.end_date)}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="h-4 w-4 text-sky-500" />
                          {nextCourse.location}
                        </div>
                      </dl>
                      <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
                        <div>
                          <span className="block text-xs text-ink-400">From</span>
                          <span className="text-2xl font-bold text-ink-900">
                            {formatPrice(nextCourse.price)}
                          </span>
                        </div>
                        <Button href={`/book?course=${nextCourse.id}`} size="sm">
                          Reserve place
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-ink-500">
                      New course dates are being scheduled. Get in touch and we’ll
                      let you know as soon as they’re live.
                      <div className="mt-5">
                        <Button href="/contact" size="sm">
                          Enquire about dates
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating — booking confirmation */}
                <div className="absolute -right-4 -top-6 hidden w-[224px] animate-float-1 motion-reduce:animate-none sm:block">
                  <div className="rounded-xl border border-ink-200/70 bg-white p-3.5 shadow-float">
                    <div className="mb-2 flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-sky-50">
                        <CheckCircle2 className="h-4 w-4 text-sky-600" />
                      </div>
                      <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                        Booked
                      </span>
                      <span className="ml-auto text-[11px] text-ink-300">Just now</span>
                    </div>
                    <p className="text-sm font-semibold text-ink-900">New booking</p>
                    <p className="text-xs text-ink-400">Door Supervision · London</p>
                  </div>
                </div>

                {/* Floating — availability */}
                {nextCourse ? (
                  <div className="absolute -bottom-7 -left-5 hidden w-[208px] animate-float-2 motion-reduce:animate-none sm:block">
                    <div className="rounded-xl border border-ink-200/70 bg-white p-4 shadow-float">
                      <p className="text-[11px] font-medium text-ink-400">
                        Availability
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-ink-900">
                        {nextCourse.available_spaces} of {nextCourse.max_spaces} spaces left
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500"
                          style={{
                            width: `${Math.min(100, Math.round((1 - nextCourse.available_spaces / Math.max(1, nextCourse.max_spaces)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Trust band */}
        <div className="relative z-10 border-y border-ink-200/60 bg-white/70 backdrop-blur">
          <div className="container grid grid-cols-2 gap-y-5 py-7 md:grid-cols-4">
            {[
              { value: 'Level 2 & 3', label: 'SIA qualifications' },
              { value: 'Small groups', label: 'Personal attention' },
              { value: '6–15 days', label: 'Course durations' },
              { value: 'Licence-ready', label: 'On completion' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 text-center md:px-6">
                <p className="font-display text-lg font-extrabold text-ink-900 md:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Course overviews ───────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Our Training"
            title="Two routes into professional security"
            description="Whether you’re starting out on the door or aiming for a career in professional protection, we have the SIA qualification to get you there."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <CourseOverviewCard
              icon={ShieldCheck}
              type="door_supervision"
              points={[
                'Work in pubs, clubs, events & licensed venues',
                'Physical intervention & conflict management',
                'The fastest route into the security industry',
              ]}
            />
            <CourseOverviewCard
              icon={UserRoundCheck}
              type="close_protection"
              points={[
                'Protect individuals as a professional CPO',
                'Operational planning, drills & threat assessment',
                'A premium, high-earning career path',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ───────────────── Why choose us ───────────────── */}
      <section className="section bg-ink-50">
        <div className="container">
          <SectionHeading
            eyebrow="Why 3Sixty Protect"
            title="Training that prepares you for the real world"
            description="We focus on practical, job-ready skills — taught by people who’ve worked the door and the principal’s side."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <FeatureCard icon={item.icon} title={item.title}>
                  {item.text}
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Upcoming courses ───────────────── */}
      {upcoming.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Upcoming Courses"
                title="Reserve your place"
                description="Our soonest available intakes. Spaces are limited and fill quickly."
                className="max-w-xl"
              />
              <Button href="/calendar" variant="outline" className="shrink-0">
                View full calendar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((course, i) => (
                <Reveal key={course.id} delay={i * 70}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── Trust section ───────────────── */}
      <section className="section bg-ink-950 text-white">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              dark
              eyebrow="Trusted Training"
              title="A name you can build a career on"
              description="From your first day in training to your licence application, we’re focused on standards, safety and your success."
            />
            <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point.title} className="flex gap-3">
                  <point.icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                  <div>
                    <p className="font-semibold text-white">{point.title}</p>
                    <p className="mt-1 text-sm text-ink-300">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <figure className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <Quote className="h-9 w-9 text-sky-400/70" />
              <blockquote className="mt-4 text-pretty text-xl font-medium leading-relaxed text-ink-100">
                “The training was practical, professional and genuinely prepared me
                for the job. I passed, got my licence, and was working within weeks.”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/15 font-heading font-bold text-sky-400">
                  RM
                </div>
                <div>
                  <p className="font-semibold text-white">Recent graduate</p>
                  <div className="flex items-center gap-0.5 text-sky-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── Booking journey ───────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Simple Booking"
            title="Booking your course takes minutes"
            description="A straightforward journey from choosing your course to walking into the classroom."
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {journey.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
                <li className="relative h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 font-heading text-lg font-bold text-sky-400">
                      {i + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-sky-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {step.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────── Closing CTA ───────────────── */}
      <CtaBand
        eyebrow="Start Your Security Career"
        title="Ready to get qualified with 3Sixty Protect?"
        description="Book your place on an upcoming SIA course today, or get in touch with any questions — we’re happy to help you choose the right path."
        primaryLabel="Book a Course"
        primaryHref="/book"
        secondaryLabel="View Training Calendar"
        secondaryHref="/calendar"
      />
    </>
  );
}

/* ── Local presentational helpers ─────────────────────────────── */

function CourseOverviewCard({
  icon: Icon,
  type,
  points,
}: {
  icon: typeof ShieldCheck;
  type: 'door_supervision' | 'close_protection';
  points: string[];
}) {
  const meta = COURSE_TYPE_META[type];
  return (
    <Reveal className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-100/60 blur-2xl transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-sky-400">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              {meta.abbr === 'DS' ? 'Level 2 Award' : 'Level 3 Award'}
            </p>
            <h3 className="text-2xl font-bold text-ink-900">{meta.label}</h3>
          </div>
        </div>
        <p className="relative mt-5 text-pretty leading-relaxed text-ink-500">
          {meta.blurb}
        </p>
        <ul className="relative mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-ink-700">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
              {p}
            </li>
          ))}
        </ul>
        <div className="relative mt-8 flex items-center gap-3 pt-2">
          <Button href={meta.href}>Explore course</Button>
          <Link
            href={`/calendar?type=${meta.slug}`}
            className="text-sm font-semibold text-ink-600 transition-colors hover:text-sky-600"
          >
            See dates →
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

const whyChoose = [
  {
    icon: Award,
    title: 'SIA-aligned training',
    text: 'Courses mapped to SIA specifications so you train exactly what you need to become licence-ready.',
  },
  {
    icon: Users,
    title: 'Experienced instructors',
    text: 'Learn from trainers with real, current experience in door supervision and close protection.',
  },
  {
    icon: Target,
    title: 'Practical & job-ready',
    text: 'Scenario-based learning that builds the confidence and judgement the job actually demands.',
  },
  {
    icon: GraduationCap,
    title: 'Small class sizes',
    text: 'Capped group sizes mean more hands-on time, feedback and support throughout your course.',
  },
  {
    icon: ClipboardCheck,
    title: 'Full licence support',
    text: 'We guide you through assessment and the SIA licence application so nothing holds you back.',
  },
  {
    icon: CalendarCheck,
    title: 'Flexible dates & venues',
    text: 'Regular intakes across multiple locations to fit around your schedule and commitments.',
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Standards-first',
    text: 'We train to the standards employers and the SIA expect.',
  },
  {
    icon: Users,
    title: 'Real instructors',
    text: 'Taught by people who’ve done the work, not just read about it.',
  },
  {
    icon: BadgeCheck,
    title: 'Qualification you can use',
    text: 'Recognised SIA awards that open real doors.',
  },
  {
    icon: ClipboardCheck,
    title: 'Support throughout',
    text: 'From enrolment to licence, we’re with you the whole way.',
  },
];

const journey = [
  {
    icon: Target,
    title: 'Choose your course',
    text: 'Decide between Door Supervision and Close Protection, and browse upcoming dates.',
  },
  {
    icon: CalendarCheck,
    title: 'Book online',
    text: 'Reserve your place in minutes with our simple online booking form.',
  },
  {
    icon: ClipboardCheck,
    title: 'Get confirmation',
    text: 'We confirm your booking and send everything you need to prepare.',
  },
  {
    icon: GraduationCap,
    title: 'Train & qualify',
    text: 'Attend, pass your assessments and apply for your SIA licence.',
  },
];
