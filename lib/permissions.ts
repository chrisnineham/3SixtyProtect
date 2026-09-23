// ─────────────────────────────────────────────────────────────
// Role → capability mapping for the admin portal.
//
// Roles are values of admin_users.role (free text today). The existing
// 'admin' role keeps full access so nobody is locked out by this module.
// admin_users.permissions (text[]) can grant individual capabilities to a
// user on top of their role ("Standard admin user" in the spec).
// ─────────────────────────────────────────────────────────────

export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'vetting_admin'
  | 'vetting_reviewer'
  | 'manager'
  | 'standard';

export type Capability =
  | 'screening.view' // see the queue, case summaries and progress
  | 'screening.manage' // create cases, add and edit screening records
  | 'screening.review' // record a final review decision
  | 'screening.evidence' // open / upload sensitive evidence files
  | 'screening.reopen'; // reopen a completed case

export const ALL_CAPABILITIES: Capability[] = [
  'screening.view',
  'screening.manage',
  'screening.review',
  'screening.evidence',
  'screening.reopen',
];

const ROLE_CAPABILITIES: Record<AdminRole, Capability[]> = {
  super_admin: ALL_CAPABILITIES,
  admin: ALL_CAPABILITIES,
  vetting_admin: ['screening.view', 'screening.manage', 'screening.evidence'],
  vetting_reviewer: ['screening.view', 'screening.review', 'screening.evidence', 'screening.reopen'],
  // Managers see status and progress but not the sensitive documents.
  manager: ['screening.view'],
  standard: [],
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super admin',
  admin: 'Admin',
  vetting_admin: 'Vetting administrator',
  vetting_reviewer: 'Vetting reviewer',
  manager: 'Manager',
  standard: 'Standard admin user',
};

function isAdminRole(role: string): role is AdminRole {
  return Object.prototype.hasOwnProperty.call(ROLE_CAPABILITIES, role);
}

function isCapability(value: string): value is Capability {
  return (ALL_CAPABILITIES as string[]).includes(value);
}

/** Capabilities for a role plus any individually granted permissions. */
export function capabilitiesFor(
  role: string | null | undefined,
  permissions: readonly string[] = [],
): Set<Capability> {
  const caps = new Set<Capability>();
  if (role && isAdminRole(role)) {
    for (const cap of ROLE_CAPABILITIES[role]) caps.add(cap);
  }
  for (const p of permissions) {
    if (isCapability(p)) caps.add(p);
  }
  return caps;
}
