import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Info, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from '@/components/admin/LoginForm';
import { getAdminSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session.mode === 'admin') redirect('/admin/dashboard');

  const demo = session.mode === 'demo';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-12 text-white">
      <div className="absolute inset-0 spotlight" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-25"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-6 text-2xl font-bold text-white">Owner Portal</h1>
          <p className="mt-1.5 text-sm text-ink-300">
            Sign in to manage courses and bookings.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 text-ink-900 shadow-2xl sm:p-8">
          {demo ? (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-gold-50 px-4 py-3 text-sm text-ink-700 ring-1 ring-gold-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <p>
                <span className="font-semibold">Demo mode.</span> Connect Supabase to
                enable secure login. You can still preview the dashboard below.
              </p>
            </div>
          ) : null}

          <LoginForm />

          {demo ? (
            <Link
              href="/admin/dashboard"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-gold-700 hover:underline"
            >
              Preview the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
