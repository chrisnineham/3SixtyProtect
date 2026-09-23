// ─────────────────────────────────────────────────────────────
// Case synchronisation: after any change to a screening file, re-run the
// engine, reconcile system-detected issues, and store the summary columns
// (status, stage, progress, counts) that the queue filters and sorts on.
// ─────────────────────────────────────────────────────────────

import { recordAudit } from './audit';
import { SCREENING_POLICY } from './config';
import { evaluateCase, type CaseEvaluation } from './engine';
import { getCaseFile, type Db } from './queries';
import { UNRESOLVED_ISSUE_STATUSES } from './types';

export interface SyncActor {
  id: string | null;
  email: string | null;
}

const AUTO_RESOLUTION =
  'Automatically resolved: the underlying gap or date inconsistency is no longer present in the recorded history.';

/**
 * Recompute a case. Returns the evaluation (or null if the case is missing).
 * Locked (completed / withdrawn / rejected) cases are left untouched.
 */
export async function syncCase(db: Db, caseId: string, actor: SyncActor): Promise<CaseEvaluation | null> {
  let file = await getCaseFile(db, caseId);
  if (!file) return null;

  let evaluation = evaluateCase(file, SCREENING_POLICY);
  if (file.case.locked) return evaluation;

  let changed = false;
  const existingSystem = file.issues.filter((i) => i.source === 'system' && i.fingerprint);
  const detected = new Map(evaluation.systemIssues.map((s) => [s.fingerprint, s]));

  // Raise issues for newly detected gaps / inconsistencies. An issue that an
  // administrator has already resolved or accepted is never re-raised.
  for (const [fingerprint, candidate] of Array.from(detected.entries())) {
    if (existingSystem.some((i) => i.fingerprint === fingerprint)) continue;
    const { data, error } = await db
      .from('screening_issues')
      .insert({
        case_id: caseId,
        issue_type: candidate.issue_type,
        title: candidate.title,
        description: candidate.description,
        severity: candidate.severity,
        status: 'open',
        section: candidate.section,
        related_record_id: candidate.related_record_id,
        period_from: candidate.period_from,
        period_to: candidate.period_to,
        source: 'system',
        fingerprint,
      })
      .select('id')
      .single();
    if (error) {
      console.error('[screening] could not raise system issue:', error.message);
      continue;
    }
    changed = true;
    await recordAudit(db, {
      caseId,
      actorId: null,
      actorEmail: 'system',
      action: 'issue_raised',
      section: candidate.section,
      recordType: 'issue',
      recordId: data.id,
      next: { title: candidate.title, issue_type: candidate.issue_type, severity: candidate.severity },
      notes: 'Raised automatically by timeline analysis. Requires administrator review.',
    });
  }

  // Auto-resolve system issues whose underlying condition has gone away.
  for (const issue of existingSystem) {
    if (!issue.fingerprint || detected.has(issue.fingerprint)) continue;
    if (!UNRESOLVED_ISSUE_STATUSES.includes(issue.status)) continue;
    const { error } = await db
      .from('screening_issues')
      .update({ status: 'resolved', resolution: AUTO_RESOLUTION, resolved_at: new Date().toISOString() })
      .eq('id', issue.id);
    if (error) {
      console.error('[screening] could not auto-resolve issue:', error.message);
      continue;
    }
    changed = true;
    await recordAudit(db, {
      caseId,
      actorId: null,
      actorEmail: 'system',
      action: 'issue_resolved',
      section: issue.section,
      recordType: 'issue',
      recordId: issue.id,
      previous: { status: issue.status },
      next: { status: 'resolved' },
      notes: AUTO_RESOLUTION,
    });
  }

  if (changed) {
    file = await getCaseFile(db, caseId);
    if (!file) return null;
    evaluation = evaluateCase(file, SCREENING_POLICY);
  }

  if (file.case.status !== 'ready_for_review' && evaluation.status === 'ready_for_review') {
    await recordAudit(db, {
      caseId,
      actorId: actor.id,
      actorEmail: actor.email ?? 'system',
      action: 'screening_submitted',
      section: 'review',
      previous: { status: file.case.status },
      next: { status: 'ready_for_review' },
      notes: 'All required screening work recorded and no unresolved issues. Awaiting a reviewer decision.',
    });
  }

  const { error } = await db
    .from('screening_cases')
    .update({
      status: evaluation.status,
      current_stage: evaluation.currentStage,
      progress_percent: evaluation.progress.overall,
      outstanding_count: evaluation.counts.outstanding,
      awaiting_candidate_count: evaluation.counts.awaitingCandidate,
      awaiting_third_party_count: evaluation.counts.awaitingThirdParty,
      open_issue_count: evaluation.counts.openIssues,
      unverified_period_count: evaluation.counts.unverifiedPeriods,
      updated_by: actor.id,
    })
    .eq('id', caseId);
  if (error) console.error('[screening] could not store case summary:', error.message);

  return evaluation;
}
