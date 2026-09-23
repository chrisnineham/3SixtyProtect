'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ScreeningFormState } from '@/app/admin/_actions/screening';
import { cn } from '@/lib/utils';

export const INITIAL: ScreeningFormState = { status: 'idle' };

export function SubmitButton({
  label = 'Save',
  pendingLabel = 'Saving…',
  size = 'sm',
  variant = 'primary',
  className,
}: {
  label?: string;
  pendingLabel?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'outline';
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size={size} variant={variant} disabled={pending} className={className}>
      <Save className="h-4 w-4" />
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function FormError({ state }: { state: ScreeningFormState }) {
  if (state.status !== 'error' || !state.message) return null;
  return (
    <p className="flex items-start gap-2 border border-error px-4 py-3 text-sm font-medium text-error" role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {state.message}
    </p>
  );
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-5 sm:grid-cols-2', className)}>{children}</div>;
}

export function FormFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-3 pt-1', className)}>{children}</div>;
}

export function Checkbox({
  id,
  name,
  label,
  hint,
  defaultChecked,
  required,
  error,
}: {
  id: string;
  name: string;
  label: ReactNode;
  hint?: string;
  defaultChecked?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 text-sm text-ink-900">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          required={required}
          className="mt-0.5 h-4 w-4 shrink-0 border-ink-400 accent-ink-950"
        />
        <span>
          {label}
          {hint ? <span className="mt-0.5 block text-xs text-ink-500">{hint}</span> : null}
        </span>
      </label>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Options for a status <select> driven by one of the *_META maps. */
export function MetaOptions({ meta }: { meta: Record<string, { label: string }> }) {
  return (
    <>
      {Object.entries(meta).map(([key, m]) => (
        <option key={key} value={key}>
          {m.label}
        </option>
      ))}
    </>
  );
}

/** Icon-only delete form with confirmation, for record card headers. */
export function DeleteRecordForm({
  action,
  caseId,
  id,
  confirmText = 'Remove this record? This cannot be undone.',
  title = 'Remove',
}: {
  action: (formData: FormData) => Promise<void>;
  caseId: string;
  id: string;
  confirmText?: string;
  title?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="case_id" value={caseId} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={title}
        aria-label={title}
        className="flex h-9 w-9 items-center justify-center text-ink-500 transition-colors hover:text-error"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}

/** Date-only value for a <input type="date"> from a date or timestamp string. */
export function d(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : '';
}
