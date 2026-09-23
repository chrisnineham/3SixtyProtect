import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

const PUBLIC_AUTH_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/auth/callback',
];
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

/**
 * Refreshes the Supabase auth session on every matched request and guards the
 * admin area. When Supabase isn't configured the guard is skipped so the admin
 * UI can be previewed in demo mode.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Demo mode — no auth backend, let everything through.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // Pages a signed-out user must be able to reach: sign in and password reset.
  const isPublicAuthPage = PUBLIC_AUTH_PATHS.some((p) => path.startsWith(p));

  if (path.startsWith('/admin') && !isPublicAuthPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return response;
}
