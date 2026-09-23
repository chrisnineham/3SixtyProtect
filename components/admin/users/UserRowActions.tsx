'use client';

import { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { removeUserAction, updateUserRoleAction } from '@/app/admin/_actions/users';
import { ROLE_LABELS } from '@/lib/permissions';

export function UserRowActions({
  id,
  email,
  role,
  isSelf,
  isLastAdmin,
}: {
  id: string;
  email: string;
  role: string;
  isSelf: boolean;
  isLastAdmin: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const known = Object.prototype.hasOwnProperty.call(ROLE_LABELS, role);
  const locked = isSelf || isLastAdmin;

  return (
    <div className="flex items-center justify-end gap-2">
      <form ref={formRef} action={updateUserRoleAction}>
        <input type="hidden" name="id" value={id} />
        <label className="sr-only" htmlFor={`role-${id}`}>
          Role for {email}
        </label>
        <select
          id={`role-${id}`}
          name="role"
          defaultValue={role}
          disabled={locked}
          title={locked ? 'You cannot change the role of your own account or the last admin' : undefined}
          onChange={() => formRef.current?.requestSubmit()}
          className="h-9 border border-ink-400 bg-background px-3 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-800 focus:border-2 focus:border-ink-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
        >
          {!known ? <option value={role}>{role}</option> : null}
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </form>

      <form
        action={removeUserAction}
        onSubmit={(e) => {
          if (!confirm(`Remove ${email} from the portal? Their login will be deleted.`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={locked}
          title={isSelf ? 'You cannot remove your own account' : isLastAdmin ? 'The last admin cannot be removed' : 'Remove user'}
          aria-label={`Remove ${email}`}
          className="flex h-9 w-9 items-center justify-center text-ink-500 transition-colors hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
