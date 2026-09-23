'use server';

// ─────────────────────────────────────────────────────────────
// Vetting & Screening server actions.
//
// Every action: checks the caller's capability server-side, validates with
// Zod, refuses to touch a locked (completed / withdrawn / rejected) case,
// writes an audit event, then re-syncs the case summary. Sensitive values are
// never logged; audit states are masked in lib/screening/audit.ts.
// ─────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Capability } from '@/lib/permissions';
import { can, getScreeningActor, type ScreeningActor } from '@/lib/screening/access';
import { recordAudit } from '@/lib/screening/audit';
import {
  DEFAULT_CHECKS,
  EVIDENCE_ALLOWED_MIME,
  EVIDENCE_BUCKET,
  EVIDENCE_MAX_BYTES,
  SCREENING_POLICY,
} from '@/lib/screening/config';
import { isScreeningConfigured, screeningDb } from '@/lib/screening/db';
import { diffRecords } from '@/lib/screening/masking';
import { getBooking, getCase, getCaseFile, type Db } from '@/lib/screening/queries';
import { syncCase } from '@/lib/screening/sync';
import {
  ACTIVITY_CATEGORY_LABELS,
  CHECK_STATUS_META,
  IDENTITY_STATUS_META,
  ISSUE_SEVERITY_META,
  ISSUE_STATUS_META,
  ISSUE_TYPE_LABELS,
  REFERENCE_STATUS_META,
  REVIEW_DECISION_META,
  RTW_STATUS_META,
  SIA_STATUS_META,
  STAGES,
  UNRESOLVED_ISSUE_STATUSES,
  VERIFICATION_STATUS_META,
  type ScreeningCase,
  type Stage,
} from '@/lib/screening/types';
import { fieldErrors } from '@/lib/validation';

export interface ScreeningFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string>;
}

// ── Helpers ──────────────────────────────────────────────────

function err(message: string, errors?: Record<string, string>): ScreeningFormState {
  return { status: 'error', message, errors };
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v : '';
}

function pick(fd: FormData, keys: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) out[k] = str(fd, k);
  return out;
}

const today = () => new Date().toISOString().slice(0, 10);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date');
const optionalDate = z
  .union([isoDate, z.literal('')])
  .transform((v) => (v ? v : null));
