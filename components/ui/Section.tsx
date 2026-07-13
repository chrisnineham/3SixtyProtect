import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

/** Consistent eyebrow + title + description block used across pages. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'center' && 'mx-auto max-w-2xl',
        className,
      )}
    >
      {eyebrow ? (
        <span className={dark ? 'eyebrow-on-dark' : 'eyebrow'}>
          <span className="h-px w-6 bg-current opacity-60" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          'text-balance font-heading font-bold uppercase tracking-tight text-headline-md md:text-display-lg',
          dark ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'text-pretty text-lg leading-relaxed max-w-2xl',
            dark ? 'text-ink-200' : 'text-ink-500',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
