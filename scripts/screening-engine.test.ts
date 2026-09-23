// Screening engine tests — run with `npm run test:screening`
// (Node's built-in test runner; TypeScript is stripped natively by Node ≥ 22.6).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyseIntervals,
  detectSystemIssues,
  evaluateCase,
  addYears,
} from '../lib/screening/engine.ts';
import { SCREENING_POLICY } from '../lib/screening/config.ts';
import type {
  CaseFile,
  IdentityDocument,
  RightToWork,
  ScreeningActivity,
  ScreeningAddress,
  ScreeningCandidate,
  ScreeningCase,
  ScreeningCheck,
  ScreeningIssue,
  ScreeningReference,
  SiaCheck,
  VerificationStatus,
} from '../lib/screening/types.ts';

const TODAY = '2026-09-13';
const PERIOD_START = addYears(TODAY, -SCREENING_POLICY.screeningPeriodYears); // 2021-09-13

function attrib() {
  return { created_by: null, updated_by: null, created_at: TODAY, updated_at: TODAY };
}

function candidate(overrides: Partial<ScreeningCandidate> = {}): ScreeningCandidate {
  return {
    id: 'cand-1',
    legal_name: 'James Smith',
    previous_names: null,
    date_of_birth: '1990-04-02',
    nationality: 'British',
    email: 'james@example.com',
    telephone: '07700 900000',
    ni_number: 'QQ123456C',
    address_line_1: '45 Station Road',
    address_line_2: null,
    town: 'London',
    postcode: 'E14 8PX',
    country: 'United Kingdom',
    sia_licence_number: null,
    linked_booking_id: null,
    source: 'admin',
    ...attrib(),
    ...overrides,
  };
}

function kase(overrides: Partial<ScreeningCase> = {}): ScreeningCase {
  return {
    id: 'case-1',
    reference: '3SP-VET-000001',
    candidate_id: 'cand-1',
    workflow: 'bs7858',
    status: 'not_started',
    current_stage: 'personal',
    proposed_role: 'Door Supervisor',
    sia_licence_type: null,
    proposed_start_date: '2026-10-01',
    screening_start_date: TODAY,
    assigned_to: null,
    screening_period_years: SCREENING_POLICY.screeningPeriodYears,
    progress_percent: 0,
    outstanding_count: 0,
    awaiting_candidate_count: 0,
    awaiting_third_party_count: 0,
    open_issue_count: 0,
    unverified_period_count: 0,
    locked: false,
    completed_at: null,
    decision: null,
    decision_at: null,
    reviewed_by: null,
    withdrawn_reason: null,
    ...attrib(),
    ...overrides,
  };
}

function file(overrides: Partial<CaseFile> = {}): CaseFile {
  return {
    case: kase(),
    candidate: candidate(),
    addresses: [],
    activities: [],
    references: [],
    identityDocuments: [],
    rightToWork: null,
    sia: null,
    checks: [],
    issues: [],
    evidence: [],
    reviews: [],
    ...overrides,
  };
}

function address(id: string, from: string, to: string | null, status: VerificationStatus = 'verified'): ScreeningAddress {
  return {
    id, case_id: 'case-1', address_line_1: `${id} High Street`, address_line_2: null, town: 'London',
    postcode: 'E1 1AA', country: 'UK', from_date: from, to_date: to, is_current: to === null,
    verification_status: status, verification_method: null, verified_by: null, verified_at: null,
    notes: null, source: 'admin', ...attrib(),
  };
}

function activity(id: string, from: string, to: string | null, status: VerificationStatus = 'verified'): ScreeningActivity {
  return {
    id, case_id: 'case-1', category: 'employment', organisation: `${id} Ltd`, position: 'Officer',
    address: null, contact_name: null, contact_email: null, contact_telephone: null, from_date: from,
    to_date: to, reason_for_leaving: null, requires_reference: true, verification_status: status,
    verification_method: null, verified_by: null, verified_at: null, notes: null, source: 'admin', ...attrib(),
  };
}

function reference(id: string, activityId: string, status: ScreeningReference['status']): ScreeningReference {
  return {
    id, case_id: 'case-1', activity_id: activityId, organisation: `${activityId} Ltd`, contact_name: 'HR',
    contact_position: null, email: null, telephone: null, status, requested_at: '2026-09-09',
    received_at: null, method: null, source_verified: status === 'verified', source_verification_method: null,
    verified_by: null, verified_at: null, notes: null, request_token: null, request_token_expires_at: null,
    response: null, source: 'admin', ...attrib(),
  };
}

function doc(status: IdentityDocument['status']): IdentityDocument {
  return {
    id: 'doc-1', case_id: 'case-1', document_type: 'Passport', document_number: '123456789',
    issue_date: '2020-01-01', expiry_date: '2030-01-01', issuing_country: 'UK', status,
    verification_method: null, checked_by: null, checked_at: null, notes: null, source: 'admin', ...attrib(),
  };
}

