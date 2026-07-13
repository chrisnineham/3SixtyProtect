import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

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
    <section className="relative bg-background border-b border-ink-950">
      <div className="container pb-12 pt-28 md:pb-16 md:pt-36">
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 bg-ink-950 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 font-heading font-bold uppercase tracking-tight text-display-lg-mobile text-ink-900 md:text-display-lg">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
