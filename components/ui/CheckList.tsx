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
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border',
              dark ? 'border-white text-white' : 'border-ink-950 text-ink-950',
            )}
          >
            <Check className="h-3 w-3" strokeWidth={2} />
          </span>
          <span
            className={cn(
              'font-sans text-[0.95rem] leading-relaxed',
              dark ? 'text-white' : 'text-ink-800',
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
