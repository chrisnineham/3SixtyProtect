import { Database, ShieldOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

function Notice({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="border border-ink-950 bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-950 text-ink-900">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-heading text-lg font-semibold text-ink-900">{title}</h2>
          <div className="mt-2 space-y-2 text-sm text-ink-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shown when the screening tables are missing (migration not yet run) or the
 * service-role key is not configured. Never exposes connection details.
 */
export function SetupNotice({ reason }: { reason: 'migration' | 'config' }) {
  if (reason === 'migration') {
    return (
      <Notice icon={Database} title="Screening tables not found">
        <p>
          Run <code className="bg-ink-100 px-1 py-0.5 font-mono text-xs">supabase/screening.sql</code> in the Supabase
          SQL editor to create the Vetting &amp; Screening tables, then refresh this page. The script is safe to re-run.
        </p>
      </Notice>
    );
  }
  return (
    <Notice icon={Database} title="Screening is not configured">
      <p>
        Vetting &amp; Screening needs the Supabase service-role key so that screening records and evidence can be stored
        securely. Add <code className="bg-ink-100 px-1 py-0.5 font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> to the
        environment and restart the application.
      </p>
    </Notice>
  );
}

/** Signed in, but the role does not include the required screening capability. */
export function AccessNotice({ capability = 'view' }: { capability?: 'view' | 'manage' | 'evidence' | 'review' }) {
  const what =
    capability === 'manage'
      ? 'start or edit screenings'
      : capability === 'evidence'
        ? 'open screening evidence'
        : capability === 'review'
          ? 'record screening decisions'
          : 'view Vetting & Screening';
  return (
    <Notice icon={ShieldOff} title="Access restricted">
      <p>Your admin account is not permitted to {what}.</p>
      <p>
        Access is controlled by the account role (super admin, vetting administrator, vetting reviewer, manager) or by
        individually granted permissions. Ask a super admin if you need this changed.
      </p>
    </Notice>
  );
}
