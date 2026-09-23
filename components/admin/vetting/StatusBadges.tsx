import { Badge } from '@/components/ui/Badge';
import {
  CASE_STATUS_META,
  CHECK_STATUS_META,
  IDENTITY_STATUS_META,
  ISSUE_SEVERITY_META,
  ISSUE_STATUS_META,
  REFERENCE_STATUS_META,
  REVIEW_DECISION_META,
  RTW_STATUS_META,
  SIA_STATUS_META,
  SOURCE_LABELS,
  VERIFICATION_STATUS_META,
  type BadgeTone,
  type CaseStatus,
  type CheckStatus,
  type IdentityStatus,
  type IssueSeverity,
  type IssueStatus,
  type RecordSource,
  type ReferenceStatus,
  type ReviewDecision,
  type RtwStatus,
  type SiaStatus,
  type VerificationStatus,
} from '@/lib/screening/types';

function MetaBadge({ meta }: { meta: { label: string; tone: BadgeTone } | undefined }) {
  if (!meta) return null;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return <MetaBadge meta={CASE_STATUS_META[status]} />;
}
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return <MetaBadge meta={VERIFICATION_STATUS_META[status]} />;
}
export function IdentityStatusBadge({ status }: { status: IdentityStatus }) {
  return <MetaBadge meta={IDENTITY_STATUS_META[status]} />;
}
export function RtwStatusBadge({ status }: { status: RtwStatus }) {
  return <MetaBadge meta={RTW_STATUS_META[status]} />;
}
export function ReferenceStatusBadge({ status }: { status: ReferenceStatus }) {
  return <MetaBadge meta={REFERENCE_STATUS_META[status]} />;
}
export function SiaStatusBadge({ status }: { status: SiaStatus }) {
  return <MetaBadge meta={SIA_STATUS_META[status]} />;
}
export function CheckStatusBadge({ status }: { status: CheckStatus }) {
  return <MetaBadge meta={CHECK_STATUS_META[status]} />;
}
export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return <MetaBadge meta={ISSUE_STATUS_META[status]} />;
}
export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return <MetaBadge meta={ISSUE_SEVERITY_META[severity]} />;
}
export function DecisionBadge({ decision }: { decision: ReviewDecision }) {
  return <MetaBadge meta={REVIEW_DECISION_META[decision]} />;
}

/** Shown only when a value did not come from a 3Sixty administrator. */
export function SourceBadge({ source }: { source: RecordSource }) {
  if (source === 'admin') return null;
  return <Badge tone={source === 'system' ? 'neutral' : 'warning'}>{SOURCE_LABELS[source]}</Badge>;
}
