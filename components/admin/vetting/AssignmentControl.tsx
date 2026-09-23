'use client';

import { useRef } from 'react';
import { assignCaseAction } from '@/app/admin/_actions/screening';
import type { AdminUserLite } from '@/lib/screening/types';

/** Auto-submitting assignee select, mirroring BookingStatusControl. */
export function AssignmentControl({
  caseId,
  assignedTo,
  admins,
  disabled = false,
}: {
  caseId: string;
  assignedTo: string | null;
  admins: AdminUserLite[];
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={assignCaseAction} className="flex items-center">
      <input type="hidden" name="case_id" value={caseId} />
      <label className="sr-only" htmlFor={`assign-${caseId}`}>
        Assigned screening administrator
      </label>
      <select
        id={`assign-${caseId}`}
        name="assigned_to"
        defaultValue={assignedTo ?? ''}
        disabled={disabled}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 max-w-[16rem] border border-ink-400 bg-background px-3 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-800 transition-colors focus:border-2 focus:border-ink-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
      >
        <option value="">Unassigned</option>
        {admins.map((a) => (
          <option key={a.id} value={a.id}>
            {a.email}
          </option>
        ))}
      </select>
    </form>
  );
}
