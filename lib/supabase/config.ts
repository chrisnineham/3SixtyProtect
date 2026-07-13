/**
 * Central place to read Supabase env + decide whether we're "connected".
 * When not configured, the data layer transparently serves demo data so the
 * public site and admin portal remain fully browseable.
 *
 * Supports BOTH the modern API keys (publishable / secret) and the legacy
 * keys (anon / service_role). The modern keys are preferred when present, so
 * you can move to the new keys without breaking an existing legacy setup.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

/**
 * Public client key (browser + SSR, respects RLS).
 * Prefers the new `sb_publishable_…` key; falls back to the legacy anon key.
 * Both are safe to expose to the browser.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

/**
 * Server-only key that bypasses RLS for trusted admin writes.
 * Prefers the new `sb_secret_…` key; falls back to the legacy service_role key.
 * NEVER expose this to the browser (it is not prefixed NEXT_PUBLIC_).
 */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}
