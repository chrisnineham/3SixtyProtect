// ─────────────────────────────────────────────────────────────
// Screening engine — pure functions, no runtime imports.
//
// Evaluates a case file into: timeline analysis (gaps, overlaps, unverified
// periods), section and overall progress, the derived operational status,
// workflow stage states, outstanding actions and system-detected issues.
//
// It never decides an outcome. Everything it flags is for human review.
// Runs in Node directly (node --test) as well as in Next.js.
// ─────────────────────────────────────────────────────────────

import type { ScreeningPolicy } from './config';
import type {
  CaseFile,
  CaseStatus,
  IssueSeverity,
  IssueType,
  ScreeningIssue,
  Stage,
  VerificationStatus,
} from './types';

// ── Dates (UTC day arithmetic on YYYY-MM-DD strings) ─────────

const DAY_MS = 86_400_000;

export function toDays(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return Number.NaN;
  const d = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Math.floor(d / DAY_MS);
}

export function fromDays(days: number): string {
  return new Date(days * DAY_MS).toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addYears(iso: string, years: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]) + years, Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return toDays(toIso) - toDays(fromIso);
}

// ── Interval analysis ───────────────────────────────────────

export interface IntervalInput {
  id: string;
  label: string;
  from: string;
  to: string | null;
  status: VerificationStatus;
}

export interface Gap {
  from: string;
  to: string;
  days: number;
}

export interface Overlap {
  aId: string;
  bId: string;
  aLabel: string;
  bLabel: string;
  from: string;
  to: string;
  days: number;
}

export interface Inconsistency {
  id: string;
  label: string;
  reason: string;
}

export type SegmentKind = 'verified' | 'supplied' | 'gap' | 'tolerated' | 'discrepancy';

export interface CoverageSegment {
  kind: SegmentKind;
  from: string;
  to: string;
  days: number;
  recordId: string | null;
  label: string | null;
  /** Position/width along the period as percentages, for rendering. */
  startPct: number;
  widthPct: number;
}

export interface IntervalAnalysis {
  periodStart: string;
  periodEnd: string;
  periodDays: number;
  gaps: Gap[];
  overlaps: Overlap[];
  inconsistencies: Inconsistency[];
  unverified: IntervalInput[];
  segments: CoverageSegment[];
  verifiedDays: number;
  suppliedDays: number;
  gapDays: number;
  discrepancyDays: number;
  /** 0–100: verified counts fully, supplied-but-unverified counts half. */
  coveragePercent: number;
}

interface ClippedInterval extends IntervalInput {
  s: number;
  e: number;
}

const STATUS_RANK: Record<VerificationStatus, number> = {
  discrepancy: 4,
  unable_to_verify: 4,
  verified: 3,
  verification_required: 2,
  candidate_supplied: 2,
};

function kindFor(status: VerificationStatus): SegmentKind {
  if (status === 'discrepancy' || status === 'unable_to_verify') return 'discrepancy';
  if (status === 'verified') return 'verified';
  return 'supplied';
}

/**
 * Analyse a set of dated intervals against a required period.
 * `today` is injectable so the analysis is deterministic in tests.
 */
