import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'border border-ink-950 p-6',
        accent ? 'bg-ink-950 text-white' : 'bg-background',
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            'font-mono uppercase text-[11px] tracking-[0.05em]',
            accent ? 'text-white/70' : 'text-ink-500',
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center border',
            accent ? 'border-white/40 text-white' : 'border-ink-950 text-ink-900',
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p
        className={cn(
          'mt-4 font-heading text-4xl tracking-tight',
          accent ? 'text-white' : 'text-ink-900',
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className={cn('mt-1 text-xs', accent ? 'text-white/60' : 'text-ink-500')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
