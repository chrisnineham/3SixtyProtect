import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/components/ServiceIcon';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/services';

const TRAINING_SLUG = 'training-sia-security-courses';

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const isTraining = service.slug === TRAINING_SLUG;

  return (
    <article className="group relative flex h-full flex-col border border-ink-950 bg-background p-8 transition-colors hover:bg-ink-950">
      {/* Top row: icon square + mono index */}
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center border border-ink-950 text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
          <ServiceIcon name={service.icon} className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <span className="font-mono text-4xl text-ink-300 transition-colors group-hover:text-white/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Category + optional flagship tag */}
      <div className="mt-8 flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400 transition-colors group-hover:text-white/60">
          {service.category}
        </span>
        {isTraining && (
          <span className="border border-ink-950 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
            Flagship
          </span>
        )}
      </div>

      {/* Title with whole-card overlay link */}
      <h3 className="mt-3 text-pretty font-heading text-2xl font-bold uppercase leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-white">
        <Link
          href={service.href}
          className="before:absolute before:inset-0 before:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2 group-hover:focus-visible:ring-white"
        >
          {service.name}
        </Link>
      </h3>

      {/* Tagline body */}
      <p className="mt-4 flex-1 font-sans text-lg leading-relaxed text-ink-500 transition-colors group-hover:text-ink-300">
        {service.tagline}
      </p>

      {/* Bottom CTA */}
      <span className="mt-8 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-900 transition-colors group-hover:text-white">
        {isTraining ? 'Browse courses' : 'View service'}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
