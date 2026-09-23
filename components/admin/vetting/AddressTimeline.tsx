import type { ReactNode } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';
import type { Gap } from '@/lib/screening/engine';
import type { ScreeningAddress } from '@/lib/screening/types';
import { cn } from '@/lib/utils';
import { SourceBadge, VerificationBadge } from './StatusBadges';
import { RecordCard, fmtDate, fmtRange } from './primitives';

type Entry =
  | { type: 'address'; from: string; address: ScreeningAddress }
  | { type: 'gap'; from: string; gap: Gap };

/** Chronological address history with unexplained gaps shown inline. */
export function AddressTimeline({
  addresses,
  gaps,
  issuesHref,
  renderActions,
  renderFooter,
}: {
  addresses: ScreeningAddress[];
  gaps: Gap[];
  issuesHref: string;
  renderActions?: (address: ScreeningAddress) => ReactNode;
  renderFooter?: (address: ScreeningAddress) => ReactNode;
}) {
  const entries: Entry[] = [
    ...addresses.map((address) => ({ type: 'address' as const, from: address.from_date, address })),
    ...gaps.map((gap) => ({ type: 'gap' as const, from: gap.from, gap })),
  ].sort((a, b) => a.from.localeCompare(b.from));

  return (
    <ol className="relative ml-2 border-l border-ink-950 pl-6">
      {entries.map((entry) => {
        if (entry.type === 'gap') {
          return (
            <li key={`gap-${entry.gap.from}`} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[35px] top-0.5 flex h-5 w-5 items-center justify-center border border-error bg-white text-error">
                <AlertTriangle className="h-3 w-3" />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
                {fmtRange(entry.gap.from, entry.gap.to)}
              </p>
              <p className="mt-1 text-sm font-medium text-error">
                Gap requiring explanation · {entry.gap.days} days
              </p>
              <p className="mt-0.5 text-xs text-ink-500">
                Raised as an issue for administrator review. Add an address covering this period or record the
                candidate’s explanation on the{' '}
                <a href={issuesHref} className="underline hover:text-ink-900">
                  issues tab
                </a>
                .
              </p>
            </li>
          );
        }
        const a = entry.address;
        const lines = [a.address_line_1, a.address_line_2, a.town, a.postcode, a.country].filter(Boolean);
        const problem = a.verification_status === 'discrepancy' || a.verification_status === 'unable_to_verify';
        return (
          <li key={a.id} className="relative pb-6 last:pb-0">
            <span
              className={cn(
                'absolute -left-[35px] top-0.5 flex h-5 w-5 items-center justify-center border bg-white',
                a.verification_status === 'verified'
                  ? 'border-ink-950 bg-ink-950 text-white'
                  : problem
                    ? 'border-error text-error'
                    : 'border-ink-950 text-ink-900',
              )}
            >
              <MapPin className="h-3 w-3" />
            </span>
            <RecordCard
              id={`address-${a.id}`}
              attention={problem}
              actions={renderActions?.(a)}
              footer={renderFooter?.(a)}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
                {fmtRange(a.from_date, a.is_current ? null : a.to_date)}
                {a.is_current ? ' · Current address' : ''}
              </p>
              <p className="mt-1 text-sm font-medium text-ink-900">{lines.join(', ')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <VerificationBadge status={a.verification_status} />
                <SourceBadge source={a.source} />
                {a.verification_method ? <span className="text-xs text-ink-500">via {a.verification_method}</span> : null}
                {a.verified_at ? <span className="text-xs text-ink-500">on {fmtDate(a.verified_at)}</span> : null}
              </div>
              {a.notes ? <p className="mt-2 whitespace-pre-line text-xs text-ink-600">{a.notes}</p> : null}
            </RecordCard>
          </li>
        );
      })}
    </ol>
  );
}
