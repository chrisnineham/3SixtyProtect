'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { QUEUE_FILTERS, QUEUE_SORTS, type QueueFilter, type QueueSort } from '@/lib/screening/queries';
import { cn } from '@/lib/utils';

function buildHref(next: { filter: QueueFilter; q: string; sort: QueueSort }): string {
  const params = new URLSearchParams();
  if (next.filter !== 'active') params.set('filter', next.filter);
  if (next.q) params.set('q', next.q);
  if (next.sort !== 'oldest') params.set('sort', next.sort);
  const qs = params.toString();
  return `/admin/vetting${qs ? `?${qs}` : ''}`;
}

/** Filter pills, search and sort for the screening queue — all URL-driven. */
export function QueueControls({
  filter,
  q,
  sort,
  counts,
}: {
  filter: QueueFilter;
  q: string;
  sort: QueueSort;
  counts: Partial<Record<QueueFilter, number>>;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 border-b border-ink-950 px-5 py-4">
      <ul className="flex flex-wrap gap-1.5">
        {QUEUE_FILTERS.map((f) => {
          const active = f.key === filter;
          const count = counts[f.key];
          return (
            <li key={f.key}>
              <Link
                href={buildHref({ filter: f.key, q, sort })}
                className={cn(
                  'inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors',
                  active
                    ? 'border-ink-950 bg-ink-950 text-white'
                    : 'border-ink-300 text-ink-600 hover:border-ink-950 hover:text-ink-950',
                )}
              >
                {f.label}
                {count !== undefined ? (
                  <span className={cn('text-[10px]', active ? 'text-white/70' : 'text-ink-400')}>{count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form method="get" action="/admin/vetting" className="flex w-full max-w-md items-center gap-2">
          {filter !== 'active' ? <input type="hidden" name="filter" value={filter} /> : null}
          {sort !== 'oldest' ? <input type="hidden" name="sort" value={sort} /> : null}
          <label className="sr-only" htmlFor="queue-search">
            Search screenings
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="queue-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Name, reference, email or SIA number"
              className="h-10 w-full border border-ink-400 bg-background pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-2 focus:border-ink-950 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-10 border border-ink-950 bg-ink-950 px-4 font-mono text-[11px] uppercase tracking-[0.05em] text-white transition-colors hover:bg-background hover:text-ink-950"
          >
            Search
          </button>
        </form>

        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
          Sort
          <select
            value={sort}
            onChange={(e) => router.push(buildHref({ filter, q, sort: e.target.value as QueueSort }))}
            className="h-10 border border-ink-400 bg-background px-3 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-800 focus:border-2 focus:border-ink-950 focus:outline-none"
          >
            {QUEUE_SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