const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer`)
    .transform((v) => (v ? v : null));
const requiredText = (message: string, max = 200) => z.string().trim().min(1, message).max(max);
const optionalUuid = z.union([z.string().uuid(), z.literal('')]).transform((v) => (v ? v : null));
const checkbox = z.string().transform((v) => v === 'on' || v === 'true' || v === '1');
const optionalEmail = z
  .union([z.string().trim().email('Enter a valid email address'), z.literal('')])
  .transform((v) => (v ? v : null));
const enumOf = (keys: string[]) => z.enum(keys as [string, ...string[]]);
const STAGE_KEYS = STAGES.map((s) => s.key);

type Guard =
  | { ok: true; actor: ScreeningActor; db: Db }
  | { ok: false; state: ScreeningFormState };

async function guard(cap: Capability): Promise<Guard> {
  if (!isScreeningConfigured()) {
    return { ok: false, state: err('Connect Supabase (service role key) to use Vetting & Screening.') };
  }
  const actor = await getScreeningActor();
  if (!can(actor, cap)) return { ok: false, state: err('You are not authorised to do that.') };
  return { ok: true, actor, db: screeningDb() };
}

type CaseGuard = { ok: true; screening: ScreeningCase } | { ok: false; state: ScreeningFormState };

async function guardCase(db: Db, caseId: string, allowLocked = false): Promise<CaseGuard> {
  if (!z.string().uuid().safeParse(caseId).success) return { ok: false, state: err('Missing screening case.') };
  const screening = await getCase(db, caseId);
  if (!screening) return { ok: false, state: err('That screening case could not be found.') };
  if (screening.locked && !allowLocked) {
    return { ok: false, state: err('This screening is complete and locked. Reopen it to make changes.') };
  }
  return { ok: true, screening };
}

function revalidateCase(caseId: string) {
  revalidatePath('/admin/vetting');
  revalidatePath(`/admin/vetting/${caseId}`, 'layout');
}

function audit(actor: ScreeningActor) {
  return { actorId: actor.id, actorEmail: actor.email };
}

async function finishTo(db: Db, actor: ScreeningActor, caseId: string, path: string, flag = 'saved'): Promise<never> {
  await syncCase(db, caseId, { id: actor.id, email: actor.email });
  revalidateCase(caseId);
  redirect(`/admin/vetting/${caseId}/${path}?${flag}=1`);
}

async function finish(db: Db, actor: ScreeningActor, caseId: string, stage: Stage, flag = 'saved'): Promise<never> {
  return finishTo(db, actor, caseId, STAGES.find((s) => s.key === stage)?.path ?? 'personal', flag);
}

function fail(prefix: string, error: { message: string } | null) {
  if (error) console.error(`[screening] ${prefix}:`, error.message);
}

// ── 2. Start new screening ───────────────────────────────────

const createSchema = z.object({
  legal_name: requiredText('Enter the candidate’s full legal name'),
  previous_names: optionalText(300),
  date_of_birth: optionalDate,
  email: optionalEmail,
  telephone: optionalText(40),
  proposed_role: requiredText('Enter the proposed role', 120),
  sia_licence_type: optionalText(80),
  sia_licence_number: optionalText(40),
  proposed_start_date: optionalDate,
  screening_start_date: optionalDate,
  assigned_to: optionalUuid,
  linked_booking_id: optionalUuid,
});

export async function createScreeningAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = createSchema.safeParse(pick(formData, Object.keys(createSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const v = parsed.data;

  if (v.linked_booking_id && !(await getBooking(db, v.linked_booking_id))) {
    return err('The linked booking could not be found.', { linked_booking_id: 'Unknown booking' });
  }

  const { data: candidate, error: candErr } = await db
    .from('screening_candidates')
    .insert({
      legal_name: v.legal_name,
      previous_names: v.previous_names,
      date_of_birth: v.date_of_birth,
      email: v.email,
      telephone: v.telephone,
      sia_licence_number: v.sia_licence_number,
      linked_booking_id: v.linked_booking_id,
      source: 'admin',
      created_by: actor.id,
      updated_by: actor.id,
    })
    .select('id')
    .single();
  if (candErr || !candidate) {
    fail('createCandidate failed', candErr);
    return err('Could not create the candidate record. Please try again.');
  }

  const { data: screening, error: caseErr } = await db
    .from('screening_cases')
    .insert({
      candidate_id: candidate.id,
      workflow: 'bs7858',
      status: 'not_started',
      proposed_role: v.proposed_role,
      sia_licence_type: v.sia_licence_type,
      proposed_start_date: v.proposed_start_date,
      screening_start_date: v.screening_start_date ?? today(),
      assigned_to: v.assigned_to,
      screening_period_years: SCREENING_POLICY.screeningPeriodYears,
      created_by: actor.id,
      updated_by: actor.id,
    })
    .select('id, reference')
    .single();
  if (caseErr || !screening) {
    fail('createCase failed', caseErr);
    await db.from('screening_candidates').delete().eq('id', candidate.id);
    return err('Could not create the screening case. Please try again.');
  }

  // Seed the configurable check list.
  const checks = DEFAULT_CHECKS.map((c, i) => ({
    case_id: screening.id,
    check_key: c.key,
    label: c.label,
    required: c.key === 'sia_licence' ? Boolean(v.sia_licence_type) : c.required,
    status: c.key === 'sia_licence' && !v.sia_licence_type ? 'not_required' : 'pending',
    sort_order: i,
    created_by: actor.id,
    updated_by: actor.id,
  }));
  const { error: checksErr } = await db.from('screening_checks').insert(checks);
  fail('seedChecks failed', checksErr);

  if (v.sia_licence_number || v.sia_licence_type) {
    const { error: siaErr } = await db.from('screening_sia_checks').insert({
      case_id: screening.id,
      licence_number: v.sia_licence_number,
      licence_holder: v.legal_name,
      licence_type: v.sia_licence_type,
      status: 'awaiting_check',
      created_by: actor.id,
      updated_by: actor.id,
    });
    fail('seedSia failed', siaErr);
  }

  await recordAudit(db, {
    caseId: screening.id,
    ...audit(actor),
    action: 'screening_created',
    section: 'personal',
    recordType: 'case',
    recordId: screening.id,
    next: { reference: screening.reference, proposed_role: v.proposed_role, linked_booking_id: v.linked_booking_id },
  });

  await syncCase(db, screening.id, { id: actor.id, email: actor.email });
  revalidateCase(screening.id);
  redirect(`/admin/vetting/${screening.id}?created=1`);
}

// ── 4. Personal details ──────────────────────────────────────

const candidateSchema = z.object({
  case_id: z.string().uuid(),
  legal_name: requiredText('Enter the candidate’s full legal name'),
  previous_names: optionalText(300),
  date_of_birth: optionalDate,
  nationality: optionalText(80),
  email: optionalEmail,
  telephone: optionalText(40),
  ni_number: optionalText(20),
  address_line_1: optionalText(200),
  address_line_2: optionalText(200),
  town: optionalText(120),
  postcode: optionalText(20),
  country: optionalText(80),
  sia_licence_number: optionalText(40),
  proposed_role: requiredText('Enter the proposed role', 120),
  sia_licence_type: optionalText(80),
  proposed_start_date: optionalDate,
});

export async function updateCandidateAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = candidateSchema.safeParse(pick(formData, Object.keys(candidateSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, proposed_role, sia_licence_type, proposed_start_date, ...candidateFields } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;
  const previous = c.screening.candidate as unknown as Record<string, unknown>;

  const { error: candErr } = await db
    .from('screening_candidates')
    .update({ ...candidateFields, updated_by: actor.id })
    .eq('id', c.screening.candidate_id);
  if (candErr) {
    fail('updateCandidate failed', candErr);
    return err('Could not save the candidate details. Please try again.');
  }
  const { error: caseErr } = await db
    .from('screening_cases')
    .update({ proposed_role, sia_licence_type, proposed_start_date, updated_by: actor.id })
    .eq('id', case_id);
  fail('updateCaseFields failed', caseErr);

  // Keep the SIA check in step with the role's licence type.
  if (sia_licence_type) {
    const { error: siaErr } = await db
      .from('screening_sia_checks')
      .upsert(
        {
          case_id,
          licence_type: sia_licence_type,
          licence_holder: candidateFields.legal_name,
          // Only overwrite the licence number when one has been entered here.
          ...(candidateFields.sia_licence_number ? { licence_number: candidateFields.sia_licence_number } : {}),
          updated_by: actor.id,
        },
        { onConflict: 'case_id' },
      );
    fail('upsertSia failed', siaErr);
    await db
      .from('screening_checks')
      .update({ required: true, status: 'pending' })
      .eq('case_id', case_id)
      .eq('check_key', 'sia_licence')
      .eq('status', 'not_required');
  }

  const diff = diffRecords(previous, {
    ...candidateFields,
    proposed_role,
    sia_licence_type,
    proposed_start_date,
  });
  await recordAudit(db, {
    caseId: case_id,
    ...audit(actor),
    action: 'candidate_details_updated',
    section: 'personal',
    recordType: 'candidate',
    recordId: c.screening.candidate_id,
    previous: diff.previous,
    next: diff.next,
  });

  return finish(db, actor, case_id, 'personal');
}

/** Assign / reassign a case (auto-submit select). */
export async function assignCaseAction(formData: FormData): Promise<void> {
  const g = await guard('screening.manage');
  if (!g.ok) return;
  const { actor, db } = g;
  const caseId = str(formData, 'case_id');
  const assignee = optionalUuid.safeParse(str(formData, 'assigned_to'));
  if (!assignee.success) return;
  const c = await guardCase(db, caseId);
  if (!c.ok) return;

  const { error } = await db
    .from('screening_cases')
    .update({ assigned_to: assignee.data, updated_by: actor.id })
    .eq('id', caseId);
  fail('assignCase failed', error);
  await recordAudit(db, {
    caseId,
    ...audit(actor),
    action: 'case_assigned',
    recordType: 'case',
    recordId: caseId,
    previous: { assigned_to: c.screening.assigned_to },
    next: { assigned_to: assignee.data },
  });
  await syncCase(db, caseId, { id: actor.id, email: actor.email });
  revalidateCase(caseId);
}

// ── 7. Address history ───────────────────────────────────────

const addressSchema = z.object({
  case_id: z.string().uuid(),
  id: optionalUuid,
  address_line_1: requiredText('Enter the first line of the address'),
  address_line_2: optionalText(200),
  town: optionalText(120),
  postcode: optionalText(20),
  country: optionalText(80),
  from_date: isoDate,
  to_date: optionalDate,
  is_current: checkbox,
  verification_status: enumOf(Object.keys(VERIFICATION_STATUS_META)),
  verification_method: optionalText(200),
  verified_at: optionalDate,
  notes: optionalText(2000),
});

export async function saveAddressAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = addressSchema.safeParse(pick(formData, Object.keys(addressSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;
  if (!v.is_current && v.to_date && v.to_date < v.from_date) {
    return err('Please check the dates.', { to_date: 'The end date cannot be before the start date' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const verified = v.verification_status === 'verified';
  const row = {
    ...v,
    to_date: v.is_current ? null : v.to_date,
    verified_by: verified ? actor.id : null,
    verified_at: verified ? (v.verified_at ?? today()) : v.verified_at,
    updated_by: actor.id,
  };

  if (id) {
    const { data: prev } = await db.from('screening_addresses').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
    if (!prev) return err('That address could not be found.');
    const { error } = await db.from('screening_addresses').update(row).eq('id', id);
    if (error) {
      fail('updateAddress failed', error);
      return err('Could not save the address. Please try again.');
    }
    const diff = diffRecords(prev, row);
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'address_updated', section: 'addresses', recordType: 'address', recordId: id, previous: diff.previous, next: diff.next });
  } else {
    const { data, error } = await db
      .from('screening_addresses')
      .insert({ ...row, case_id, source: 'admin', created_by: actor.id })
      .select('id')
      .single();
    if (error || !data) {
      fail('insertAddress failed', error);
      return err('Could not add the address. Please try again.');
    }
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'address_added', section: 'addresses', recordType: 'address', recordId: data.id, next: row });
  }
  return finish(db, actor, case_id, 'addresses');
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  await deleteRecord(formData, 'screening_addresses', 'address', 'address_removed', 'addresses');
}

// ── 8. Employment / activity history ─────────────────────────

const activitySchema = z.object({
  case_id: z.string().uuid(),
  id: optionalUuid,
  category: enumOf(Object.keys(ACTIVITY_CATEGORY_LABELS)),
  organisation: requiredText('Enter the organisation or activity'),
  position: optionalText(120),
  address: optionalText(300),
  contact_name: optionalText(120),
  contact_email: optionalEmail,
  contact_telephone: optionalText(40),
  from_date: isoDate,
  to_date: optionalDate,
  reason_for_leaving: optionalText(500),
  requires_reference: checkbox,
  verification_status: enumOf(Object.keys(VERIFICATION_STATUS_META)),
  verification_method: optionalText(200),
  verified_at: optionalDate,
  notes: optionalText(2000),
});

export async function saveActivityAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = activitySchema.safeParse(pick(formData, Object.keys(activitySchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;
  if (v.to_date && v.to_date < v.from_date) {
    return err('Please check the dates.', { to_date: 'The end date cannot be before the start date' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const verified = v.verification_status === 'verified';
  const row = {
    ...v,
    verified_by: verified ? actor.id : null,
    verified_at: verified ? (v.verified_at ?? today()) : v.verified_at,
    updated_by: actor.id,
  };

  if (id) {
    const { data: prev } = await db.from('screening_activities').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
    if (!prev) return err('That activity could not be found.');
    const { error } = await db.from('screening_activities').update(row).eq('id', id);
    if (error) {
      fail('updateActivity failed', error);
      return err('Could not save the activity. Please try again.');
    }
    const diff = diffRecords(prev, row);
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'activity_updated', section: 'activity', recordType: 'activity', recordId: id, previous: diff.previous, next: diff.next });
  } else {
    const { data, error } = await db
      .from('screening_activities')
      .insert({ ...row, case_id, source: 'admin', created_by: actor.id })
      .select('id')
      .single();
    if (error || !data) {
      fail('insertActivity failed', error);
      return err('Could not add the activity. Please try again.');
    }
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'activity_added', section: 'activity', recordType: 'activity', recordId: data.id, next: row });
  }
  return finish(db, actor, case_id, 'activity');
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  await deleteRecord(formData, 'screening_activities', 'activity', 'activity_removed', 'activity');
}

// ── 10. References & verification ────────────────────────────

const referenceSchema = z.object({
  case_id: z.string().uuid(),
  id: optionalUuid,
  activity_id: optionalUuid,
  organisation: requiredText('Enter the organisation'),
  contact_name: optionalText(120),
  contact_position: optionalText(120),
  email: optionalEmail,
  telephone: optionalText(40),
  status: enumOf(Object.keys(REFERENCE_STATUS_META)),
  requested_at: optionalDate,
  received_at: optionalDate,
  method: optionalText(120),
  source_verified: checkbox,
  source_verification_method: optionalText(200),
  verified_at: optionalDate,
  notes: optionalText(2000),
});

export async function saveReferenceAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = referenceSchema.safeParse(pick(formData, Object.keys(referenceSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const requested = ['requested', 'awaiting_response', 'received', 'source_verification_required', 'verified'].includes(v.status);
  const received = ['received', 'source_verification_required', 'verified'].includes(v.status);
  const verified = v.status === 'verified';
  const row = {
    ...v,
    requested_at: requested ? (v.requested_at ?? today()) : v.requested_at,
    received_at: received ? (v.received_at ?? today()) : v.received_at,
    verified_by: verified ? actor.id : null,
    verified_at: verified ? (v.verified_at ?? today()) : v.verified_at,
    updated_by: actor.id,
  };

  let recordId = id;
  let previousStatus: string | null = null;
  if (id) {
    const { data: prev } = await db.from('screening_references').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
    if (!prev) return err('That reference could not be found.');
    previousStatus = prev.status;
    const { error } = await db.from('screening_references').update(row).eq('id', id);
    if (error) {
      fail('updateReference failed', error);
      return err('Could not save the reference. Please try again.');
    }
    const diff = diffRecords(prev, row);
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'reference_updated', section: 'references', recordType: 'reference', recordId: id, previous: diff.previous, next: diff.next });
  } else {
    const { data, error } = await db
      .from('screening_references')
      .insert({ ...row, case_id, source: 'admin', created_by: actor.id })
      .select('id')
      .single();
    if (error || !data) {
      fail('insertReference failed', error);
      return err('Could not add the reference. Please try again.');
    }
    recordId = data.id;
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'reference_added', section: 'references', recordType: 'reference', recordId: data.id, next: row });
  }

  // Milestone events make the audit trail readable at a glance.
  const milestone =
    v.status === 'requested' && previousStatus !== 'requested'
      ? 'verification_requested'
      : received && !['received', 'source_verification_required', 'verified'].includes(previousStatus ?? '')
        ? 'reference_received'
        : verified && previousStatus !== 'verified'
          ? 'reference_verified'
          : null;
  if (milestone) {
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: milestone, section: 'references', recordType: 'reference', recordId, next: { organisation: v.organisation, status: v.status } });
  }
  return finish(db, actor, case_id, 'references');
}

/** "Request reference" quick action — records the request (email automation later). */
export async function requestReferenceAction(formData: FormData): Promise<void> {
  const g = await guard('screening.manage');
  if (!g.ok) return;
  const { actor, db } = g;
  const caseId = str(formData, 'case_id');
  const id = str(formData, 'id');
  const c = await guardCase(db, caseId);
  if (!c.ok || !z.string().uuid().safeParse(id).success) return;

  const { data: prev } = await db.from('screening_references').select('*').eq('id', id).eq('case_id', caseId).maybeSingle();
  if (!prev || prev.status !== 'not_requested') return;
  const { error } = await db
    .from('screening_references')
    .update({ status: 'requested', requested_at: today(), updated_by: actor.id })
    .eq('id', id);
  fail('requestReference failed', error);
  await recordAudit(db, { caseId, ...audit(actor), action: 'verification_requested', section: 'references', recordType: 'reference', recordId: id, next: { organisation: prev.organisation, status: 'requested' }, notes: 'Reference request recorded (manual). Automated email requests are a planned enhancement.' });
  await syncCase(db, caseId, { id: actor.id, email: actor.email });
  revalidateCase(caseId);
}

export async function deleteReferenceAction(formData: FormData): Promise<void> {
  await deleteRecord(formData, 'screening_references', 'reference', 'reference_removed', 'references');
}

// ── 5. Identity documents ────────────────────────────────────

const identitySchema = z.object({
  case_id: z.string().uuid(),
  id: optionalUuid,
  document_type: requiredText('Choose the document type', 80),
  document_number: optionalText(60),
  issue_date: optionalDate,
  expiry_date: optionalDate,
  issuing_country: optionalText(80),
  status: enumOf(Object.keys(IDENTITY_STATUS_META)),
  verification_method: optionalText(200),
  checked_at: optionalDate,
  notes: optionalText(2000),
});

export async function saveIdentityDocumentAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = identitySchema.safeParse(pick(formData, Object.keys(identitySchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const checked = v.status === 'verified' || v.status === 'failed';
  const row = {
    ...v,
    checked_by: checked ? actor.id : null,
    checked_at: checked ? (v.checked_at ?? today()) : v.checked_at,
    updated_by: actor.id,
  };

  if (id) {
    const { data: prev } = await db.from('screening_identity_documents').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
    if (!prev) return err('That document could not be found.');
    const { error } = await db.from('screening_identity_documents').update(row).eq('id', id);
    if (error) {
      fail('updateIdentityDocument failed', error);
      return err('Could not save the document. Please try again.');
    }
    const diff = diffRecords(prev, row);
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'identity_document_updated', section: 'identity', recordType: 'identity_document', recordId: id, previous: diff.previous, next: diff.next });
  } else {
    const { data, error } = await db
      .from('screening_identity_documents')
      .insert({ ...row, case_id, source: 'admin', created_by: actor.id })
      .select('id')
      .single();
    if (error || !data) {
      fail('insertIdentityDocument failed', error);
      return err('Could not add the document. Please try again.');
    }
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'identity_document_added', section: 'identity', recordType: 'identity_document', recordId: data.id, next: row });
  }
  return finish(db, actor, case_id, 'identity');
}

export async function deleteIdentityDocumentAction(formData: FormData): Promise<void> {
  await deleteRecord(formData, 'screening_identity_documents', 'identity_document', 'identity_document_removed', 'identity');
}

// ── 6. Right to Work ─────────────────────────────────────────

const rtwSchema = z.object({
  case_id: z.string().uuid(),
  check_type: optionalText(120),
  status: enumOf(Object.keys(RTW_STATUS_META)),
  checked_at: optionalDate,
  expiry_date: optionalDate,
  share_code: optionalText(40),
  restrictions: optionalText(500),
  notes: optionalText(2000),
});

export async function saveRightToWorkAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = rtwSchema.safeParse(pick(formData, Object.keys(rtwSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, ...v } = parsed.data;
  if (v.status === 'time_limited' && !v.expiry_date) {
    return err('Please check the highlighted fields.', { expiry_date: 'Enter when the time-limited permission expires' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const { data: prev } = await db.from('screening_right_to_work').select('*').eq('case_id', case_id).maybeSingle();
  const checked = v.status !== 'outstanding' || Boolean(v.checked_at);
  const row = {
    case_id,
    ...v,
    checked_by: checked ? actor.id : null,
    checked_at: checked ? (v.checked_at ?? today()) : null,
    updated_by: actor.id,
    ...(prev ? {} : { created_by: actor.id, source: 'admin' }),
  };
  const { data, error } = await db
    .from('screening_right_to_work')
    .upsert(row, { onConflict: 'case_id' })
    .select('id')
    .single();
  if (error || !data) {
    fail('saveRightToWork failed', error);
    return err('Could not save the Right to Work check. Please try again.');
  }
  const diff = diffRecords(prev ?? null, row);
  await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'right_to_work_updated', section: 'right_to_work', recordType: 'right_to_work', recordId: data.id, previous: diff.previous, next: diff.next });
  return finish(db, actor, case_id, 'right_to_work');
}

// ── 11. SIA licence check ────────────────────────────────────

const siaSchema = z.object({
  case_id: z.string().uuid(),
  licence_number: optionalText(40),
  licence_holder: optionalText(160),
  licence_type: optionalText(80),
  status: enumOf(Object.keys(SIA_STATUS_META)),
  issue_date: optionalDate,
  expiry_date: optionalDate,
  checked_at: optionalDate,
  check_method: optionalText(120),
  result_notes: optionalText(2000),
});

export async function saveSiaCheckAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = siaSchema.safeParse(pick(formData, Object.keys(siaSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, ...v } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const { data: prev } = await db.from('screening_sia_checks').select('*').eq('case_id', case_id).maybeSingle();
  const checked = v.status !== 'awaiting_check' || Boolean(v.checked_at);
  const row = {
    case_id,
    ...v,
    checked_by: checked ? actor.id : null,
    checked_at: checked ? (v.checked_at ?? today()) : null,
    updated_by: actor.id,
    ...(prev ? {} : { created_by: actor.id, source: 'admin' }),
  };
  const { data, error } = await db.from('screening_sia_checks').upsert(row, { onConflict: 'case_id' }).select('id').single();
  if (error || !data) {
    fail('saveSiaCheck failed', error);
    return err('Could not save the SIA check. Please try again.');
  }
  if (v.licence_number) {
    await db.from('screening_candidates').update({ sia_licence_number: v.licence_number, updated_by: actor.id }).eq('id', c.screening.candidate_id);
  }
  if (v.licence_type && v.licence_type !== c.screening.sia_licence_type) {
    await db.from('screening_cases').update({ sia_licence_type: v.licence_type, updated_by: actor.id }).eq('id', case_id);
  }
  const diff = diffRecords(prev ?? null, row);
  await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'sia_check_updated', section: 'sia', recordType: 'sia_check', recordId: data.id, previous: diff.previous, next: diff.next });
  return finish(db, actor, case_id, 'sia');
}

// ── 12. Additional checks ────────────────────────────────────

const checkSchema = z.object({
  case_id: z.string().uuid(),
  id: z.string().uuid(),
  required: checkbox,
  status: enumOf(Object.keys(CHECK_STATUS_META)),
  checked_at: optionalDate,
  notes: optionalText(2000),
});

export async function saveCheckAction(
  _prev: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = checkSchema.safeParse(pick(formData, Object.keys(checkSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const { data: prev } = await db.from('screening_checks').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
  if (!prev) return err('That check could not be found.');
  const done = v.status === 'complete' || v.status === 'verified' || v.status === 'failed';
  const row = {
    required: v.status === 'not_required' ? false : v.required,
    status: v.status,
    notes: v.notes,
    checked_by: done ? actor.id : null,
    checked_at: done ? (v.checked_at ?? today()) : null,
    updated_by: actor.id,
  };
  const { error } = await db.from('screening_checks').update(row).eq('id', id);
  if (error) {
    fail('saveCheck failed', error);
    return err('Could not save the check. Please try again.');
  }
  const diff = diffRecords(prev, row);
  const completedNow = (v.status === 'complete' || v.status === 'verified') && prev.status !== v.status;
  await recordAudit(db, { caseId: case_id, ...audit(actor), action: completedNow ? 'check_completed' : 'check_updated', section: 'checks', recordType: 'check', recordId: id, previous: diff.previous, next: { label: prev.label, ...diff.next } });
  return finish(db, actor, case_id, 'checks');
}

const newCheckSchema = z.object({
  case_id: z.string().uuid(),
  label: requiredText('Enter a name for the check', 120),
  required: checkbox,
});

export async function addCheckAction(_prev: ScreeningFormState, formData: FormData): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = newCheckSchema.safeParse(pick(formData, Object.keys(newCheckSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, label, required } = parsed.data;

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const key = `custom_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}_${randomUUID().slice(0, 6)}`;
  const { data, error } = await db
    .from('screening_checks')
    .insert({ case_id, check_key: key, label, required, status: required ? 'pending' : 'not_required', sort_order: 100, created_by: actor.id, updated_by: actor.id })
    .select('id')
    .single();
  if (error || !data) {
    fail('addCheck failed', error);
    return err('Could not add the check. Please try again.');
  }
  await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'check_added', section: 'checks', recordType: 'check', recordId: data.id, next: { label, required } });
  return finish(db, actor, case_id, 'checks');
}

// ── 13. Issues & discrepancies ───────────────────────────────

const issueSchema = z.object({
  case_id: z.string().uuid(),
  id: optionalUuid,
  issue_type: enumOf(Object.keys(ISSUE_TYPE_LABELS)),
  title: requiredText('Enter a short title', 160),
  description: optionalText(3000),
  severity: enumOf(Object.keys(ISSUE_SEVERITY_META)),
  status: enumOf(Object.keys(ISSUE_STATUS_META)),
  section: z.union([enumOf(STAGE_KEYS), z.literal('')]).transform((v) => (v ? (v as Stage) : null)),
  assigned_to: optionalUuid,
  candidate_explanation: optionalText(3000),
  resolution: optionalText(3000),
});

export async function saveIssueAction(_prev: ScreeningFormState, formData: FormData): Promise<ScreeningFormState> {
  const g = await guard('screening.manage');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = issueSchema.safeParse(pick(formData, Object.keys(issueSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, id, ...v } = parsed.data;
  const closing = v.status === 'resolved' || v.status === 'accepted_risk';
  if (closing && !v.resolution) {
    return err('Please record how the issue was resolved.', { resolution: 'A resolution is required to close an issue' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  if (id) {
    const { data: prev } = await db.from('screening_issues').select('*').eq('id', id).eq('case_id', case_id).maybeSingle();
    if (!prev) return err('That issue could not be found.');
    const wasOpen = UNRESOLVED_ISSUE_STATUSES.includes(prev.status);
    const row = {
      ...v,
      resolved_at: closing ? (prev.resolved_at ?? new Date().toISOString()) : null,
      resolved_by: closing ? (prev.resolved_by ?? actor.id) : null,
      updated_by: actor.id,
    };
    const { error } = await db.from('screening_issues').update(row).eq('id', id);
    if (error) {
      fail('updateIssue failed', error);
      return err('Could not save the issue. Please try again.');
    }
    const diff = diffRecords(prev, row);
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: closing && wasOpen ? 'issue_resolved' : 'issue_updated', section: v.section ?? prev.section, recordType: 'issue', recordId: id, previous: diff.previous, next: { title: v.title, ...diff.next } });
  } else {
    const { data, error } = await db
      .from('screening_issues')
      .insert({
        ...v,
        case_id,
        raised_by: actor.id,
        source: 'admin',
        resolved_at: closing ? new Date().toISOString() : null,
        resolved_by: closing ? actor.id : null,
        created_by: actor.id,
        updated_by: actor.id,
      })
      .select('id')
      .single();
    if (error || !data) {
      fail('insertIssue failed', error);
      return err('Could not raise the issue. Please try again.');
    }
    await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'issue_raised', section: v.section, recordType: 'issue', recordId: data.id, next: { title: v.title, issue_type: v.issue_type, severity: v.severity, status: v.status } });
  }
  return finish(db, actor, case_id, 'issues');
}

// ── 14. Evidence vault ───────────────────────────────────────

const evidenceSchema = z.object({
  case_id: z.string().uuid(),
  category: requiredText('Choose a category', 80),
  section: z.union([enumOf(STAGE_KEYS), z.literal('')]).transform((v) => (v ? (v as Stage) : null)),
  related_record_type: optionalText(40),
  related_record_id: optionalUuid,
  description: optionalText(1000),
});

export async function uploadEvidenceAction(_prev: ScreeningFormState, formData: FormData): Promise<ScreeningFormState> {
  const g = await guard('screening.evidence');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  // The form offers one "relates to" select encoded as "<type>:<uuid>".
  const related = str(formData, 'related').split(':');
  const raw = {
    ...pick(formData, Object.keys(evidenceSchema.shape)),
    related_record_type: related.length === 2 ? related[0] : '',
    related_record_id: related.length === 2 ? related[1] : '',
  };
  const parsed = evidenceSchema.safeParse(raw);
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, ...v } = parsed.data;

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return err('Choose a file to upload.', { file: 'Choose a file' });
  if (file.size > EVIDENCE_MAX_BYTES) return err('That file is too large.', { file: `Files must be ${Math.round(EVIDENCE_MAX_BYTES / 1024 / 1024)} MB or smaller` });
  if (!EVIDENCE_ALLOWED_MIME.includes(file.type)) {
    return err('That file type is not accepted.', { file: 'Upload a PDF, JPEG, PNG, WebP, HEIC or Word document' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;

  const ext = (file.name.split('.').pop() ?? '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const storagePath = `${case_id}/${randomUUID()}${ext ? `.${ext}` : ''}`;
  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await db.storage
    .from(EVIDENCE_BUCKET)
    .upload(storagePath, bytes, { contentType: file.type, upsert: false });
  if (uploadError) {
    fail('evidenceUpload failed', uploadError);
    return err('The file could not be stored. Please try again.');
  }

  const { data, error } = await db
    .from('screening_evidence')
    .insert({
      case_id,
      ...v,
      file_name: file.name.slice(0, 200),
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: actor.id,
    })
    .select('id')
    .single();
  if (error || !data) {
    fail('evidenceInsert failed', error);
    await db.storage.from(EVIDENCE_BUCKET).remove([storagePath]);
    return err('The file was stored but could not be recorded. Please try again.');
  }

  await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'evidence_uploaded', section: v.section, recordType: 'evidence', recordId: data.id, next: { category: v.category, file_name: file.name.slice(0, 200), size_bytes: file.size } });
  return finishTo(db, actor, case_id, 'evidence', 'uploaded');
}

export async function deleteEvidenceAction(formData: FormData): Promise<void> {
  const g = await guard('screening.evidence');
  if (!g.ok) return;
  const { actor, db } = g;
  const caseId = str(formData, 'case_id');
  const id = str(formData, 'id');
  const c = await guardCase(db, caseId);
  if (!c.ok || !z.string().uuid().safeParse(id).success) return;

  const { data: ev } = await db.from('screening_evidence').select('*').eq('id', id).eq('case_id', caseId).maybeSingle();
  if (!ev) return;
  const { error: rmErr } = await db.storage.from(EVIDENCE_BUCKET).remove([ev.storage_path]);
  fail('evidenceRemove failed', rmErr);
  const { error } = await db.from('screening_evidence').delete().eq('id', id);
  fail('evidenceDelete failed', error);
  await recordAudit(db, { caseId, ...audit(actor), action: 'evidence_removed', section: ev.section, recordType: 'evidence', recordId: id, previous: { category: ev.category, file_name: ev.file_name } });
  await syncCase(db, caseId, { id: actor.id, email: actor.email });
  revalidateCase(caseId);
}

// ── 19/20. Final review, completion, reopen ──────────────────

const reviewSchema = z.object({
  case_id: z.string().uuid(),
  decision: enumOf(Object.keys(REVIEW_DECISION_META)),
  comments: z.string().trim().min(5, 'Please record your review comments').max(4000),
  acknowledged: checkbox,
});

export async function recordReviewAction(_prev: ScreeningFormState, formData: FormData): Promise<ScreeningFormState> {
  const g = await guard('screening.review');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = reviewSchema.safeParse(pick(formData, Object.keys(reviewSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, decision, comments, acknowledged } = parsed.data;
  if (!acknowledged) {
    return err('Please confirm the acknowledgement before recording a decision.', { acknowledged: 'Confirmation is required' });
  }

  const c = await guardCase(db, case_id);
  if (!c.ok) return c.state;
  const file = await getCaseFile(db, case_id);
  if (!file) return err('That screening case could not be found.');

  const unresolved = file.issues.filter((i) => UNRESOLVED_ISSUE_STATUSES.includes(i.status));
  if (decision === 'complete' && unresolved.length) {
    return err(`${unresolved.length} issue${unresolved.length === 1 ? '' : 's'} must be resolved or accepted before the screening can be completed.`, { decision: 'Unresolved issues remain' });
  }

  const { data: review, error: reviewErr } = await db
    .from('screening_reviews')
    .insert({ case_id, reviewer_id: actor.id, reviewer_email: actor.email, decision, comments, acknowledged })
    .select('id')
    .single();
  if (reviewErr || !review) {
    fail('insertReview failed', reviewErr);
    return err('Could not record the review. Please try again.');
  }

  const now = new Date().toISOString();
  const base = { decision, decision_at: now, reviewed_by: actor.id, updated_by: actor.id };
  let action = 'review_recorded';

  if (decision === 'complete') {
    await db.from('screening_cases').update({ ...base, status: 'completed', locked: true, completed_at: now }).eq('id', case_id);
    action = 'screening_completed';
  } else if (decision === 'withdrawn') {
    await db.from('screening_cases').update({ ...base, status: 'withdrawn', locked: true, withdrawn_reason: comments }).eq('id', case_id);
    action = 'screening_withdrawn';
  } else if (decision === 'reject') {
    await db.from('screening_cases').update({ ...base, status: 'rejected', locked: true }).eq('id', case_id);
    action = 'screening_rejected';
  } else if (decision === 'escalate') {
    await db.from('screening_cases').update(base).eq('id', case_id);
    await db.from('screening_issues').insert({
      case_id,
      issue_type: 'other',
      title: 'Escalated for further review',
      description: comments,
      severity: 'high',
      status: 'under_review',
      section: 'review',
      raised_by: actor.id,
      source: 'admin',
      created_by: actor.id,
      updated_by: actor.id,
    });
  } else {
    await db.from('screening_cases').update({ ...base, status: 'in_progress' }).eq('id', case_id);
  }

  await recordAudit(db, { caseId: case_id, ...audit(actor), action, section: 'review', recordType: 'review', recordId: review.id, previous: { status: c.screening.status }, next: { decision }, notes: comments });
  await syncCase(db, case_id, { id: actor.id, email: actor.email });
  revalidateCase(case_id);
  redirect(`/admin/vetting/${case_id}/review?recorded=1`);
}

const reopenSchema = z.object({
  case_id: z.string().uuid(),
  reason: z.string().trim().min(5, 'Please explain why the screening is being reopened').max(2000),
});

export async function reopenCaseAction(_prev: ScreeningFormState, formData: FormData): Promise<ScreeningFormState> {
  const g = await guard('screening.reopen');
  if (!g.ok) return g.state;
  const { actor, db } = g;

  const parsed = reopenSchema.safeParse(pick(formData, Object.keys(reopenSchema.shape)));
  if (!parsed.success) return err('Please check the highlighted fields.', fieldErrors(parsed.error));
  const { case_id, reason } = parsed.data;

  const c = await guardCase(db, case_id, true);
  if (!c.ok) return c.state;
  if (!c.screening.locked) return err('This screening is not locked.');

  const { error } = await db
    .from('screening_cases')
    .update({ locked: false, status: 'in_progress', completed_at: null, decision: null, decision_at: null, updated_by: actor.id })
    .eq('id', case_id);
  if (error) {
    fail('reopenCase failed', error);
    return err('Could not reopen the screening. Please try again.');
  }
  await recordAudit(db, { caseId: case_id, ...audit(actor), action: 'screening_reopened', section: 'review', recordType: 'case', recordId: case_id, previous: { status: c.screening.status, locked: true }, next: { status: 'in_progress', locked: false }, notes: reason });
  await syncCase(db, case_id, { id: actor.id, email: actor.email });
  revalidateCase(case_id);
  redirect(`/admin/vetting/${case_id}?reopened=1`);
}

// ── Shared delete for simple child records ───────────────────

async function deleteRecord(
  formData: FormData,
  table: string,
  recordType: string,
  action: string,
  stage: Stage,
): Promise<void> {
  const g = await guard('screening.manage');
  if (!g.ok) return;
  const { actor, db } = g;
  const caseId = str(formData, 'case_id');
  const id = str(formData, 'id');
  const c = await guardCase(db, caseId);
  if (!c.ok || !z.string().uuid().safeParse(id).success) return;

  const { data: prev } = await db.from(table).select('*').eq('id', id).eq('case_id', caseId).maybeSingle();
  if (!prev) return;
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) {
    fail(`delete ${table} failed`, error);
    return;
  }
  await recordAudit(db, { caseId, ...audit(actor), action, section: stage, recordType, recordId: id, previous: prev });
  await syncCase(db, caseId, { id: actor.id, email: actor.email });
  revalidateCase(caseId);
}
