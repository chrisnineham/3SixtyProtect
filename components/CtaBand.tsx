import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/constants';

export function CtaBand({
  eyebrow = 'Enquire Today',
  title = 'Take the first step toward a professional security career',
  description = 'Speak to our team or book your place on an upcoming SIA course. We’re here to help you choose the right qualification.',
  primaryLabel = 'Book a Course',
  primaryHref = '/book',
  secondaryLabel = 'Contact Us',
  secondaryHref = '/contact',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="bg-ink-950 py-14 text-white md:py-28">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl">
          <span className="eyebrow-on-dark">{eyebrow}</span>
          <h2 className="mt-5 font-heading text-display-lg-mobile font-bold uppercase tracking-tight text-white md:mt-6 md:text-display-lg">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70 md:mt-6">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <Button href={primaryHref} variant="light" size="lg">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href={secondaryHref} variant="outline-light" size="lg">
              {secondaryLabel}
            </Button>
          </div>
          <a
            href={SITE.phoneHref}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            <Phone className="h-4 w-4" />
            Prefer to talk? Call {SITE.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
