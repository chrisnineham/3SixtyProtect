import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
  dark = false,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        'group rounded-2xl border p-6 transition-all duration-300',
        dark
          ? 'border-white/10 bg-white/[0.03] hover:border-sky-400/40 hover:bg-white/[0.06]'
          : 'border-ink-100 bg-white shadow-card hover:-translate-y-1 hover:shadow-card-hover',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
          dark
            ? 'bg-sky-400/10 text-sky-400 group-hover:bg-sky-400/20'
            : 'bg-ink-900 text-sky-400',
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3
        className={cn(
          'mt-5 text-lg font-semibold',
          dark ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'mt-2 text-pretty text-sm leading-relaxed',
          dark ? 'text-ink-300' : 'text-ink-500',
        )}
      >
        {children}
      </p>
    </div>
  );
}
