import type { Metadata } from 'next';
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
      <section className="border-b border-ink-950 bg-background pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="container">
          <SectionHeading
            eyebrow="Our Services"
            title="Full-spectrum security, protection & training"
            description="From flagship SIA licence-linked training to executive protection, security risk consultancy, technical surveillance, manpower and discreet investigations, one accountable partner across every layer of your security."
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* ───────────────────────── Services grid ───────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid gap-px bg-ink-950 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.slug} delay={i * 70}>
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
