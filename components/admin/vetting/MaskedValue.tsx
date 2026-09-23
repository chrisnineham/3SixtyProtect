'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Masked sensitive value. The full value is only passed in (and therefore
 * only sent to the browser) for users who may edit the record; everyone else
 * sees the mask with no reveal control.
 */
export function MaskedValue({
  value,
  masked,
  label,
}: {
  value?: string | null;
  masked: string | null | undefined;
  label: string;
}) {
  const [shown, setShown] = useState(false);
  if (!masked) return <span className="text-ink-500">–</span>;
  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm text-ink-900">
      <span className={shown ? '' : 'tracking-[0.15em]'}>{shown && value ? value : masked}</span>
      {value ? (
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={`${shown ? 'Hide' : 'Reveal'} ${label}`}
          title={shown ? 'Hide' : 'Reveal'}
          className="flex h-6 w-6 items-center justify-center text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
        >
          {shown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      ) : null}
    </span>
  );
}
