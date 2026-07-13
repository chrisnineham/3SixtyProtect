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
      <div
        className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-10"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-6 font-heading text-2xl uppercase tracking-tight text-white">Owner Portal</h1>
          <p className="mt-1.5 text-sm text-ink-300">
            Sign in to manage courses and bookings.
          </p>
        </div>

        <div className="border border-ink-950 bg-background p-7 text-ink-900 sm:p-8">
          {demo ? (
            <div className="mb-6 flex items-start gap-3 border border-ink-950 px-4 py-3 text-sm text-ink-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-900" />
              <p>
                <span className="font-mono text-[11px] uppercase tracking-[0.05em]">Demo mode.</span> Connect Supabase to
                enable secure login. You can still preview the dashboard below.
              </p>
            </div>
          ) : null}

          <LoginForm />

          {demo ? (
            <Link
              href="/admin/dashboard"
              className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900 hover:underline"
            >
              Preview the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