function rtw(status: RightToWork['status']): RightToWork {
  return {
    id: 'rtw-1', case_id: 'case-1', check_type: 'Manual document check', status, checked_at: TODAY,
    checked_by: null, expiry_date: null, share_code: null, restrictions: null, notes: null, source: 'admin', ...attrib(),
  };
}

function sia(status: SiaCheck['status']): SiaCheck {
  return {
    id: 'sia-1', case_id: 'case-1', licence_number: '1234567890123456', licence_holder: 'James Smith',
    licence_type: 'Door Supervision', status, issue_date: null, expiry_date: '2028-01-01', checked_at: TODAY,
    checked_by: null, check_method: null, result_notes: null, source: 'admin', ...attrib(),
  };
}

function check(key: string, status: ScreeningCheck['status'], required = true): ScreeningCheck {
  return { id: `chk-${key}`, case_id: 'case-1', check_key: key, label: key, required, status, notes: null, checked_by: null, checked_at: null, sort_order: 0, ...attrib() };
}

function issue(id: string, status: ScreeningIssue['status'], severity: ScreeningIssue['severity'] = 'medium'): ScreeningIssue {
  return {
    id, case_id: 'case-1', issue_type: 'employment_gap', title: `Issue ${id}`, description: null, severity, status,
    section: 'activity', related_record_id: null, period_from: null, period_to: null, raised_by: null,
    raised_at: TODAY, assigned_to: null, candidate_explanation: null, resolution: null, resolved_at: null,
    resolved_by: null, source: 'admin', fingerprint: null, ...attrib(),
  };
}

/** A file where every section is fully verified. */
function completeFile(): CaseFile {
  return file({
    case: kase({ sia_licence_type: 'Door Supervision' }),
    identityDocuments: [doc('verified')],
    rightToWork: rtw('verified'),
    addresses: [address('a1', '2019-01-01', null)],
    activities: [activity('e1', '2019-01-01', null)],
    references: [reference('r1', 'e1', 'verified')],
    sia: sia('valid'),
    checks: [check('identity', 'verified'), check('right_to_work', 'complete')],
  });
}

// ── Interval analysis ────────────────────────────────────────

