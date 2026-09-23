// ─────────────────────────────────────────────────────────────
// Screening policy configuration.
//
// IMPORTANT: the numbers here are POLICY SETTINGS, not statements of what
// BS 7858 requires. They are collected in one place so 3Sixty Protect can
// confirm them against the current standard and its own internal policy,
// and so they can later be moved into per-workflow configuration.
// Nothing in the engine hard-codes these values.
// ─────────────────────────────────────────────────────────────

export interface ScreeningPolicy {
  /** History period (years) the address and activity timelines must cover. */
  screeningPeriodYears: number;
  /** Uncovered stretches up to this many days are tolerated and not flagged. */
  gapToleranceDays: number;
  /** Overlaps up to this many days are ignored (handover weeks, notice periods). */
  overlapToleranceDays: number;
  /** Activity categories that normally need a third-party reference. */
  referenceCategories: readonly string[];
  /** Number of verified identity documents needed for the identity stage. */
  requiredIdentityDocuments: number;
  /** Warn this many days before a time-limited Right to Work expires. */
  rightToWorkExpiryWarningDays: number;
  /** Warn this many days before an identity document expires. */
  documentExpiryWarningDays: number;
}

// TODO(policy): confirm each value against the current BS 7858 guidance and
// 3Sixty Protect's screening policy before relying on it operationally.
export const SCREENING_POLICY: ScreeningPolicy = {
  screeningPeriodYears: 5,
  gapToleranceDays: 31,
  overlapToleranceDays: 7,
  referenceCategories: ['employment', 'self_employment'],
  requiredIdentityDocuments: 1,
  rightToWorkExpiryWarningDays: 90,
  documentExpiryWarningDays: 60,
};

/** Checks seeded on every new case. Extensible; nothing here is mandatory by law. */
export const DEFAULT_CHECKS: { key: string; label: string; required: boolean }[] = [
  { key: 'identity', label: 'Identity verification', required: true },
  { key: 'right_to_work', label: 'Right to Work', required: true },
  { key: 'address_verification', label: 'Address verification', required: true },
  { key: 'employment_verification', label: 'Employment / activity verification', required: true },
  { key: 'sia_licence', label: 'SIA licence check', required: false },
  { key: 'supporting_documentation', label: 'Supporting documentation', required: true },
];

/** Evidence upload limits. */
export const EVIDENCE_MAX_BYTES = 10 * 1024 * 1024;
export const EVIDENCE_ALLOWED_MIME: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const EVIDENCE_BUCKET = 'screening-evidence';