export function analyseIntervals(
  intervals: IntervalInput[],
  periodStart: string,
  periodEnd: string,
  policy: Pick<ScreeningPolicy, 'gapToleranceDays' | 'overlapToleranceDays'>,
): IntervalAnalysis {
  const ps = toDays(periodStart);
  const pe = toDays(periodEnd);
  const periodDays = Math.max(1, pe - ps + 1);
  const inconsistencies: Inconsistency[] = [];
  const clipped: ClippedInterval[] = [];

  for (const iv of intervals) {
    const fromD = toDays(iv.from);
    if (Number.isNaN(fromD)) {
      inconsistencies.push({ id: iv.id, label: iv.label, reason: 'Start date is missing or invalid' });
      continue;
    }
    let toD = iv.to ? toDays(iv.to) : pe;
    if (iv.to && Number.isNaN(toD)) {
      inconsistencies.push({ id: iv.id, label: iv.label, reason: 'End date is invalid' });
      continue;
    }
    if (iv.to && toD < fromD) {
      inconsistencies.push({ id: iv.id, label: iv.label, reason: 'End date is before the start date' });
      continue;
    }
    if (fromD > pe) {
      inconsistencies.push({ id: iv.id, label: iv.label, reason: 'Start date is in the future' });
      continue;
    }
    if (iv.to && toD > pe) {
      inconsistencies.push({ id: iv.id, label: iv.label, reason: 'End date is in the future' });
      toD = pe;
    }
    const s = Math.max(fromD, ps);
    const e = Math.min(toD, pe);
    if (e < s) continue; // entirely before the screening period
    clipped.push({ ...iv, s, e });
  }

  clipped.sort((a, b) => a.s - b.s || a.e - b.e);

  // Gaps
  const gaps: Gap[] = [];
  let cursor = ps;
  for (const iv of clipped) {
    if (iv.s > cursor) {
      const gapDays = iv.s - cursor;
      if (gapDays > policy.gapToleranceDays) {
        gaps.push({ from: fromDays(cursor), to: fromDays(iv.s - 1), days: gapDays });
      }
    }
    cursor = Math.max(cursor, iv.e + 1);
  }
  if (cursor <= pe) {
    const gapDays = pe - cursor + 1;
    if (gapDays > policy.gapToleranceDays) {
      gaps.push({ from: fromDays(cursor), to: fromDays(pe), days: gapDays });
    }
  }
  if (clipped.length === 0) {
    gaps.length = 0;
    gaps.push({ from: periodStart, to: periodEnd, days: periodDays });
  }

  // Overlaps
  const overlaps: Overlap[] = [];
  for (let i = 0; i < clipped.length; i++) {
    for (let j = i + 1; j < clipped.length; j++) {
      const a = clipped[i];
      const b = clipped[j];
      const os = Math.max(a.s, b.s);
      const oe = Math.min(a.e, b.e);
      const days = oe - os + 1;
      if (days > policy.overlapToleranceDays) {
        overlaps.push({
          aId: a.id,
          bId: b.id,
          aLabel: a.label,
          bLabel: b.label,
          from: fromDays(os),
          to: fromDays(oe),
          days,
        });
      }
    }
  }

  // Coverage segments
  const bounds = new Set<number>([ps, pe + 1]);
  for (const iv of clipped) {
    bounds.add(iv.s);
    bounds.add(iv.e + 1);
  }
  const sorted = Array.from(bounds).sort((a, b) => a - b);
  const raw: CoverageSegment[] = [];
  const flaggedGapRanges = gaps.map((g) => ({ s: toDays(g.from), e: toDays(g.to) }));

  for (let k = 0; k < sorted.length - 1; k++) {
    const s = sorted[k];
    const e = sorted[k + 1] - 1;
    if (e < s) continue;
    const covering = clipped.filter((iv) => iv.s <= s && iv.e >= e);
    let kind: SegmentKind;
    let recordId: string | null = null;
    let label: string | null = null;
    if (covering.length === 0) {
      const inFlaggedGap = flaggedGapRanges.some((g) => s >= g.s && e <= g.e);
      kind = inFlaggedGap ? 'gap' : 'tolerated';
    } else {
      const best = covering.reduce((acc, iv) =>
        STATUS_RANK[iv.status] > STATUS_RANK[acc.status] ? iv : acc,
      );
      kind = kindFor(best.status);
      recordId = best.id;
      label = best.label;
    }
    const prev = raw[raw.length - 1];
    if (prev && prev.kind === kind && prev.recordId === recordId && toDays(prev.to) === s - 1) {
      prev.to = fromDays(e);
      prev.days += e - s + 1;
    } else {
      raw.push({ kind, from: fromDays(s), to: fromDays(e), days: e - s + 1, recordId, label, startPct: 0, widthPct: 0 });
    }
  }
  for (const seg of raw) {
    seg.startPct = ((toDays(seg.from) - ps) / periodDays) * 100;
    seg.widthPct = (seg.days / periodDays) * 100;
  }

  const sum = (kind: SegmentKind) => raw.filter((x) => x.kind === kind).reduce((n, x) => n + x.days, 0);
  const verifiedDays = sum('verified');
  const suppliedDays = sum('supplied');
  const gapDays = sum('gap');
  const discrepancyDays = sum('discrepancy');
  const coveragePercent = Math.max(
    0,
    Math.min(100, Math.round(((verifiedDays + suppliedDays * 0.5) / periodDays) * 100)),
  );

  return {
    periodStart,
    periodEnd,
    periodDays,
    gaps,
    overlaps,
    inconsistencies,
    unverified: clipped.filter(
      (iv) => iv.status === 'candidate_supplied' || iv.status === 'verification_required',
    ),
    segments: raw,
    verifiedDays,
    suppliedDays,
    gapDays,
    discrepancyDays,
    coveragePercent,
  };
}

// ── Progress ────────────────────────────────────────────────

export interface SectionProgress {
  key: Stage;
  label: string;
  applicable: boolean;
  percent: number;
  detail: string;
}

export interface ProgressReport {
  sections: SectionProgress[];
  overall: number;
}

export const PERSONAL_REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: 'legal_name', label: 'Legal name' },
  { key: 'date_of_birth', label: 'Date of birth' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'email', label: 'Email' },
  { key: 'telephone', label: 'Telephone' },
  { key: 'address_line_1', label: 'Current address' },
  { key: 'postcode', label: 'Postcode' },
];

