import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { STAGES, type ScreeningCase } from '@/lib/screening/types';
import { cn } from '@/lib/utils';
import { CaseStatusBadge } from './StatusBadges';
import { EmptyState, ProgressBar, fmtDate } from './primitives';

function stageLabel(c: ScreeningCase): string {
  return STAGES.find((s) => s.key === c.current_stage)?.label ?? '';
}

/** The screening queue: desktop table, stacked cards on small screens. */
export function ScreeningQueue({ cases, emptyText }: { cases: ScreeningCase[]; emptyText: string }) {
  if (cases.length === 0) {
    return <EmptyState icon={ShieldCheck} title="No screenings match" text={emptyText} />;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[64rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-950 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">
              <th className="px-5 py-3 font-medium">Candidate</th>
              <th className="px-3 py-3 font-medium">Role</th>
              <th className="px-3 py-3 font-medium">Started</th>
              <th className="w-40 px-3 py-3 font-medium">Progress</th>
              <th className="px-3 py-3 font-medium">Current stage</th>
              <th className="px-3 py-3 text-center font-medium">Outstanding</th>
              <th className="px-3 py-3 font-medium">Assigned to</th>
              <th className="px-3 py-3 text-center font-medium">Issues</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {cases.map((c) => (
              <tr key={c.id} className="align-top transition-colors hover:bg-ink-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/vetting/${c.id}`} className="font-medium text-ink-900 hover:underline">
                    {c.candidate?.legal_name ?? 'Unknown candidate'}
                  </Link>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">{c.reference}</p>
                </td>
                <td className="px-3 py-3 text-ink-700">{c.proposed_role ?? '–'}</td>
                <td className="whitespace-nowrap px-3 py-3 text-ink-700">{fmtDate(c.screening_start_date)}</td>
                <td className="px-3 py-3">
                  <ProgressBar percent={c.progress_percent} size="sm" showLabel />
                </td>
                <td className="px-3 py-3 text-ink-700">{stageLabel(c)}</td>
                <td className="px-3 py-3 text-center tabular-nums text-ink-900">{c.outstanding_count}</td>
                <td className="max-w-[12rem] truncate px-3 py-3 text-ink-700">{c.assignee?.email ?? 'Unassigned'}</td>
                <td className={cn('px-3 py-3 text-center tabular-nums', c.open_issue_count > 0 ? 'font-semibold text-error' : 'text-ink-500')}>
                  {c.open_issue_count}
                </td>
                <td className="px-3 py-3">
                  <CaseStatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/vetting/${c.id}`}
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900 hover:underline"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet */}
      <ul className="divide-y divide-ink-200 lg:hidden">
        {cases.map((c) => (
          <li key={c.id}>
            <Link href={`/admin/vetting/${c.id}`} className="block px-5 py-4 transition-colors hover:bg-ink-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{c.candidate?.legal_name ?? 'Unknown candidate'}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-500">
                    {c.proposed_role ?? 'Role not recorded'} · {c.reference}
                  </p>
                </div>
                <CaseStatusBadge status={c.status} />
              </div>
              <ProgressBar percent={c.progress_percent} size="sm" showLabel className="mt-3" />
              <p className="mt-2 text-xs text-ink-500">
                {stageLabel(c)} · {c.outstanding_count} outstanding
                {c.open_issue_count > 0 ? ` · ${c.open_issue_count} issue${c.open_issue_count === 1 ? '' : 's'}` : ''}
                {' · '}
                {c.assignee?.email ?? 'Unassigned'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
