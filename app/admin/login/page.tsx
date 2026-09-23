import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Info, ArrowRight } from 'lucide-react';
import { AuthShell } from '@/components/admin/AuthShell';
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
    <AuthShell title="Owner Portal" subtitle="Sign in to manage courses, bookings and screening.">
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
    </AuthShell>
  );
}
