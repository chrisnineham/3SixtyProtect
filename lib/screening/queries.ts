// ─────────────────────────────────────────────────────────────
// Screening data access. The Supabase client is injected so these
// functions run in Next.js (service-role client) and in scripts alike.
// ─────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminUserLite,
  AuditEvent,
  CaseFile,
  CaseStatus,
  IdentityDocument,
  RightToWork,
  ScreeningActivity,
  ScreeningAddress,
  ScreeningCase,
  ScreeningCheck,
  ScreeningEvidence,
  ScreeningIssue,
  ScreeningReference,
  ScreeningReview,
  SiaCheck,
} from './types';
import { TERMINAL_STATUSES } from './types';

export type Db = SupabaseClient;

const CASE_SELECT =
  '*, candidate:screening_candidates(*), assignee:admin_users!screening_cases_assigned_to_fkey(id,email,role)';

export async function listCases(db: Db): Promise<ScreeningCase[]> {
  const { data, error } = await db
    .from('screening_cases')
    .select(CASE_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ScreeningCase[];
}

export async function getCase(db: Db, id: string): Promise<ScreeningCase | null> {
  const { data, error } = await db.from('screening_cases').select(CASE_SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as unknown as ScreeningCase | null) ?? null;
}

/** Load a complete screening file (all sections) for one case. */
export async function getCaseFile(db: Db, id: string): Promise<CaseFile | null> {
  const c = await getCase(db, id);
  if (!c || !c.candidate) return null;

  const byCase = (table: string, order: string) =>
    db.from(table).select('*').eq('case_id', id).order(order, { ascending: true });

  const [addresses, activities, references, documents, rtw, sia, checks, issues, evidence, reviews] =
    await Promise.all([
      byCase('screening_addresses', 'from_date'),
      byCase('screening_activities', 'from_date'),
      byCase('screening_references', 'created_at'),
      byCase('screening_identity_documents', 'created_at'),
      db.from('screening_right_to_work').select('*').eq('case_id', id).maybeSingle(),
      db.from('screening_sia_checks').select('*').eq('case_id', id).maybeSingle(),
      byCase('screening_checks', 'sort_order'),
      byCase('screening_issues', 'raised_at'),
      byCase('screening_evidence', 'uploaded_at'),
      byCase('screening_reviews', 'reviewed_at'),
    ]);

  for (const r of [addresses, activities, references, documents, rtw, sia, checks, issues, evidence, reviews]) {
    if (r.error) throw r.error;
  }

  return {
    case: c,
    candidate: c.candidate,
    addresses: (addresses.data ?? []) as ScreeningAddress[],
    activities: (activities.data ?? []) as ScreeningActivity[],
    references: (references.data ?? []) as ScreeningReference[],
    identityDocuments: (documents.data ?? []) as IdentityDocument[],
    rightToWork: (rtw.data as RightToWork | null) ?? null,
    sia: (sia.data as SiaCheck | null) ?? null,
    checks: (checks.data ?? []) as ScreeningCheck[],
    issues: (issues.data ?? []) as ScreeningIssue[],
    evidence: (evidence.data ?? []) as ScreeningEvidence[],
    reviews: (reviews.data ?? []) as ScreeningReview[],
  };
}

export async function getAdminUsers(db: Db): Promise<AdminUserLite[]> {
  const { data, error } = await db.from('admin_users').select('id,email,role').order('email');
  if (error) throw error;
  return (data ?? []) as AdminUserLite[];
}

export interface BookingMatch {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  course?: { title: string } | null;
}

/** Existing person records that can seed a new candidate (course bookings). */
export async function searchBookings(db: Db, q: string): Promise<BookingMatch[]> {
  const term = q.replace(/[,()%*]/g, '').trim();
  if (term.length < 2) return [];
  const { data, error } = await db
    .from('bookings')
    .select('id, customer_name, customer_email, customer_phone, course:courses(title)')
    .or(`customer_name.ilike.%${term}%,customer_email.ilike.%${term}%`)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data ?? []) as unknown as BookingMatch[];
}