export const CASE_REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: 'proposed_role', label: 'Proposed role' },
  { key: 'proposed_start_date', label: 'Proposed start date' },
];

export function missingPersonalFields(file: CaseFile): string[] {
  const missing: string[] = [];
  const c = file.candidate as unknown as Record<string, unknown>;
  for (const f of PERSONAL_REQUIRED_FIELDS) {
    const v = c[f.key];
    if (v === null || v === undefined || String(v).trim() === '') missing.push(f.label);
  }
  const k = file.case as unknown as Record<string, unknown>;
  for (const f of CASE_REQUIRED_FIELDS) {
    const v = k[f.key];
    if (v === null || v === undefined || String(v).trim() === '') missing.push(f.label);
  }
  return missing;
}

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

export function screeningPeriod(file: CaseFile, today: string): { start: string; end: string } {
  return { start: addYears(today, -file.case.screening_period_years), end: today };
}

export function addressIntervals(file: CaseFile): IntervalInput[] {
  return file.addresses.map((a) => ({
    id: a.id,
    label: [a.address_line_1, a.town, a.postcode].filter(Boolean).join(', '),
    from: a.from_date,
    to: a.is_current ? null : a.to_date,
    status: a.verification_status,
  }));
}

export function activityIntervals(file: CaseFile): IntervalInput[] {
  return file.activities.map((a) => ({
    id: a.id,
    label: a.position ? `${a.organisation}, ${a.position}` : a.organisation,
    from: a.from_date,
    to: a.to_date,
    status: a.verification_status,
  }));
}

export function activitiesNeedingReference(file: CaseFile, policy: ScreeningPolicy, periodStart: string) {
  const ps = toDays(periodStart);
  return file.activities.filter((a) => {
    const inPeriod = a.to_date ? toDays(a.to_date) >= ps : true;
    return inPeriod && (a.requires_reference || policy.referenceCategories.includes(a.category));
  });
}

export function siaApplicable(file: CaseFile): boolean {
  return Boolean(file.case.sia_licence_type) || Boolean(file.sia?.licence_number);
}

