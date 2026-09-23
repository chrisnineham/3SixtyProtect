import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/components/ServiceIcon';
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
  const focusClass =
    service.imageFocus === 'center'
      ? 'object-center'
      : service.imageFocus === 'bottom'
        ? 'object-bottom'
        : 'object-top';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-ink-950 bg-background transition-colors hover:bg-ink-950">
      {/* Image band across the top (square source → top-anchored so heads aren't cut) */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-ink-950 bg-ink-100">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full select-none object-cover ${focusClass} grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.04] group-hover:grayscale-[0.35]`}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ServiceIcon
              name={service.icon}
              className="h-9 w-9 text-ink-400"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      {/* Content below the image */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category (+ flagship) on the left, mono index on the right */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-400 transition-colors group-hover:text-white/60">
              {service.category}
            </span>
            {isTraining && (
              <span className="border border-ink-950 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-900 transition-colors group-hover:border-white group-hover:text-white">
                Flagship
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-2xl leading-none text-ink-300 transition-colors group-hover:text-white/30 sm:text-3xl">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title with whole-card overlay link */}
        <h3 className="mt-2 text-pretty font-heading text-lg font-bold uppercase leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-white sm:mt-3 sm:text-xl">
          <Link
            href={service.href}
            className="before:absolute before:inset-0 before:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2 group-hover:focus-visible:ring-white"
          >
            {service.name}
          </Link>
        </h3>

        {/* Tagline body */}
        <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-ink-500 transition-colors group-hover:text-ink-300 sm:mt-3 sm:text-base">
          {service.tagline}
        </p>

        {/* Bottom CTA */}
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-900 transition-colors group-hover:text-white">
          {isTraining ? 'Browse courses' : 'View service'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
