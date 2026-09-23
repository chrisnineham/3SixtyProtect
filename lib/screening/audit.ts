import type { Db } from './queries';
import { redactForAudit } from './masking';
import type { Stage } from './types';

export interface AuditInput {
  caseId: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  section?: Stage | null;
  recordType?: string | null;
  recordId?: string | null;
  previous?: Record<string, unknown> | null;
  next?: Record<string, unknown> | null;
  notes?: string | null;
}

/**
 * Append an audit event. Sensitive values are masked before storage and the
 * table itself rejects UPDATE/DELETE. Never throws — an audit failure must not
 * roll back the user's action, but it is logged (without personal data).
 */
export async function recordAudit(db: Db, input: AuditInput): Promise<void> {
  const { error } = await db.from('screening_audit_events').insert({
    case_id: input.caseId,
    actor_id: input.actorId,
    actor_email: input.actorEmail,
    action: input.action,
    section: input.section ?? null,
    record_type: input.recordType ?? null,
    record_id: input.recordId ?? null,
    previous_state: redactForAudit(input.previous ?? null),
    new_state: redactForAudit(input.next ?? null),
    notes: input.notes ?? null,
  });
  if (error) {
    console.error('[screening] audit write failed:', error.message, 'action=', input.action);
  }
}
