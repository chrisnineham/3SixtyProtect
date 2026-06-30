import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { CloudGlow } from './CloudGlow';

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/60">
      <CloudGlow />
      <div className="container relative z-10 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pt-40">
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/80 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-600 shadow-sm backdrop-blur">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink-900 sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-500">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
