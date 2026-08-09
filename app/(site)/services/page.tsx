import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceCard } from '@/components/ServiceCard';
import { CtaBand } from '@/components/CtaBand';
import { SERVICES } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Security Services & SIA Training | 3Sixty Protect',
  description:
    'A full-service UK private security company: executive protection, security risk consultancy, technical surveillance, manpower supply and private investigations, plus accredited SIA training, delivered by working operators.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <PageHeader
        eyebrow="Our Services"
        title="Full-spectrum security, protection & training"
        description="From flagship SIA licence-linked training to executive protection, security risk consultancy, technical surveillance, manpower and discreet investigations, one accountable partner across every layer of your security."
        image="/images/LDN.png"
        imageAlt="London skyline at dusk"
      />

      {/* ───────────────────────── Services grid ───────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="border-b border-ink-200 pb-12 md:pb-16">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <SectionHeading
                  eyebrow="Where we protect"
                  title="From the front line to the boardroom"
                />
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-400">
                  Six disciplines · 01 to 06
                </p>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-ink-600 lg:col-span-7">
                <p>
                  Most security companies do one thing. We built 3Sixty Protect to
                  be the exception: a single, accountable partner across the full
                  spectrum of private security. From the SIA licence-linked
                  training that puts qualified officers on the ground, to the close
                  protection teams that keep principals safe at the highest level,
                  it all sits under one roof and one standard.
                </p>
                <p>
                  Every discipline is led by people who have actually done the
                  work: SIA-licensed operators, former military and police, and
                  specialists who understand that real security is judgement as
                  much as presence. That means the same uncompromising standard
                  whether we’re supplying door staff for a venue, protecting a
                  family on the move, sweeping a boardroom for surveillance
                  devices, or building an evidence file that stands up in court.
                </p>
                <p>
                  Take a single service, or combine several under one roof. The
                  advantage of a full-service partner is that nothing slips through
                  the gaps between them. Explore the six disciplines below to see
                  exactly how we protect your people, your assets and your
                  reputation.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.slug} delay={i * 70} className="h-full">
                <ServiceCard service={service} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <CtaBand
        eyebrow="Work With Us"
        title="Tell us what you need to protect."
        description="Whether it's a single event, an ongoing guarding contract or a team ready to be licensed, we'll scope the right solution and stand behind it. Talk to our team today."
        primaryLabel="Request a consultation"
        primaryHref="/contact"
        secondaryLabel="Browse training"
        secondaryHref="/calendar"
      />
    </>
  );
}