test('contiguous verified intervals: no gaps, full coverage', () => {
  const a = analyseIntervals(
    [
      { id: 'A', label: 'A', from: '2021-01-01', to: '2023-06-30', status: 'verified' },
      { id: 'B', label: 'B', from: '2023-07-01', to: null, status: 'verified' },
    ],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(a.gaps.length, 0);
  assert.equal(a.coveragePercent, 100);
  assert.equal(a.verifiedDays, a.periodDays);
  assert.ok(a.segments.every((s) => s.kind === 'verified'));
});

test('a gap beyond the tolerance is detected with exact dates; a short one is tolerated', () => {
  const flagged = analyseIntervals(
    [
      { id: 'A', label: 'A', from: '2021-01-01', to: '2023-03-31', status: 'verified' },
      { id: 'B', label: 'B', from: '2023-05-17', to: null, status: 'verified' },
    ],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(flagged.gaps.length, 1);
  assert.deepEqual(flagged.gaps[0], { from: '2023-04-01', to: '2023-05-16', days: 46 });
  assert.ok(flagged.segments.some((s) => s.kind === 'gap' && s.from === '2023-04-01'));

  const tolerated = analyseIntervals(
    [
      { id: 'A', label: 'A', from: '2021-01-01', to: '2023-03-31', status: 'verified' },
      { id: 'B', label: 'B', from: '2023-04-20', to: null, status: 'verified' },
    ],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(tolerated.gaps.length, 0);
  assert.ok(tolerated.segments.some((s) => s.kind === 'tolerated'));
});

test('an empty history is one gap spanning the whole period', () => {
  const a = analyseIntervals([], PERIOD_START, TODAY, SCREENING_POLICY);
  assert.equal(a.gaps.length, 1);
  assert.equal(a.gaps[0].from, PERIOD_START);
  assert.equal(a.gaps[0].to, TODAY);
  assert.equal(a.coveragePercent, 0);
});

test('overlapping periods beyond the tolerance are reported', () => {
  const a = analyseIntervals(
    [
      { id: 'A', label: 'A', from: '2021-01-01', to: '2023-01-31', status: 'verified' },
      { id: 'B', label: 'B', from: '2022-11-01', to: null, status: 'verified' },
    ],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(a.overlaps.length, 1);
  assert.equal(a.overlaps[0].from, '2022-11-01');
  assert.equal(a.overlaps[0].to, '2023-01-31');
  assert.equal(a.gaps.length, 0);
});

test('inconsistent dates are reported rather than silently dropped', () => {
  const a = analyseIntervals(
    [{ id: 'A', label: 'A', from: '2022-05-01', to: '2022-01-01', status: 'verified' }],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(a.inconsistencies.length, 1);
  assert.match(a.inconsistencies[0].reason, /before the start date/);
});

test('unverified coverage counts half; verified counts fully', () => {
  const supplied = analyseIntervals(
    [{ id: 'A', label: 'A', from: '2019-01-01', to: null, status: 'candidate_supplied' }],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(supplied.coveragePercent, 50);
  assert.equal(supplied.unverified.length, 1);
  const verified = analyseIntervals(
    [{ id: 'A', label: 'A', from: '2019-01-01', to: null, status: 'verified' }],
    PERIOD_START,
    TODAY,
    SCREENING_POLICY,
  );
  assert.equal(verified.coveragePercent, 100);
});

// ── Case evaluation ──────────────────────────────────────────

test('a freshly created case is Not started at the personal details stage', () => {
  const ev = evaluateCase(file(), SCREENING_POLICY, TODAY);
  assert.equal(ev.status, 'not_started');
  // The fixture's personal details are already complete, so the next stage is Identity.
  assert.equal(ev.currentStage, 'identity');
  assert.ok(ev.progress.overall < 100);
  const incomplete = evaluateCase(file({ candidate: candidate({ nationality: null }) }), SCREENING_POLICY, TODAY);
  assert.equal(incomplete.currentStage, 'personal');
});

test('once records exist, missing candidate information is required from the candidate', () => {
  const f = file({ candidate: candidate({ date_of_birth: null }), addresses: [address('a1', '2019-01-01', null)] });
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.equal(ev.status, 'candidate_info_required');
  assert.ok(ev.actions.some((a) => a.title === 'Candidate details incomplete' && /Date of birth/.test(a.detail ?? '')));
});

test('a fully verified file is 100% and Ready for review', () => {
  const ev = evaluateCase(completeFile(), SCREENING_POLICY, TODAY);
  assert.equal(ev.progress.overall, 100, JSON.stringify(ev.progress.sections));
  assert.equal(ev.status, 'ready_for_review');
  assert.equal(ev.currentStage, 'review');
  assert.equal(ev.systemIssues.length, 0);
  assert.equal(ev.counts.outstanding, 0);
  assert.ok(ev.actions.some((a) => a.level === 'ok' && a.title === 'SIA licence verified'));
});

test('an employment gap becomes a system issue candidate; once open it marks the case Discrepancy', () => {
  const f = completeFile();
  f.activities = [activity('e1', '2019-01-01', '2023-03-31'), activity('e2', '2023-06-01', null)];
  f.references = [reference('r1', 'e1', 'verified'), reference('r2', 'e2', 'verified')];
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  const gapIssue = ev.systemIssues.find((s) => s.issue_type === 'employment_gap');
  assert.ok(gapIssue);
  assert.equal(gapIssue.fingerprint, 'employment_gap:2023-04-01:2023-05-31');
  assert.equal(detectSystemIssues(ev.addressAnalysis, ev.activityAnalysis).length, 1);
  assert.notEqual(ev.status, 'ready_for_review');
  assert.ok(ev.progress.overall < 100, 'a detected gap must not round up to 100%');

  f.issues = [{ ...issue('i1', 'open'), fingerprint: gapIssue.fingerprint, source: 'system' }];
  const withIssue = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.equal(withIssue.status, 'discrepancy');
  assert.equal(withIssue.counts.openIssues, 1);
  assert.equal(withIssue.stages.find((s) => s.key === 'issues')?.state, 'attention');
  assert.equal(withIssue.stages.find((s) => s.key === 'activity')?.state, 'attention');
  assert.equal(withIssue.actions[0].stage, 'issues');
});

test('requested references put the case into Awaiting reference with an outstanding action', () => {
  const f = completeFile();
  f.references = [reference('r1', 'e1', 'requested')];
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.equal(ev.status, 'awaiting_reference');
  assert.ok(ev.progress.overall < 100);
  assert.ok(ev.actions.some((a) => a.title === 'Reference outstanding' && /requested 4 days ago/.test(a.detail ?? '')));
  assert.equal(ev.counts.awaitingThirdParty, 1);
});

test('supplied-but-unverified identity gives half credit and a verification action', () => {
  const f = completeFile();
  f.identityDocuments = [doc('supplied')];
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.equal(ev.progress.sections.find((s) => s.key === 'identity')?.percent, 50);
  assert.equal(ev.status, 'verification_required');
  assert.ok(ev.actions.some((a) => a.title === 'Passport awaiting verification'));
});

test('an expired identity document is flagged as high priority', () => {
  const f = completeFile();
  f.identityDocuments = [{ ...doc('verified'), expiry_date: '2025-01-01' }];
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.ok(ev.actions.some((a) => a.level === 'high' && a.title === 'Passport has expired'));
});

test('SIA is not applicable when the role has no licence type', () => {
  const f = completeFile();
  f.case = kase({ sia_licence_type: null });
  f.sia = null;
  const ev = evaluateCase(f, SCREENING_POLICY, TODAY);
  assert.equal(ev.progress.sections.find((s) => s.key === 'sia')?.applicable, false);
  assert.equal(ev.stages.find((s) => s.key === 'sia')?.state, 'complete');
  assert.equal(ev.progress.overall, 100);
});