export function computeProgress(
  file: CaseFile,
  policy: ScreeningPolicy,
  addr: IntervalAnalysis,
  act: IntervalAnalysis,
): ProgressReport {
  const sections: SectionProgress[] = [];

  // Personal details
  const missing = missingPersonalFields(file);
  const totalRequired = PERSONAL_REQUIRED_FIELDS.length + CASE_REQUIRED_FIELDS.length;
  sections.push({
    key: 'personal',
    label: 'Personal details',
    applicable: true,
    percent: pct(totalRequired - missing.length, totalRequired),
    detail: missing.length ? `Missing: ${missing.join(', ')}` : 'Complete',
  });

  // Identity
  const docs = file.identityDocuments;
  const verifiedDocs = docs.filter((d) => d.status === 'verified').length;
  const suppliedDocs = docs.filter((d) => d.status === 'supplied' || d.status === 'verification_required').length;
  let identityPct = 0;
  if (verifiedDocs >= policy.requiredIdentityDocuments) identityPct = 100;
  else if (verifiedDocs > 0) identityPct = pct(verifiedDocs, policy.requiredIdentityDocuments);
  else if (suppliedDocs > 0) identityPct = 50;
  sections.push({
    key: 'identity',
    label: 'Identity',
    applicable: true,
    percent: identityPct,
    detail:
      docs.length === 0
        ? 'No identity documents recorded'
        : `${verifiedDocs} verified, ${suppliedDocs} awaiting verification`,
  });

  // Right to Work
  const rtw = file.rightToWork;
  let rtwPct = 0;
  let rtwDetail = 'No check recorded';
  if (rtw) {
    if (rtw.status === 'verified' || rtw.status === 'time_limited') {
      rtwPct = 100;
      rtwDetail = rtw.status === 'time_limited' ? `Time limited${rtw.expiry_date ? `, expires ${rtw.expiry_date}` : ''}` : 'Verified';
    } else if (rtw.status === 'outstanding') {
      rtwPct = rtw.check_type || rtw.checked_at ? 40 : 0;
      rtwDetail = 'Check outstanding';
    } else {
      rtwDetail = 'Check failed';
    }
  }
  sections.push({ key: 'right_to_work', label: 'Right to Work', applicable: true, percent: rtwPct, detail: rtwDetail });

  // Address history
  sections.push({
    key: 'addresses',
    label: 'Address history',
    applicable: true,
    percent: file.addresses.length ? addr.coveragePercent : 0,
    detail: file.addresses.length
      ? `${addr.gaps.length} gap${addr.gaps.length === 1 ? '' : 's'}, ${addr.unverified.length} unverified`
      : 'No addresses recorded',
  });

  // Employment / activity
  sections.push({
    key: 'activity',
    label: 'Employment / activity history',
    applicable: true,
    percent: file.activities.length ? act.coveragePercent : 0,
    detail: file.activities.length
      ? `${act.gaps.length} gap${act.gaps.length === 1 ? '' : 's'}, ${act.unverified.length} unverified`
      : 'No activity recorded',
  });

  // References
  const needing = activitiesNeedingReference(file, policy, act.periodStart);
  const weights: Record<string, number> = {
    verified: 1,
    received: 0.6,
    source_verification_required: 0.6,
    requested: 0.25,
    awaiting_response: 0.25,
    not_requested: 0,
    unable_to_verify: 0,
    discrepancy: 0,
  };
  let refScore = 0;
  for (const a of needing) {
    const refs = file.references.filter((r) => r.activity_id === a.id);
    const best = refs.reduce((m, r) => Math.max(m, weights[r.status] ?? 0), 0);
    refScore += best;
  }
  const refsVerified = needing.filter((a) =>
    file.references.some((r) => r.activity_id === a.id && r.status === 'verified'),
  ).length;
  sections.push({
    key: 'references',
    label: 'References',
    applicable: needing.length > 0,
    percent: needing.length ? pct(refScore, needing.length) : 0,
    detail: needing.length
      ? `${refsVerified} of ${needing.length} verified`
      : 'No periods currently require a reference',
  });

  // SIA
  const siaNeeded = siaApplicable(file);
  let siaPct = 0;
  let siaDetail = siaNeeded ? 'No check recorded' : 'Not required for this role';
  if (file.sia) {
    if (file.sia.status === 'valid') {
      siaPct = 100;
      siaDetail = 'Licence valid';
    } else if (file.sia.status === 'awaiting_check') {
      siaPct = file.sia.licence_number ? 30 : 0;
      siaDetail = 'Awaiting check';
    } else {
      siaDetail = `Licence ${file.sia.status.replace(/_/g, ' ')}`;
    }
  }
  sections.push({ key: 'sia', label: 'SIA licence', applicable: siaNeeded, percent: siaPct, detail: siaDetail });

  // Additional checks
  const required = file.checks.filter((c) => c.required && c.status !== 'not_required');
  const done = required.filter((c) => c.status === 'complete' || c.status === 'verified').length;
  sections.push({
    key: 'checks',
    label: 'Additional checks',
    applicable: required.length > 0,
    percent: pct(done, required.length),
    detail: required.length ? `${done} of ${required.length} complete` : 'No required checks',
  });

  const applicable = sections.filter((s) => s.applicable);
  const average = applicable.length
    ? applicable.reduce((n, s) => n + s.percent, 0) / applicable.length
    : 0;
  // Never report 100% while any applicable section is still incomplete.
  const overall =
    applicable.length && applicable.every((s) => s.percent === 100)
      ? 100
      : Math.min(99, Math.round(average));

  return { sections, overall };
}

// ── Stages, status, actions ─────────────────────────────────

export type StageState = 'complete' | 'in_progress' | 'attention' | 'not_started';

export interface StageStatus {
  key: Stage;
  label: string;
  state: StageState;
  detail: string;
  href: string;
}

export type ActionLevel = 'high' | 'medium' | 'low' | 'ok';

export interface OutstandingAction {
  level: ActionLevel;
  title: string;
  detail: string | null;
  stage: Stage;
  href: string;
}

export interface CaseCounts {
  outstanding: number;
  awaitingCandidate: number;
  awaitingThirdParty: number;
  openIssues: number;
  unverifiedPeriods: number;
}

export interface SystemIssueCandidate {
  fingerprint: string;
  issue_type: IssueType;
  title: string;
  description: string;
  severity: IssueSeverity;
  section: Stage;
  period_from: string | null;
  period_to: string | null;
  related_record_id: string | null;
}

export interface CaseEvaluation {
  today: string;
  periodStart: string;
  periodEnd: string;
  addressAnalysis: IntervalAnalysis;
  activityAnalysis: IntervalAnalysis;
  progress: ProgressReport;
  status: CaseStatus;
  currentStage: Stage;
  stages: StageStatus[];
  actions: OutstandingAction[];
  counts: CaseCounts;
  systemIssues: SystemIssueCandidate[];
  unresolvedIssues: ScreeningIssue[];
}

