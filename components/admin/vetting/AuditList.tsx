import { History } from 'lucide-react';
import { AUDIT_ACTION_LABELS, STAGES, type AuditEvent } from '@/lib/screening/types';
import { cn } from '@/lib/utils';
import { EmptyState, fmtDateTime } from './primitives';

function actionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action.replace(/_/g, ' ');
}

function sectionLabel(section: AuditEvent['section']): string | null {
  if (!section) return null;
  return STAGES.find((s) => s.key === section)?.label ?? section;
}

function State({ label, value }: { label: string; value: Record<string, unknown> | null }) {
  if (!value || Object.keys(value).length === 0) return null;
  return (
    <div className="min-w-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">{label}</p>
      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words bg-ink-50 p-3 font-mono text-[11px] leading-relaxed text-ink-800">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

/**
 * Append-only audit trail. Sensitive fields were masked before the event was
 * stored, so nothing here can leak an identifier.
 */
export function AuditList({ events, compact = false }: { events: AuditEvent[]; compact?: boolean }) {
  if (events.length === 0) {
    return <EmptyState icon={History} title="No activity yet" text="Every change to this screening will be recorded here." className="py-8" />;
  }
  return (
    <ol className="divide-y divide-ink-200">
      {events.map((e) => {
        const section = sectionLabel(e.section);
        const hasState = Boolean(e.previous_state && Object.keys(e.previous_state).length) || Boolean(e.new_state && Object.keys(e.new_state).length);
        return (
          <li key={e.id} className={cn('px-5', compact ? 'py-2.5' : 'py-3.5')}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm text-ink-900">
                <span className="font-medium">{actionLabel(e.action)}</span>
                {section ? <span className="text-ink-500"> · {section}</span> : null}
                {!compact && e.record_type ? (
                  <span className="text-ink-500"> · {e.record_type.replace(/_/g, ' ')}</span>
                ) : null}
              </p>
              <p className="shrink-0 font-mono text-[11px] text-ink-500">
                {fmtDateTime(e.created_at)} · {e.actor_email ?? 'System'}
              </p>
            </div>
            {!compact && e.notes ? <p className="mt-1 whitespace-pre-line text-xs text-ink-600">{e.notes}</p> : null}
            {!compact && hasState ? (
              <details className="group mt-2">
                <summary className="cursor-pointer select-none list-none font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500 hover:text-ink-900 [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Show change</span>
                  <span className="hidden group-open:inline">Hide change</span>
                </summary>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <State label="Previous" value={e.previous_state} />
                  <State label="New" value={e.new_state} />
                </div>
              </details>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
