import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { CaseEvaluation } from '@/lib/screening/engine';
import { ageFromDob } from '@/lib/screening/masking';
import { STAGES, type AdminUserLite, type CaseFile } from '@/lib/screening/types';
import { AssignmentControl } from './AssignmentControl';
import { CaseStatusBadge } from './StatusBadges';
import { ProgressBar, fmtDate } from './primitives';

/**
 * Answers the first questions an administrator has within seconds:
 * who is this, how far along, what status, who owns it, what is outstanding.
 */
export function CaseHeader({
  file,
  evaluation,
  admins,
  canManage,
}: {
  file: CaseFile;
  evaluation: CaseEvaluation;
  admins: AdminUserLite[];
  canManage: boolean;
}) {
  const { case: c, candidate } = file;
  const age = ageFromDob(candidate.date_of_birth);
  const stageLabel = STAGES.find((s) => s.key === evaluation.currentStage)?.label ?? '';

  return (
    <header className="border border-ink-950 bg-white">
      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="ink">BS 7858 Screening</Badge>
            <CaseStatusBadge status={c.status} />
            {c.locked ? (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
                <Lock className="h-3.5 w-3.5" /> Locked
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 truncate font-heading text-2xl font-bold uppercase tracking-tight text-ink-900">
            {candidate.legal_name}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {c.proposed_role ?? 'Role not recorded'}
            {c.sia_licence_type ? ` · SIA ${c.sia_licence_type}` : ''}
            {age !== null ? ` · Age ${age}` : ''}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">
            Reference {c.reference}
          </p>
        </div>

        <div className="w-full lg:w-72">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">Progress</span>
            <span className="font-heading text-2xl tracking-tight text-ink-900">{evaluation.progress.overall}%</span>
          </div>
          <ProgressBar percent={evaluation.progress.overall} className="mt-2" />
          <p className="mt-2 text-xs text-ink-500">
            {evaluation.counts.outstanding} outstanding · {evaluation.counts.openIssues} open issue
            {evaluation.counts.openIssues === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-ink-200 border-t border-ink-950 text-sm md:grid-cols-4">
        <div className="px-5 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">Screening started</dt>
          <dd className="mt-1 text-ink-900">{fmtDate(c.screening_start_date)}</dd>
        </div>
        <div className="px-5 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">Current stage</dt>
          <dd className="mt-1 text-ink-900">{stageLabel}</dd>
        </div>
        <div className="px-5 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">Proposed start</dt>
          <dd className="mt-1 text-ink-900">{fmtDate(c.proposed_start_date)}</dd>
        </div>
        <div className="px-5 py-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-500">Assigned to</dt>
          <dd className="mt-1">
            {canManage && !c.locked ? (
              <AssignmentControl caseId={c.id} assignedTo={c.assigned_to} admins={admins} />
            ) : (
              <span className="text-ink-900">{c.assignee?.email ?? 'Unassigned'}</span>
            )}
          </dd>
        </div>
      </dl>
    </header>
  );
}
