import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/Section';
import { CheckList } from '@/components/ui/CheckList';
import { CtaBand } from '@/components/CtaBand';
import { ServiceIcon } from '@/components/ServiceIcon';
import type { Service } from '@/lib/services';

export function ServicePageTemplate({ service }: { service: Service }) {
  const hasHeroImage = Boolean(service.heroImage);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-background border-b border-ink-950">
        <div className={hasHeroImage ? 'relative isolate overflow-hidden' : 'relative'}>
          {hasHeroImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.heroImage}
                alt=""
                aria-hidden
                className="absolute inset-0 -z-20 h-full w-full select-none object-cover object-[72%_center] md:object-center"
                draggable={false}
              />
              {/* Legibility scrim — darker on the left where the copy sits */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/60 to-ink-950/30 md:from-ink-950/80 md:via-ink-950/45 md:to-transparent" />
            </>
          )}
          <div
            className={`container relative z-10 pb-14 pt-40 sm:pt-44 lg:pb-20 lg:pt-52 ${
              hasHeroImage ? 'min-h-[785px] md:min-h-[940px] lg:min-h-[995px]' : ''
            }`}
          >
            <div className="max-w-4xl">
              <Reveal>
                <span
                  className={
                    hasHeroImage
                      ? 'inline-flex items-center gap-2 border border-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-white'
                      : 'inline-flex items-center gap-2 border border-ink-950 bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-800'
                  }
                >
                  <ServiceIcon name={service.icon} className="h-3.5 w-3.5" />
                  {service.category}
                </span>
              </Reveal>
              <Reveal delay={60}>
                <h1
                  className={`mt-8 text-left font-heading font-bold uppercase tracking-tight text-display-lg-mobile leading-[0.95] md:text-display-2xl ${
                    hasHeroImage ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  {service.name}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className={`mt-6 text-xl ${hasHeroImage ? 'text-white/80' : 'text-ink-500'}`}>
                  {service.tagline}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p
                  className={`mt-6 max-w-2xl text-lg leading-relaxed ${
                    hasHeroImage ? 'text-white/85' : 'text-ink-800'
                  }`}
                >
                  {service.heroBlurb}
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={service.ctaHref}
                    variant={hasHeroImage ? 'light' : 'primary'}
                    size="lg"
                  >
                    {service.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/services"
                    variant={hasHeroImage ? 'outline-light' : 'outline'}
                    size="lg"
                  >
                    All services
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Fact row ── */}
        <Reveal delay={280}>
          <dl
            className={factGridClass(service.keyFacts.length)}
          >
            {service.keyFacts.map((fact) => (
              <div
                key={fact.label}
                className="px-6 py-6 sm:px-8 lg:px-10"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-heading font-bold uppercase tracking-tight text-ink-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── 01 / Overview ── */}
      <section className="section bg-ink-50">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            01 / Overview
          </p>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-800 max-w-3xl">
            {service.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 / What we provide ── */}
      <section className="section bg-ink-950 text-white">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
            02 / What we provide
          </p>
          <div className="mt-6">
            <SectionHeading
              dark
              eyebrow="What we provide"
              title="Capabilities across the engagement"
              className="max-w-2xl"
            />
          </div>
          <div className="mt-12 grid gap-px bg-white/20 sm:grid-cols-2">
            {service.features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={service.icon}
                title={feature.title}
                description={feature.description}
                delay={(i % 2) * 60}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 / Who it's for ── */}
      <section className="section bg-ink-50">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
            03 / Who it's for
          </p>
          <div className="mt-6">
            <SectionHeading
              eyebrow="Who it's for"
              title={`Who ${service.name} is built for`}
              className="max-w-2xl"
            />
          </div>
          <div className="mt-10 border border-ink-950 bg-background p-8 md:p-10">
            <CheckList columns={2} items={service.whoFor} />
          </div>
        </div>
      </section>

      {/* ── 04 / Our approach ── */}
      <section className="section bg-ink-950 text-white">
        <div className="container">
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
            04 / Our approach
          </p>
          <div className="mt-6">
            <SectionHeading
              dark
              align="center"
              eyebrow="Our approach"
              title="How we deliver"
              description="A structured engagement, scaled to the real risk picture and documented at every stage."
            />
          </div>
          <div className="mt-12 grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {service.approach.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i * 60}
                className="flex h-full flex-col bg-ink-950 p-7"
              >
                <span className="font-mono text-4xl text-ink-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Work With 3Sixty Protect"
        title={`Ready to discuss ${service.name.toLowerCase()}?`}
        description="Speak to our team for a confidential, no-obligation conversation about your requirements. We'll set out exactly how we can help."
        primaryLabel={service.ctaLabel}
        primaryHref={service.ctaHref}
        secondaryLabel="Contact the team"
        secondaryHref="/contact"
      />
    </>
  );
}

function factGridClass(count: number): string {
  const cols =
    count === 4
      ? 'sm:grid-cols-4'
      : count === 3
        ? 'sm:grid-cols-3'
        : count === 2
          ? 'sm:grid-cols-2'
          : 'sm:grid-cols-1';
  return `border-t border-ink-950 grid grid-cols-1 ${cols} sm:divide-x divide-ink-950`;
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: Service['icon'];
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-ink-950"
    >
      <div className="flex h-12 w-12 items-center justify-center border border-ink-950 text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
        <ServiceIcon name={icon} className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight text-ink-900 transition-colors group-hover:text-white">
        {title}
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-500 transition-colors group-hover:text-white/70">
        {description}
      </p>
    </Reveal>
  );
}
