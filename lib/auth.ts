import 'server-only';

import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';

export type AdminSession =
  | { mode: 'demo'; email: null; role: null }
  | { mode: 'unauthenticated'; email: null; role: null }
  | { mode: 'forbidden'; email: string | null; role: null }
  | { mode: 'admin'; email: string; role: string };

/**
 * Resolve the current admin session.
 *  - demo            → Supabase not configured; preview the UI freely
 *  - unauthenticated → no signed-in user
 *  - forbidden       → signed in but not in admin_users
 *  - admin           → authorised admin
 */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    return { mode: 'demo', email: null, role: null };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { mode: 'unauthenticated', email: null, role: null };

  const { data: admin } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!admin) {
    return { mode: 'forbidden', email: user.email ?? null, role: null };
  }

  return {
    mode: 'admin',
    email: admin.email ?? user.email ?? '',
    role: admin.role ?? 'admin',
  };
}

/** True when the current request may perform admin writes. */
export async function canManage(): Promise<boolean> {
  const session = await getAdminSession();
  return session.mode === 'admin';
}
