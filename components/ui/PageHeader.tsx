import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  image,
  imageAlt = '',
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  /** Optional full-bleed background image (path under /public). */
  image?: string;
  imageAlt?: string;
  /** Shorter image hero for task pages (e.g. booking) where the form matters more. */
  compact?: boolean;
}) {
  const hasImage = Boolean(image);

  return (
    <section className="relative isolate overflow-hidden border-b border-ink-950 bg-background">
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : true}
            className="absolute inset-0 -z-20 h-full w-full select-none object-cover object-[72%_center] md:object-center"
            draggable={false}
          />
          {/* Legibility scrim — darker on the left where the copy sits */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/60 to-ink-950/30 md:from-ink-950/80 md:via-ink-950/45 md:to-transparent" />
        </>
      )}
      <div
        className={`container relative z-10 ${
          hasImage
            ? compact
              ? 'flex min-h-[420px] flex-col justify-center pb-12 pt-28 md:min-h-[480px] md:pt-32'
              : 'flex min-h-[785px] flex-col justify-center py-24 md:min-h-[940px] lg:min-h-[995px]'
            : 'pb-12 pt-28 md:pb-16 md:pt-36'
        }`}
      >
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <span
              className={
                hasImage
                  ? 'inline-flex items-center gap-2 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-950'
                  : 'inline-flex items-center gap-2 bg-ink-950 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white'
              }
            >
              {eyebrow}
            </span>
          ) : null}
          <h1
            className={`mt-5 font-heading font-bold uppercase tracking-tight text-display-lg-mobile md:text-display-lg md:tracking-[-0.03em] ${
              hasImage ? 'text-white' : 'text-ink-900'
            }`}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={`mt-5 max-w-2xl text-lg leading-relaxed ${
                hasImage ? 'text-white/80' : 'text-ink-500'
              }`}
            >
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
