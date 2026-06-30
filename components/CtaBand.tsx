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
    <section className="section">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 sm:px-12 md:py-20">
          <div className="absolute inset-0 spotlight" aria-hidden />
          <div
            className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-40"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="eyebrow-on-dark justify-center">{eyebrow}</span>
            <h2 className="mt-4 text-balance text-3xl font-bold text-white sm:text-4xl md:text-[2.6rem]">
              {title}
            </h2>
            <p className="mt-4 text-pretty text-lg text-ink-200">{description}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href={primaryHref} size="lg">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={secondaryHref} variant="outline-light" size="lg">
                {secondaryLabel}
              </Button>
            </div>
            <a
              href={SITE.phoneHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-300 transition-colors hover:text-gold-400"
            >
              <Phone className="h-4 w-4 text-gold-500" />
              Prefer to talk? Call {SITE.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