const STAGE_ORDER: { key: Stage; label: string; path: string }[] = [
  { key: 'personal', label: 'Personal details', path: 'personal' },
  { key: 'identity', label: 'Identity', path: 'identity' },
  { key: 'right_to_work', label: 'Right to Work', path: 'right-to-work' },
  { key: 'addresses', label: 'Address history', path: 'addresses' },
  { key: 'activity', label: 'Employment / activity', path: 'activity' },
  { key: 'references', label: 'References', path: 'references' },
  { key: 'sia', label: 'SIA licence', path: 'sia' },
  { key: 'checks', label: 'Additional checks', path: 'checks' },
  { key: 'issues', label: 'Issues & discrepancies', path: 'issues' },
  { key: 'review', label: 'Final review', path: 'review' },
  { key: 'complete', label: 'Complete', path: 'review' },
];

const UNRESOLVED = new Set(['open', 'awaiting_candidate', 'awaiting_third_party', 'under_review']);

function href(caseId: string, stage: Stage, hash?: string): string {
  const path = STAGE_ORDER.find((s) => s.key === stage)?.path ?? 'personal';
  return `/admin/vetting/${caseId}/${path}${hash ? `#${hash}` : ''}`;
}

function fmt(iso: string | null): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

export function detectSystemIssues(addr: IntervalAnalysis, act: IntervalAnalysis): SystemIssueCandidate[] {
  const out: SystemIssueCandidate[] = [];
  for (const g of addr.gaps) {
    out.push({
      fingerprint: `address_gap:${g.from}:${g.to}`,
      issue_type: 'address_gap',
      title: `Address history gap: ${fmt(g.from)} to ${fmt(g.to)}`,
      description: `${g.days} days of the screening period are not covered by an address. Please obtain an explanation or a further address from the candidate.`,
      severity: 'medium',
      section: 'addresses',
      period_from: g.from,
      period_to: g.to,
      related_record_id: null,
    });
  }
  for (const g of act.gaps) {
    out.push({
      fingerprint: `employment_gap:${g.from}:${g.to}`,
      issue_type: 'employment_gap',
      title: `Employment / activity gap: ${fmt(g.from)} to ${fmt(g.to)}`,
      description: `${g.days} days of the screening period have no recorded employment or activity. Please obtain an explanation from the candidate and record it as an activity.`,
      severity: 'medium',
      section: 'activity',
      period_from: g.from,
      period_to: g.to,
      related_record_id: null,
    });
  }
  for (const i of addr.inconsistencies) {
    out.push({
      fingerprint: `conflicting_dates:address:${i.id}`,
      issue_type: 'conflicting_dates',
      title: `Address dates need checking: ${i.label}`,
      description: i.reason,
      severity: 'medium',
      section: 'addresses',
      period_from: null,
      period_to: null,
      related_record_id: i.id,
    });
  }
  for (const i of act.inconsistencies) {
    out.push({
      fingerprint: `conflicting_dates:activity:${i.id}`,
      issue_type: 'conflicting_dates',
      title: `Activity dates need checking: ${i.label}`,
      description: i.reason,
      severity: 'medium',
      section: 'activity',
      period_from: null,
      period_to: null,
      related_record_id: i.id,
    });
  }
  return out;
}

