import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Supabase sends people to the Site URL (the homepage) when an email link's
  // return address is not on its Redirect URLs allow-list. Catch the one-time
  // code there and finish the sign-in, so password reset still works.
  if (pathname === '/') {
    const code = searchParams.get('code');
    if (!code) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = '/admin/auth/callback';
    url.search = '';
    url.searchParams.set('code', code);
    url.searchParams.set('next', '/admin/reset-password');
    return NextResponse.redirect(url);
  }

  return await updateSession(request);
}

export const config = {
  // The admin area, plus the homepage (for stray auth codes only).
  matcher: ['/', '/admin/:path*'],
};
