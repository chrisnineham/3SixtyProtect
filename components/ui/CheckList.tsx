import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CheckList({
  items,
  className,
  dark = false,
  columns = 1,
}: {
  items: string[];
  className?: string;
  dark?: boolean;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        'grid gap-x-6 gap-y-3',
        columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              dark ? 'bg-sky-400/15 text-sky-400' : 'bg-sky-100 text-sky-700',
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span
            className={cn(
              'text-[0.95rem] leading-relaxed',
              dark ? 'text-ink-200' : 'text-ink-600',
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
