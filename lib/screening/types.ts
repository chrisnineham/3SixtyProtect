// ─────────────────────────────────────────────────────────────
// Vetting & Screening domain types — mirror supabase/screening.sql
// ─────────────────────────────────────────────────────────────

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'gold' | 'ink';

export type CaseStatus =
  | 'not_started'
  | 'candidate_info_required'
  | 'in_progress'
  | 'awaiting_reference'
  | 'verification_required'
  | 'discrepancy'
  | 'ready_for_review'
  | 'completed'
  | 'withdrawn'
  | 'rejected';

export const TERMINAL_STATUSES: CaseStatus[] = ['completed', 'withdrawn', 'rejected'];

export const CASE_STATUS_META: Record<CaseStatus, { label: string; tone: BadgeTone }> = {
  not_started: { label: 'Not started', tone: 'neutral' },
  candidate_info_required: { label: 'Candidate information required', tone: 'warning' },
  in_progress: { label: 'In progress', tone: 'neutral' },
  awaiting_reference: { label: 'Awaiting reference', tone: 'warning' },
  verification_required: { label: 'Verification required', tone: 'warning' },
  discrepancy: { label: 'Discrepancy', tone: 'danger' },
  ready_for_review: { label: 'Ready for review', tone: 'success' },
  completed: { label: 'Completed', tone: 'ink' },
  withdrawn: { label: 'Withdrawn', tone: 'neutral' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export type Stage =
  | 'personal'
  | 'identity'
  | 'right_to_work'
  | 'addresses'
  | 'activity'
  | 'references'
  | 'sia'
  | 'checks'
  | 'issues'
  | 'review'
  | 'complete';

/** Workflow stages in display order, with the case sub-route for each. */
export const STAGES: { key: Stage; label: string; path: string }[] = [
  { key: 'personal', label: 'Personal details', path: 'personal' },
  { key: 'identity', label: 'Identity', path: 'identity' },
  { key: 'right_to_work', label: 'Right to Work', path: 'right-to-work' },
  { key: 'addresses', label: 'Address history', path: 'addresses' },
  { key: 'activity', label: 'Employment / activity', path: 'activity' },
  { key: 'references', label: 'References & verification', path: 'references' },
  { key: 'sia', label: 'SIA licence', path: 'sia' },
  { key: 'checks', label: 'Additional checks', path: 'checks' },
  { key: 'issues', label: 'Issues & discrepancies', path: 'issues' },
  { key: 'review', label: 'Final review', path: 'review' },
  { key: 'complete', label: 'Complete', path: 'review' },
];

export function stagePath(stage: Stage): string {
  return STAGES.find((s) => s.key === stage)?.path ?? 'personal';
}

export type RecordSource = 'admin' | 'candidate' | 'system' | 'referee';

export const SOURCE_LABELS: Record<RecordSource, string> = {
  admin: 'Entered by 3Sixty',
  candidate: 'Candidate supplied',
  system: 'System',
  referee: 'Referee supplied',
};

export type VerificationStatus =
  | 'candidate_supplied'
  | 'verification_required'
  | 'verified'
  | 'unable_to_verify'
  | 'discrepancy';

export const VERIFICATION_STATUS_META: Record<VerificationStatus, { label: string; tone: BadgeTone }> = {
  candidate_supplied: { label: 'Candidate supplied', tone: 'warning' },
  verification_required: { label: 'Verification required', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  unable_to_verify: { label: 'Unable to verify', tone: 'danger' },
  discrepancy: { label: 'Discrepancy', tone: 'danger' },
};

export type IdentityStatus = 'not_supplied' | 'supplied' | 'verification_required' | 'verified' | 'failed';

export const IDENTITY_STATUS_META: Record<IdentityStatus, { label: string; tone: BadgeTone }> = {
  not_supplied: { label: 'Not supplied', tone: 'neutral' },
  supplied: { label: 'Supplied', tone: 'warning' },
  verification_required: { label: 'Verification required', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
};

export const IDENTITY_DOCUMENT_TYPES = [
  'Passport',
  'Driving licence',
  'Birth certificate',
  'National identity card',
  'Biometric residence permit',
  'Other identity evidence',
];

export type RtwStatus = 'outstanding' | 'verified' | 'time_limited' | 'failed';

export const RTW_STATUS_META: Record<RtwStatus, { label: string; tone: BadgeTone }> = {
  outstanding: { label: 'Outstanding', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  time_limited: { label: 'Time limited', tone: 'warning' },
  failed: { label: 'Failed', tone: 'danger' },
};

export const RTW_CHECK_TYPES = [
  'Manual document check',
  'Online share code check',
  'Identity service provider (IDSP) check',
  'Employer Checking Service',
  'Other',
];

export type ReferenceStatus =
  | 'not_requested'
  | 'requested'
  | 'awaiting_response'
  | 'received'
  | 'source_verification_required'
  | 'verified'
  | 'unable_to_verify'
  | 'discrepancy';

export const REFERENCE_STATUS_META: Record<ReferenceStatus, { label: string; tone: BadgeTone }> = {
  not_requested: { label: 'Not requested', tone: 'neutral' },
  requested: { label: 'Requested', tone: 'warning' },
  awaiting_response: { label: 'Awaiting response', tone: 'warning' },
  received: { label: 'Received', tone: 'warning' },
  source_verification_required: { label: 'Source verification required', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  unable_to_verify: { label: 'Unable to verify', tone: 'danger' },
  discrepancy: { label: 'Discrepancy', tone: 'danger' },
};

export type SiaStatus = 'awaiting_check' | 'valid' | 'expired' | 'suspended' | 'revoked' | 'unable_to_verify';

export const SIA_STATUS_META: Record<SiaStatus, { label: string; tone: BadgeTone }> = {
  awaiting_check: { label: 'Awaiting check', tone: 'warning' },
  valid: { label: 'Valid', tone: 'success' },
  expired: { label: 'Expired', tone: 'danger' },
  suspended: { label: 'Suspended', tone: 'danger' },
  revoked: { label: 'Revoked', tone: 'danger' },
  unable_to_verify: { label: 'Unable to verify', tone: 'danger' },
};

/** SIA licence sectors. Extensible; the first two mirror the training courses. */
export const SIA_LICENCE_TYPES = [
  'Door Supervision',
  'Close Protection',
  'Security Guarding',
  'Public Space Surveillance (CCTV)',
  'Key Holding',
  'Cash and Valuables in Transit',
  'Vehicle Immobilisation',
  'Non-front line',
];

export type CheckStatus = 'not_required' | 'pending' | 'complete' | 'verified' | 'failed';

export const CHECK_STATUS_META: Record<CheckStatus, { label: string; tone: BadgeTone }> = {
  not_required: { label: 'Not required', tone: 'neutral' },
  pending: { label: 'Pending', tone: 'warning' },
  complete: { label: 'Complete', tone: 'success' },
  verified: { label: 'Verified', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
};

export type IssueStatus =
  | 'open'
  | 'awaiting_candidate'
  | 'awaiting_third_party'
  | 'under_review'
  | 'resolved'
  | 'accepted_risk';

export const ISSUE_STATUS_META: Record<IssueStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Open', tone: 'danger' },
  awaiting_candidate: { label: 'Awaiting candidate', tone: 'warning' },
  awaiting_third_party: { label: 'Awaiting third party', tone: 'warning' },
  under_review: { label: 'Under review', tone: 'warning' },
  resolved: { label: 'Resolved', tone: 'success' },
  accepted_risk: { label: 'Accepted risk', tone: 'ink' },
};

export const UNRESOLVED_ISSUE_STATUSES: IssueStatus[] = [
  'open',
  'awaiting_candidate',
  'awaiting_third_party',
  'under_review',
];

export type IssueSeverity = 'low' | 'medium' | 'high';

export const ISSUE_SEVERITY_META: Record<IssueSeverity, { label: string; tone: BadgeTone }> = {
  low: { label: 'Low', tone: 'neutral' },
  medium: { label: 'Medium', tone: 'warning' },
  high: { label: 'High', tone: 'danger' },
};

export type IssueType =
  | 'employment_gap'
  | 'address_gap'
  | 'conflicting_dates'
  | 'reference_discrepancy'
  | 'unable_to_verify_employer'
  | 'missing_documentation'
  | 'identity_discrepancy'
  | 'right_to_work_issue'
  | 'expired_document'
  | 'sia_issue'
  | 'other';

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  employment_gap: 'Employment gap',
  address_gap: 'Address gap',
  conflicting_dates: 'Conflicting dates',
  reference_discrepancy: 'Reference discrepancy',
  unable_to_verify_employer: 'Unable to verify employer',
  missing_documentation: 'Missing documentation',
  identity_discrepancy: 'Identity discrepancy',
  right_to_work_issue: 'Right to Work issue',
  expired_document: 'Expired document',
  sia_issue: 'SIA issue',
  other: 'Other',
};

export type ActivityCategory =
  | 'employment'
  | 'self_employment'
  | 'education'
  | 'unemployment'
  | 'job_seeking'
  | 'government_benefits'
  | 'travelling'
  | 'career_break'
  | 'overseas'
  | 'other';

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  employment: 'Employment',
  self_employment: 'Self-employment',
  education: 'Education',
  unemployment: 'Unemployment',
  job_seeking: 'Job seeking',
  government_benefits: 'Government benefits',
  travelling: 'Travelling',
  career_break: 'Career break',
  overseas: 'Overseas',
  other: 'Other',
};

export type ReviewDecision =
  | 'complete'
  | 'further_information_required'
  | 'escalate'
  | 'withdrawn'
  | 'reject';

export const REVIEW_DECISION_META: Record<ReviewDecision, { label: string; tone: BadgeTone }> = {
  complete: { label: 'Screening complete', tone: 'success' },
  further_information_required: { label: 'Further information required', tone: 'warning' },
  escalate: { label: 'Escalate for review', tone: 'warning' },
  withdrawn: { label: 'Withdrawn', tone: 'neutral' },
  reject: { label: 'Reject', tone: 'danger' },
};

export const EVIDENCE_CATEGORIES = [
  'Passport / ID',
  'Right to Work documentation',
  'Address evidence',
  'Employer reference',
  'Employer confirmation',
  'Candidate declaration',
  'Letter',
  'SIA evidence',
  'Supporting document',
  'Other screening evidence',
];

// ── Records ─────────────────────────────────────────────────

interface Attributable {
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScreeningCandidate extends Attributable {
  id: string;
  legal_name: string;
  previous_names: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  email: string | null;
  telephone: string | null;
  ni_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  town: string | null;
  postcode: string | null;
  country: string | null;
  sia_licence_number: string | null;
  linked_booking_id: string | null;
  source: RecordSource;
}

export interface AdminUserLite {
  id: string;
  email: string;
  role?: string;
}

export interface ScreeningCase extends Attributable {
  id: string;
  reference: string;
  candidate_id: string;
  workflow: string;
  status: CaseStatus;
  current_stage: Stage;
  proposed_role: string | null;
  sia_licence_type: string | null;
  proposed_start_date: string | null;
  screening_start_date: string;
  assigned_to: string | null;
  screening_period_years: number;
  progress_percent: number;
  outstanding_count: number;
  awaiting_candidate_count: number;
  awaiting_third_party_count: number;
  open_issue_count: number;
  unverified_period_count: number;
  locked: boolean;
  completed_at: string | null;
  decision: ReviewDecision | null;
  decision_at: string | null;
  reviewed_by: string | null;
  withdrawn_reason: string | null;
  candidate?: ScreeningCandidate | null;
  assignee?: AdminUserLite | null;
}

export interface ScreeningAddress extends Attributable {
  id: string;
  case_id: string;
  address_line_1: string;
  address_line_2: string | null;
  town: string | null;
  postcode: string | null;
  country: string | null;
  from_date: string;
  to_date: string | null;
  is_current: boolean;
  verification_status: VerificationStatus;
  verification_method: string | null;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
  source: RecordSource;
}

export interface ScreeningActivity extends Attributable {
  id: string;
  case_id: string;
  category: ActivityCategory;
  organisation: string;
  position: string | null;
  address: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_telephone: string | null;
  from_date: string;
  to_date: string | null;
  reason_for_leaving: string | null;
  requires_reference: boolean;
  verification_status: VerificationStatus;
  verification_method: string | null;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
  source: RecordSource;
}

export interface ScreeningReference extends Attributable {
  id: string;
  case_id: string;
  activity_id: string | null;
  organisation: string;
  contact_name: string | null;
  contact_position: string | null;
  email: string | null;
  telephone: string | null;
  status: ReferenceStatus;
  requested_at: string | null;
  received_at: string | null;
  method: string | null;
  source_verified: boolean;
  source_verification_method: string | null;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
  request_token: string | null;
  request_token_expires_at: string | null;
  response: unknown;
  source: RecordSource;
}

export interface IdentityDocument extends Attributable {
  id: string;
  case_id: string;
  document_type: string;
  document_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  issuing_country: string | null;
  status: IdentityStatus;
  verification_method: string | null;
  checked_by: string | null;
  checked_at: string | null;
  notes: string | null;
  source: RecordSource;
}

export interface RightToWork extends Attributable {
  id: string;
  case_id: string;
  check_type: string | null;
  status: RtwStatus;
  checked_at: string | null;
  checked_by: string | null;
  expiry_date: string | null;
  share_code: string | null;
  restrictions: string | null;
  notes: string | null;
  source: RecordSource;
}

export interface SiaCheck extends Attributable {
  id: string;
  case_id: string;
  licence_number: string | null;
  licence_holder: string | null;
  licence_type: string | null;
  status: SiaStatus;
  issue_date: string | null;
  expiry_date: string | null;
  checked_at: string | null;
  checked_by: string | null;
  check_method: string | null;
  result_notes: string | null;
  source: RecordSource;
}

export interface ScreeningCheck extends Attributable {
  id: string;
  case_id: string;
  check_key: string;
  label: string;
  required: boolean;
  status: CheckStatus;
  notes: string | null;
  checked_by: string | null;
  checked_at: string | null;
  sort_order: number;
}

export interface ScreeningIssue extends Attributable {
  id: string;
  case_id: string;
  issue_type: IssueType;
  title: string;
  description: string | null;
  severity: IssueSeverity;
  status: IssueStatus;
  section: Stage | null;
  related_record_id: string | null;
  period_from: string | null;
  period_to: string | null;
  raised_by: string | null;
  raised_at: string;
  assigned_to: string | null;
  candidate_explanation: string | null;
  resolution: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  source: RecordSource;
  fingerprint: string | null;
}

export interface ScreeningEvidence {
  id: string;
  case_id: string;
  category: string;
  section: Stage | null;
  related_record_type: string | null;
  related_record_id: string | null;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  description: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface ScreeningReview {
  id: string;
  case_id: string;
  reviewer_id: string | null;
  reviewer_email: string | null;
  decision: ReviewDecision;
  comments: string | null;
  acknowledged: boolean;
  reviewed_at: string;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  case_id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  section: Stage | null;
  record_type: string | null;
  record_id: string | null;
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

/** Everything the engine and the case pages need for one screening. */
export interface CaseFile {
  case: ScreeningCase;
  candidate: ScreeningCandidate;
  addresses: ScreeningAddress[];
  activities: ScreeningActivity[];
  references: ScreeningReference[];
  identityDocuments: IdentityDocument[];
  rightToWork: RightToWork | null;
  sia: SiaCheck | null;
  checks: ScreeningCheck[];
  issues: ScreeningIssue[];
  evidence: ScreeningEvidence[];
  reviews: ScreeningReview[];
}

/** Human-readable audit action labels (the stored value is the key). */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  screening_created: 'Screening created',
  candidate_details_updated: 'Candidate details updated',
  case_updated: 'Case updated',
  case_assigned: 'Case assigned',
  address_added: 'Address added',
  address_updated: 'Address updated',
  address_removed: 'Address removed',
  activity_added: 'Employment / activity added',
  activity_updated: 'Employment / activity updated',
  activity_removed: 'Employment / activity removed',
  reference_added: 'Reference added',
  reference_updated: 'Reference updated',
  reference_removed: 'Reference removed',
  verification_requested: 'Verification requested',
  reference_received: 'Reference received',
  reference_verified: 'Reference verified',
  identity_document_added: 'Identity document added',
  identity_document_updated: 'Identity document updated',
  identity_document_removed: 'Identity document removed',
  right_to_work_updated: 'Right to Work updated',
  sia_check_updated: 'SIA licence check updated',
  check_updated: 'Check updated',
  check_added: 'Check added',
  check_completed: 'Check completed',
  issue_raised: 'Issue raised',
  issue_updated: 'Issue updated',
  issue_resolved: 'Issue resolved',
  evidence_uploaded: 'Document uploaded',
  evidence_removed: 'Document removed',
  screening_submitted: 'Screening submitted for review',
  screening_completed: 'Screening completed',
  screening_withdrawn: 'Screening withdrawn',
  screening_rejected: 'Screening rejected',
  screening_reopened: 'Screening reopened',
  review_recorded: 'Review recorded',
};
