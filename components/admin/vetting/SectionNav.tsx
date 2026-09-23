'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { StageState } from '@/lib/screening/engine';
import type { Stage } from '@/lib/screening/types';
import { cn } from '@/lib/utils';

const TABS: { label: string; path: string; stage?: Stage }[] = [
  { label: 'Overview', path: '' },
  { label: 'Personal', path: 'personal', stage: 'personal' },
  { label: 'Identity', path: 'identity', stage: 'identity' },
  { label: 'Right to Work', path: 'right-to-work', stage: 'right_to_work' },
  { label: 'Addresses', path: 'addresses', stage: 'addresses' },
  { label: 'Activity', path: 'activity', stage: 'activity' },
  { label: 'References', path: 'references', stage: 'references' },
  { label: 'SIA', path: 'sia', stage: 'sia' },
  { label: 'Checks', path: 'checks', stage: 'checks' },
  { label: 'Issues', path: 'issues', stage: 'issues' },
  { label: 'Evidence', path: 'evidence' },
  { label: 'Audit trail', path: 'audit' },
  { label: 'Final review', path: 'review', stage: 'review' },
];

/** Case sub-navigation. Attention states and counts are surfaced on the tab itself. */
export function SectionNav({
  caseId,
  states,
  counts,
}: {
  caseId: string;
  states: Partial<Record<Stage, StageState>>;
  counts: { issues: number; evidence: number };
}) {
  const pathname = usePathname();
  const base = `/admin/vetting/${caseId}`;

  return (
    <nav aria-label="Screening sections" className="overflow-x-auto border-b border-ink-950">
      <ul className="flex min-w-max items-stretch gap-1">
        {TABS.map((tab) => {
          const href = tab.path ? `${base}/${tab.path}` : base;
          const active = tab.path ? pathname.startsWith(href) : pathname === base;
          const state = tab.stage ? states[tab.stage] : undefined;
          const count = tab.path === 'issues' ? counts.issues : tab.path === 'evidence' ? counts.evidence : null;
          return (
            <li key={tab.path}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-1.5 border-b-2 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors',
                  active
                    ? 'border-ink-950 text-ink-950'
                    : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900',
                )}
              >
                {state === 'attention' ? (
                  <span className="h-2 w-2 rounded-full bg-error" aria-label="Attention required" />
                ) : state === 'complete' ? (
                  <span className="h-2 w-2 bg-ink-950" aria-label="Complete" />
                ) : null}
                {tab.label}
                {count !== null && count > 0 ? (
                  <span
                    className={cn(
                      'ml-0.5 min-w-[1.25rem] px-1 text-center text-[10px]',
                      tab.path === 'issues' ? 'bg-error text-white' : 'bg-ink-100 text-ink-700',
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
