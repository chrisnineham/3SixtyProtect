import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { isServiceRoleConfigured, isSupabaseConfigured } from '@/lib/supabase/config';
import type { Db } from './queries';

/** The screening module needs a connected database and the service-role key. */
export function isScreeningConfigured(): boolean {
  return isSupabaseConfigured() && isServiceRoleConfigured();
}

/**
 * Service-role client for screening reads/writes. SERVER ONLY.
 * Authorisation is enforced by the calling page/action via lib/screening/access.
 */
export function screeningDb(): Db {
  if (!isScreeningConfigured()) throw new Error('SCREENING_NOT_CONFIGURED');
  return createAdminClient();
}

/** True when the error means supabase/screening.sql has not been run yet. */
export function isMissingTableError(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  if (!e) return false;
  if (e.code === '42P01' || e.code === 'PGRST205') return true;
  return /relation .* does not exist|could not find the table/i.test(e.message ?? '');
}
