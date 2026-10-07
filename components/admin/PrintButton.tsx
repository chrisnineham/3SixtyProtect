'use client';

import type { ReactNode } from 'react';

export function PrintButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 border border-ink-950 bg-ink-950 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.05em] text-white transition-colors hover:bg-background hover:text-ink-950"
    >
      {children}
    </button>
  );
}
