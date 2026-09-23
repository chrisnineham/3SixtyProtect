import type { Metadata } from 'next';
import { AuthShell } from '@/components/admin/AuthShell';
import { ForgotPasswordForm } from '@/components/admin/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter the email address for your portal account."
      backHref="/admin/login"
      backLabel="Back to sign in"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
