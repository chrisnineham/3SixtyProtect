// ─────────────────────────────────────────────────────────────
// Masking helpers for sensitive screening values.
// Full values are only shown inside the relevant edit form; everywhere
// else (lists, headers, audit trail) we show a masked form.
// ─────────────────────────────────────────────────────────────

/** "123456789" → "•••••6789". Keeps the last `visible` characters. */
export function maskIdentifier(value: string | null | undefined, visible = 4): string {
  if (!value) return '';
  const clean = value.replace(/\s+/g, '');
  if (clean.length <= visible) return '•'.repeat(Math.max(clean.length, 4));
  return '•'.repeat(Math.min(clean.length - visible, 8)) + clean.slice(-visible);
}

/** National Insurance numbers show only the final two digits and the suffix letter. */
export function maskNi(value: string | null | undefined): string {
  return maskIdentifier(value, 3);
}

export function ageFromDob(dob: string | null | undefined, today = new Date()): number | null {
  if (!dob) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  let age = today.getUTCFullYear() - y;
  const beforeBirthday =
    today.getUTCMonth() < mo || (today.getUTCMonth() === mo && today.getUTCDate() < d);
  if (beforeBirthday) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

/** Keys whose values must never be written to logs or the audit trail in clear. */
const SENSITIVE_KEYS = new Set([
  'ni_number',
  'document_number',
  'share_code',
  'date_of_birth',
  'licence_number',
  'sia_licence_number',
  'response',
]);

/** Shallow-copy a record for the audit trail, masking sensitive values. */
export function redactForAudit(
  obj: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!obj) return null;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (SENSITIVE_KEYS.has(key)) {
      if (value === null || value === '') out[key] = value;
      else if (key === 'date_of_birth') out[key] = '••••-••-••';
      else if (key === 'response') out[key] = '[redacted]';
      else out[key] = maskIdentifier(String(value));
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = '[object]';
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Only the keys whose value changed, for compact previous/new audit states. */
export function diffRecords(
  previous: Record<string, unknown> | null | undefined,
  next: Record<string, unknown> | null | undefined,
): { previous: Record<string, unknown> | null; next: Record<string, unknown> | null } {
  if (!previous) return { previous: null, next: redactForAudit(next) };
  if (!next) return { previous: redactForAudit(previous), next: null };
  const p: Record<string, unknown> = {};
  const n: Record<string, unknown> = {};
  const keys = Array.from(new Set([...Object.keys(previous), ...Object.keys(next)]));
  for (const key of keys) {
    if (['updated_at', 'created_at', 'updated_by'].includes(key)) continue;
    const a = previous[key] ?? null;
    const b = next[key] ?? null;
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      p[key] = a;
      n[key] = b;
    }
  }
  return { previous: redactForAudit(p), next: redactForAudit(n) };
}
