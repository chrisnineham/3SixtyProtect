import 'server-only';

import { cache } from 'react';
import { getAdminSession } from '@/lib/auth';
import { capabilitiesFor, type Capability } from '@/lib/permissions';

/** The signed-in administrator acting on a screening case. */
export interface ScreeningActor {
  id: string;
  email: string;
  role: string;
  caps: Set<Capability>;
}

/**
 * Resolve the current admin as a screening actor, or null if not an admin.
 * Memoised per request so the case layout and page share one session lookup.
 */
export const getScreeningActor = cache(async (): Promise<ScreeningActor | null> => {
  const session = await getAdminSession();
  if (session.mode !== 'admin') return null;
  return {
    id: session.id,
    email: session.email,
    role: session.role,
    caps: capabilitiesFor(session.role, session.permissions),
  };
});

export function can(actor: ScreeningActor | null, cap: Capability): actor is ScreeningActor {
  return Boolean(actor && actor.caps.has(cap));
}