/** Evaluate a full case file. Pure; `today` is injectable for tests. */
export function evaluateCase(file: CaseFile, policy: ScreeningPolicy, today: string = todayIso()): CaseEvaluation {
  const { start: periodStart, end: periodEnd } = screeningPeriod(file, today);
  const addressAnalysis = analyseIntervals(addressIntervals(file), periodStart, periodEnd, policy);
  const activityAnalysis = analyseIntervals(activityIntervals(file), periodStart, periodEnd, policy);
  const progress = computeProgress(file, policy, addressAnalysis, activityAnalysis);
  const systemIssues = detectSystemIssues(addressAnalysis, activityAnalysis);
  const section = (key: Stage) => progress.sections.find((s) => s.key === key);
  const caseId = file.case.id;
  const unresolvedIssues = file.issues.filter((i) => UNRESOLVED.has(i.status));
  const actions: OutstandingAction[] = [];

  // Issues first — they are the most important thing to see.
  for (const issue of unresolvedIssues) {
    actions.push({
      level: issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low',
      title: issue.title,
      detail: issue.status === 'awaiting_candidate'
        ? 'Awaiting candidate'
        : issue.status === 'awaiting_third_party'
          ? 'Awaiting third party'
          : issue.status === 'under_review'
            ? 'Under review'
            : 'Open',
      stage: 'issues',
      href: href(caseId, 'issues', `issue-${issue.id}`),
    });
  }

  // Personal
  const missing = missingPersonalFields(file);
  if (missing.length) {
    actions.push({
      level: 'medium',
      title: 'Candidate details incomplete',
      detail: `Missing: ${missing.join(', ')}`,
      stage: 'personal',
      href: href(caseId, 'personal'),
    });
  }

  // Identity
  const docs = file.identityDocuments;
  if (docs.length === 0) {
    actions.push({ level: 'medium', title: 'Identity documents required', detail: 'No identity evidence recorded yet', stage: 'identity', href: href(caseId, 'identity') });
  }
  for (const d of docs) {
    if (d.status === 'supplied' || d.status === 'verification_required') {
      actions.push({ level: 'medium', title: `${d.document_type} awaiting verification`, detail: null, stage: 'identity', href: href(caseId, 'identity', `doc-${d.id}`) });
    } else if (d.status === 'failed') {
      actions.push({ level: 'high', title: `${d.document_type} verification failed`, detail: d.notes, stage: 'identity', href: href(caseId, 'identity', `doc-${d.id}`) });
    }
    if (d.expiry_date && toDays(d.expiry_date) < toDays(today)) {
      actions.push({ level: 'high', title: `${d.document_type} has expired`, detail: `Expired ${fmt(d.expiry_date)}`, stage: 'identity', href: href(caseId, 'identity', `doc-${d.id}`) });
    } else if (d.expiry_date && toDays(d.expiry_date) - toDays(today) <= policy.documentExpiryWarningDays) {
      actions.push({ level: 'low', title: `${d.document_type} expires soon`, detail: `Expires ${fmt(d.expiry_date)}`, stage: 'identity', href: href(caseId, 'identity', `doc-${d.id}`) });
    }
  }

  // Right to Work
  const rtw = file.rightToWork;
  if (!rtw || rtw.status === 'outstanding') {
    actions.push({ level: 'high', title: 'Right to Work check outstanding', detail: rtw ? 'Check started but not verified' : 'No check recorded', stage: 'right_to_work', href: href(caseId, 'right_to_work') });
  } else if (rtw.status === 'failed') {
    actions.push({ level: 'high', title: 'Right to Work check failed', detail: rtw.notes, stage: 'right_to_work', href: href(caseId, 'right_to_work') });
  } else if (rtw.status === 'time_limited' && rtw.expiry_date) {
    const daysLeft = toDays(rtw.expiry_date) - toDays(today);
    if (daysLeft < 0) {
      actions.push({ level: 'high', title: 'Right to Work permission has expired', detail: `Expired ${fmt(rtw.expiry_date)}`, stage: 'right_to_work', href: href(caseId, 'right_to_work') });
    } else if (daysLeft <= policy.rightToWorkExpiryWarningDays) {
      actions.push({ level: 'medium', title: 'Right to Work permission expires soon', detail: `Expires ${fmt(rtw.expiry_date)} (follow-up check required)`, stage: 'right_to_work', href: href(caseId, 'right_to_work') });
    }
  }

  // Addresses & activity — gaps are raised as issues; surface unverified periods.
  if (file.addresses.length === 0) {
    actions.push({ level: 'medium', title: 'Address history required', detail: `Covering the last ${file.case.screening_period_years} years`, stage: 'addresses', href: href(caseId, 'addresses') });
  }
  for (const iv of addressAnalysis.unverified) {
    actions.push({ level: 'low', title: 'Address awaiting verification', detail: iv.label, stage: 'addresses', href: href(caseId, 'addresses', `address-${iv.id}`) });
  }
  if (file.activities.length === 0) {
    actions.push({ level: 'medium', title: 'Employment / activity history required', detail: `Covering the last ${file.case.screening_period_years} years`, stage: 'activity', href: href(caseId, 'activity') });
  }
  for (const iv of activityAnalysis.unverified) {
    actions.push({ level: 'low', title: 'Activity awaiting verification', detail: iv.label, stage: 'activity', href: href(caseId, 'activity', `activity-${iv.id}`) });
  }
  for (const o of activityAnalysis.overlaps) {
    actions.push({ level: 'low', title: 'Overlapping activity periods', detail: `${o.aLabel} and ${o.bLabel} overlap by ${o.days} days`, stage: 'activity', href: href(caseId, 'activity', `activity-${o.aId}`) });
  }

  // References
  const needing = activitiesNeedingReference(file, policy, periodStart);
  for (const a of needing) {
    const refs = file.references.filter((r) => r.activity_id === a.id);
    if (refs.length === 0) {
      actions.push({ level: 'medium', title: 'Reference not yet requested', detail: a.organisation, stage: 'references', href: href(caseId, 'references') });
      continue;
    }
    for (const r of refs) {
      if (r.status === 'requested' || r.status === 'awaiting_response') {
        const ago = r.requested_at ? toDays(today) - toDays(r.requested_at) : null;
        actions.push({ level: 'medium', title: 'Reference outstanding', detail: `${r.organisation}${ago !== null ? `, requested ${ago} day${ago === 1 ? '' : 's'} ago` : ''}`, stage: 'references', href: href(caseId, 'references', `reference-${r.id}`) });
      } else if (r.status === 'received' || r.status === 'source_verification_required') {
        actions.push({ level: 'medium', title: 'Reference received: source verification required', detail: r.organisation, stage: 'references', href: href(caseId, 'references', `reference-${r.id}`) });
      } else if (r.status === 'unable_to_verify' || r.status === 'discrepancy') {
        actions.push({ level: 'high', title: r.status === 'discrepancy' ? 'Reference discrepancy' : 'Unable to verify reference', detail: r.organisation, stage: 'references', href: href(caseId, 'references', `reference-${r.id}`) });
      } else if (r.status === 'not_requested') {
        actions.push({ level: 'medium', title: 'Reference not yet requested', detail: r.organisation, stage: 'references', href: href(caseId, 'references', `reference-${r.id}`) });
      }
    }
  }

  // SIA
  if (siaApplicable(file)) {
    if (!file.sia || file.sia.status === 'awaiting_check') {
      actions.push({ level: 'medium', title: 'SIA licence check required', detail: file.sia?.licence_number ? `Licence ${file.sia.licence_number}` : 'No licence number recorded', stage: 'sia', href: href(caseId, 'sia') });
    } else if (file.sia.status === 'valid') {
      actions.push({ level: 'ok', title: 'SIA licence verified', detail: file.sia.expiry_date ? `Valid until ${fmt(file.sia.expiry_date)}` : null, stage: 'sia', href: href(caseId, 'sia') });
    } else {
      actions.push({ level: 'high', title: `SIA licence ${file.sia.status.replace(/_/g, ' ')}`, detail: file.sia.result_notes, stage: 'sia', href: href(caseId, 'sia') });
    }
  }

  // Checks
  for (const c of file.checks) {
    if (!c.required || c.status === 'not_required') continue;
    if (c.status === 'pending') {
      actions.push({ level: 'medium', title: `${c.label} pending`, detail: null, stage: 'checks', href: href(caseId, 'checks', `check-${c.id}`) });
    } else if (c.status === 'failed') {
      actions.push({ level: 'high', title: `${c.label} failed`, detail: c.notes, stage: 'checks', href: href(caseId, 'checks', `check-${c.id}`) });
    }
  }

  // Positive confirmations
  if (section('identity')?.percent === 100) actions.push({ level: 'ok', title: 'Identity verified', detail: null, stage: 'identity', href: href(caseId, 'identity') });
  if (rtw && (rtw.status === 'verified' || rtw.status === 'time_limited')) actions.push({ level: 'ok', title: 'Right to Work verified', detail: rtw.status === 'time_limited' ? 'Time limited' : null, stage: 'right_to_work', href: href(caseId, 'right_to_work') });
  if (file.addresses.length && addressAnalysis.gaps.length === 0 && addressAnalysis.unverified.length === 0 && addressAnalysis.discrepancyDays === 0) actions.push({ level: 'ok', title: 'Address history verified', detail: null, stage: 'addresses', href: href(caseId, 'addresses') });
  if (needing.length && section('references')?.percent === 100) actions.push({ level: 'ok', title: 'All references verified', detail: null, stage: 'references', href: href(caseId, 'references') });

  const order: Record<ActionLevel, number> = { high: 0, medium: 1, low: 2, ok: 3 };
  actions.sort((a, b) => order[a.level] - order[b.level]);

  // Stage states
  const stateFor = (key: Stage): { state: StageState; detail: string } => {
    const s = section(key);
    const p = s?.percent ?? 0;
    const sectionIssues = unresolvedIssues.some((i) => i.section === key);
    switch (key) {
      case 'personal':
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'identity':
        if (docs.some((d) => d.status === 'failed') || sectionIssues) return { state: 'attention', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'right_to_work':
        if (rtw?.status === 'failed' || sectionIssues) return { state: 'attention', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'addresses':
        if (file.addresses.length && (addressAnalysis.gaps.length || addressAnalysis.inconsistencies.length || addressAnalysis.discrepancyDays || sectionIssues)) return { state: 'attention', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'activity':
        if (file.activities.length && (activityAnalysis.gaps.length || activityAnalysis.inconsistencies.length || activityAnalysis.discrepancyDays || sectionIssues)) return { state: 'attention', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'references':
        if (file.references.some((r) => r.status === 'discrepancy' || r.status === 'unable_to_verify') || sectionIssues) return { state: 'attention', detail: s?.detail ?? '' };
        if (!s?.applicable) return { state: file.activities.length ? 'complete' : 'not_started', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'sia':
        if (file.sia && file.sia.status !== 'valid' && file.sia.status !== 'awaiting_check') return { state: 'attention', detail: s?.detail ?? '' };
        if (!s?.applicable) return { state: 'complete', detail: 'Not required for this role' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'checks':
        if (file.checks.some((c) => c.status === 'failed') || sectionIssues) return { state: 'attention', detail: s?.detail ?? '' };
        if (!s?.applicable) return { state: file.checks.length ? 'complete' : 'not_started', detail: s?.detail ?? '' };
        return { state: p === 100 ? 'complete' : p > 0 ? 'in_progress' : 'not_started', detail: s?.detail ?? '' };
      case 'issues':
        return unresolvedIssues.length
          ? { state: 'attention', detail: `${unresolvedIssues.length} unresolved` }
          : { state: 'complete', detail: file.issues.length ? 'All issues resolved' : 'No issues raised' };
      case 'review':
        if (file.case.status === 'completed') return { state: 'complete', detail: 'Reviewed' };
        return { state: 'not_started', detail: '' };
      case 'complete':
        return file.case.status === 'completed' ? { state: 'complete', detail: '' } : { state: 'not_started', detail: '' };
    }
  };

  // Status
  const terminal = file.case.status === 'completed' || file.case.status === 'withdrawn' || file.case.status === 'rejected';
  let status: CaseStatus;
  // "Not started" = nothing beyond the case itself has been recorded yet.
  const hasScreeningRecords =
    file.addresses.length + file.activities.length + file.identityDocuments.length + file.references.length > 0 ||
    Boolean(file.rightToWork) || Boolean(file.sia);
  const blocking = unresolvedIssues.filter((i) => i.status !== 'awaiting_candidate');
  const awaitingCandidateIssues = unresolvedIssues.filter((i) => i.status === 'awaiting_candidate');
  const refsWaiting = file.references.some((r) => r.status === 'requested' || r.status === 'awaiting_response');
  const verificationPending =
    docs.some((d) => d.status === 'supplied' || d.status === 'verification_required') ||
    (rtw?.status === 'outstanding' && Boolean(rtw.check_type || rtw.checked_at)) ||
    addressAnalysis.unverified.length > 0 ||
    activityAnalysis.unverified.length > 0 ||
    file.references.some((r) => r.status === 'received' || r.status === 'source_verification_required') ||
    file.sia?.status === 'awaiting_check';

  if (terminal) status = file.case.status;
  else if (progress.overall === 100 && unresolvedIssues.length === 0 && systemIssues.length === 0) status = 'ready_for_review';
  else if (blocking.length) status = 'discrepancy';
  else if (!hasScreeningRecords && awaitingCandidateIssues.length === 0) status = 'not_started';
  else if (missing.length || awaitingCandidateIssues.length || file.addresses.length === 0 || file.activities.length === 0) status = 'candidate_info_required';
  else if (refsWaiting) status = 'awaiting_reference';
  else if (verificationPending) status = 'verification_required';
  else status = 'in_progress';

  // Stages (review stage reflects derived status)
  const stages: StageStatus[] = STAGE_ORDER.map((s) => {
    const st = stateFor(s.key);
    if (s.key === 'review' && st.state !== 'complete') {
      if (status === 'ready_for_review') return { key: s.key, label: s.label, state: 'in_progress', detail: 'Ready for review', href: href(caseId, 'review') };
      if (status === 'withdrawn' || status === 'rejected') return { key: s.key, label: s.label, state: 'attention', detail: status === 'withdrawn' ? 'Withdrawn' : 'Rejected', href: href(caseId, 'review') };
    }
    return { key: s.key, label: s.label, state: st.state, detail: st.detail, href: href(caseId, s.key) };
  });
  const firstIncomplete = stages.find((s) => s.state !== 'complete');
  const currentStage: Stage = firstIncomplete ? firstIncomplete.key : 'complete';

  const counts: CaseCounts = {
    outstanding: actions.filter((a) => a.level !== 'ok').length,
    awaitingCandidate: awaitingCandidateIssues.length + (missing.length ? 1 : 0) + (docs.length === 0 ? 1 : 0),
    awaitingThirdParty:
      file.references.filter((r) => r.status === 'requested' || r.status === 'awaiting_response').length +
      unresolvedIssues.filter((i) => i.status === 'awaiting_third_party').length +
      (file.sia?.status === 'awaiting_check' ? 1 : 0),
    openIssues: unresolvedIssues.length,
    unverifiedPeriods: addressAnalysis.unverified.length + activityAnalysis.unverified.length,
  };

  return {
    today,
    periodStart,
    periodEnd,
    addressAnalysis,
    activityAnalysis,
    progress,
    status,
    currentStage,
    stages,
    actions,
    counts,
    systemIssues,
    unresolvedIssues,
  };
}
