import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'gold' | 'ink';

const tones: Record<Tone, string> = {
  neutral: 'border-ink-950 text-ink-900 bg-transparent',
  success: 'border-ink-950 bg-ink-950 text-white',
  warning: 'border-ink-200 text-ink-400',
  danger: 'border-error text-error bg-transparent',
  gold: 'border-ink-950 bg-ink-950 text-white',
  ink: 'border-ink-950 bg-ink-950 text-white',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.05em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
