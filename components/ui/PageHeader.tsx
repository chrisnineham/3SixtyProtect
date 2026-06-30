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
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 spotlight opacity-80" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-25"
        aria-hidden
      />
      <div className="container relative py-14 md:py-20">
        <Reveal className="max-w-2xl">
          {eyebrow ? <span className="eyebrow-on-dark">{eyebrow}</span> : null}
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-200">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