export async function getBooking(db: Db, id: string): Promise<BookingMatch | null> {
  const { data, error } = await db
    .from('bookings')
    .select('id, customer_name, customer_email, customer_phone, course:courses(title)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as BookingMatch | null) ?? null;
}

export async function listAuditEvents(db: Db, caseId: string, limit = 500): Promise<AuditEvent[]> {
  const { data, error } = await db
    .from('screening_audit_events')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuditEvent[];
}

// ── Queue filtering / sorting (pure) ─────────────────────────

export type QueueFilter =
  | 'active'
  | 'all'
  | 'mine'
  | 'awaiting_candidate'
  | 'awaiting_reference'
  | 'verification_required'
  | 'discrepancies'
  | 'ready'
  | 'completed';

export type QueueSort = 'oldest' | 'newest' | 'least_complete' | 'most_outstanding' | 'start_date';

export const QUEUE_FILTERS: { key: QueueFilter; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'all', label: 'All' },
  { key: 'mine', label: 'Assigned to me' },
  { key: 'awaiting_candidate', label: 'Awaiting candidate' },
  { key: 'awaiting_reference', label: 'Awaiting reference' },
  { key: 'verification_required', label: 'Verification required' },
  { key: 'discrepancies', label: 'Discrepancies' },
  { key: 'ready', label: 'Ready for review' },
  { key: 'completed', label: 'Completed' },
];

export const QUEUE_SORTS: { key: QueueSort; label: string }[] = [
  { key: 'oldest', label: 'Oldest screening' },
  { key: 'newest', label: 'Newest screening' },
  { key: 'least_complete', label: 'Least complete' },
  { key: 'most_outstanding', label: 'Most outstanding actions' },
  { key: 'start_date', label: 'Start date' },
];

const FILTER_STATUS: Partial<Record<QueueFilter, CaseStatus[]>> = {
  awaiting_candidate: ['candidate_info_required'],
  awaiting_reference: ['awaiting_reference'],
  verification_required: ['verification_required'],
  discrepancies: ['discrepancy'],
  ready: ['ready_for_review'],
  completed: ['completed'],
};

export function isTerminal(status: CaseStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function applyQueue(
  cases: ScreeningCase[],
  opts: { filter: QueueFilter; q: string; sort: QueueSort; userId: string | null },
): ScreeningCase[] {
  let out = cases;
  if (opts.filter === 'active') out = out.filter((c) => !isTerminal(c.status));
  else if (opts.filter === 'mine') out = out.filter((c) => c.assigned_to === opts.userId && !isTerminal(c.status));
  else if (opts.filter !== 'all') {
    const allowed = FILTER_STATUS[opts.filter] ?? [];
    out = out.filter((c) => allowed.includes(c.status));
  }

  const q = opts.q.trim().toLowerCase();
  if (q) {
    out = out.filter((c) => {
      const cand = c.candidate;
      return [c.reference, cand?.legal_name, cand?.email, cand?.sia_licence_number]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }

  const sorted = [...out];
  switch (opts.sort) {
    case 'newest':
      sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
    case 'least_complete':
      sorted.sort((a, b) => a.progress_percent - b.progress_percent || a.created_at.localeCompare(b.created_at));
      break;
    case 'most_outstanding':
      sorted.sort((a, b) => b.outstanding_count - a.outstanding_count || a.created_at.localeCompare(b.created_at));
      break;
    case 'start_date':
      sorted.sort((a, b) => (a.proposed_start_date ?? '9999').localeCompare(b.proposed_start_date ?? '9999'));
      break;
    case 'oldest':
    default:
      sorted.sort((a, b) => a.created_at.localeCompare(b.created_at));
  }
  return sorted;
}

export interface QueueKpis {
  active: number;
  awaitingCandidate: number;
  awaitingReferences: number;
  verificationRequired: number;
  discrepancies: number;
  readyForReview: number;
  completed: number;
}

export function kpisFor(cases: ScreeningCase[]): QueueKpis {
  const count = (s: CaseStatus) => cases.filter((c) => c.status === s).length;
  return {
    active: cases.filter((c) => !isTerminal(c.status)).length,
    awaitingCandidate: count('candidate_info_required'),
    awaitingReferences: count('awaiting_reference'),
    verificationRequired: count('verification_required'),
    discrepancies: count('discrepancy'),
    readyForReview: count('ready_for_review'),
    completed: count('completed'),
  };
}
