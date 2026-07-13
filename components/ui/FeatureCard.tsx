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
        'group border p-8 transition-colors',
        dark
          ? 'border-white bg-ink-950 hover:bg-background'
          : 'border-ink-950 bg-background hover:bg-ink-950',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center border transition-colors',
          dark
            ? 'border-white text-white group-hover:border-ink-950 group-hover:text-ink-950'
            : 'border-ink-950 text-ink-950 group-hover:border-white group-hover:text-white',
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3
        className={cn(
          'mt-5 font-heading text-lg font-bold',
          dark
            ? 'text-white group-hover:text-ink-900'
            : 'text-ink-900 group-hover:text-white',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'mt-2 text-pretty text-sm leading-relaxed',
          dark
            ? 'text-white/70 group-hover:text-ink-500'
            : 'text-ink-500 group-hover:text-white/70',
        )}
      >
        {children}
      </p>
    </div>
  );
}
