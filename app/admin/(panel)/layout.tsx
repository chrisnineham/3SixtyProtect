import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (session.mode === 'unauthenticated' || session.mode === 'forbidden') {
    redirect('/admin/login');
  }

  return (
    <AdminShell email={session.email} demo={session.mode === 'demo'}>
      {children}
    </AdminShell>
  );
}
