import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from './config';

/**
 * Service-role Supabase client. SERVER ONLY — bypasses RLS.
 * Used for trusted writes (public bookings, admin course management).
 * Never import this into a client component.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
