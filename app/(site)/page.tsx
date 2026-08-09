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
  Quote,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/Section';
import { CourseCard } from '@/components/CourseCard';
import { ServiceCard } from '@/components/ServiceCard';
import { CtaBand } from '@/components/CtaBand';
import { SERVICES } from '@/lib/services';
import { getUpcomingCourses } from '@/lib/courses';
import { COURSE_TYPE_META } from '@/lib/constants';

export default async function HomePage() {
  const upcoming = await getUpcomingCourses(3);

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative">
        {/* Hero — full-bleed image with the headline and copy overlaid in white */}
        <div className="relative isolate overflow-hidden">
          {/* Background image — fills the hero edge to edge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/STERLINGONE.png"
            alt="A close protection officer escorting a client from a vehicle"
            className="absolute inset-0 -z-20 h-full w-full select-none object-cover object-center"
            draggable={false}
          />
          {/* Legibility scrim — darkens the left so the white text stays readable;
              fades toward the right on desktop to keep the image subject visible */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/25 md:from-ink-950/80 md:via-ink-950/40 md:to-transparent" />

          <div className="container relative flex min-h-[785px] flex-col justify-center pb-16 pt-32 sm:pt-36 md:min-h-[940px] lg:min-h-[995px] lg:pb-24">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 border border-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-white">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  Private Security · Protection · Training
                </span>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-6 font-heading font-bold uppercase leading-[1.08] tracking-tight text-white text-display-lg-mobile md:text-display-lg">
                  Full&#8209;spectrum security, protection &amp; training
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-white/80 text-lg leading-relaxed">
                  3Sixty Protect delivers professional security across six
                  disciplines: from executive protection, risk consultancy and
                  technical surveillance to industry-leading SIA training. One
                  accountable partner for those who cannot afford to get security
                  wrong.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/services" variant="light" size="lg">
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href="/book" variant="outline-light" size="lg">
                    Book a Course
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-10 border-t border-white/20 pt-6">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.05em] text-white/60">
                    Our standard
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {[
                      'SIA-licensed professionals',
                      'Operational experience',
                      'Nationwide coverage',
                    ].map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center gap-1.5 border border-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-white"
                      >
                        <Check className="h-3.5 w-3.5 text-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Trust band */}
        <div className="relative z-10 border-y border-ink-950 bg-background">
          <div className="container grid grid-cols-2 divide-x divide-ink-200 md:grid-cols-4">
            {[
              { value: 'Level 2 & 3', label: 'SIA qualifications' },
              { value: 'Small groups', label: 'Personal attention' },
              { value: '6–15 days', label: 'Course durations' },
              { value: 'Licence-ready', label: 'On completion' },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-7 text-center md:px-6">
                <p className="font-heading text-lg font-bold text-ink-900 md:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Our Services ───────────────── */}
      <section className="section bg-ink-50">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="What We Do"
              title="Six disciplines, one standard"
              description="Alongside our industry-leading SIA training, 3Sixty Protect delivers protection, consultancy, surveillance, manpower and investigations, one accountable partner."
              className="max-w-2xl"
            />
            <Button href="/services" variant="outline" className="shrink-0">
              All services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {/* Individually separated cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60} className="h-full">
                <ServiceCard service={s} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Course overviews ───────────────── */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Flagship · Training"
            title="Industry-leading SIA training"
            description="Training is the flagship of our services. Whether you’re starting out on the door or aiming for a career in professional protection, we have the SIA qualification to get you there."
          />

          <div className="mt-8 grid gap-6 md:mt-14 lg:grid-cols-2">
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
            description="We focus on practical, job-ready skills, taught by people who’ve worked the door and the principal’s side."
          />
          {/* Open "spec-sheet" grid — hairline rule per item instead of enclosing boxes */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-9 md:mt-14 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="border-t border-ink-300 pt-4 sm:pt-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <item.icon
                      className="h-6 w-6 shrink-0 text-ink-900"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-heading text-base font-bold text-ink-900 sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-pretty text-sm leading-relaxed text-ink-500 sm:text-base">
                    {item.text}
                  </p>
                </div>
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
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
              {upcoming.map((course, i) => (
                <Reveal key={course.id} delay={i * 70} className="h-full">
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── Trust section ───────────────── */}
      <section className="section bg-ink-950 text-white">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
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
                  <point.icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <div>
                    <p className="font-semibold text-white">{point.title}</p>
                    <p className="mt-1 text-sm text-ink-300">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <figure className="relative border border-white/20 p-6 md:p-8">
              <Quote className="h-9 w-9 text-white/70" />
              <blockquote className="mt-4 text-pretty text-xl font-medium leading-relaxed text-ink-100">
                “The training was practical, professional and genuinely prepared me
                for the job. I passed, got my licence, and was working within weeks.”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-white/40 font-heading font-bold text-white">
                  RM
                </div>
                <div>
                  <p className="font-semibold text-white">Recent graduate</p>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="h-3 w-3 bg-white" />
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
            eyebrow="Simple Booking"
            title="Booking your course takes minutes"
            description="A straightforward journey from choosing your course to walking into the classroom."
          />
          <ol className="mt-8 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-6">
            {journey.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
                <li className="relative h-full border border-ink-950 bg-background p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-4xl text-ink-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <step.icon className="h-5 w-5 text-ink-900" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold uppercase tracking-tight text-ink-900">
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
        description="Book your place on an upcoming SIA course today, or get in touch with any questions. We’re happy to help you choose the right path."
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
      <div className="group flex h-full flex-col border border-ink-950 bg-background p-6 transition-colors hover:bg-ink-950 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center border border-ink-950 text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400 group-hover:text-white/60">
              {meta.abbr === 'DS' ? 'Level 2 Award' : 'Level 3 Award'}
            </p>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-ink-900 group-hover:text-white">
              {meta.label}
            </h3>
          </div>
        </div>
        <p className="mt-5 text-pretty leading-relaxed text-ink-500 group-hover:text-ink-300">
          {meta.blurb}
        </p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 text-sm text-ink-800 group-hover:text-ink-200"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-ink-950 group-hover:border-white">
                <Check className="h-3 w-3 text-ink-900 group-hover:text-white" />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center gap-4 pt-2">
          <Button href={meta.href}>Explore course</Button>
          <Link
            href={`/calendar?type=${meta.slug}`}
            className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-800 transition-colors hover:text-ink-900 group-hover:text-white"
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
