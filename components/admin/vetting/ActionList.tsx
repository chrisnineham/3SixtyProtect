import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { OutstandingAction } from '@/lib/screening/engine';
import { EmptyState, LEVEL_LABELS, LevelDot } from './primitives';

/** Outstanding actions, most urgent first. Each row deep-links to its section. */
export function ActionList({
  actions,
  limit,
  showVerified = true,
}: {
  actions: OutstandingAction[];
  limit?: number;
  showVerified?: boolean;
}) {
  const visible = (showVerified ? actions : actions.filter((a) => a.level !== 'ok')).slice(0, limit);
  if (visible.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Nothing outstanding"
        text="All recorded screening work is complete for this case."
        className="py-8"
      />
    );
  }
  return (
    <ul className="divide-y divide-ink-200">
      {visible.map((action, i) => (
        <li key={`${action.href}-${i}`}>
          <Link
            href={action.href}
            className="group flex items-start gap-3 px-5 py-3 transition-colors hover:bg-ink-50"
          >
            <LevelDot level={action.level} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink-900">{action.title}</p>
              {action.detail ? <p className="mt-0.5 text-xs text-ink-500">{action.detail}</p> : null}
            </div>
            <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-400 sm:block">
              {LEVEL_LABELS[action.level]}
            </span>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
