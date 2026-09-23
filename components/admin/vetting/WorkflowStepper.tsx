import Link from 'next/link';
import { AlertTriangle, Check } from 'lucide-react';
import type { StageState, StageStatus } from '@/lib/screening/engine';
import type { Stage } from '@/lib/screening/types';
import { cn } from '@/lib/utils';

const STATE_LABELS: Record<StageState, string> = {
  complete: 'Complete',
  in_progress: 'In progress',
  attention: 'Attention required',
  not_started: 'Not started',
};

function Glyph({ state }: { state: StageState }) {
  switch (state) {
    case 'complete':
      return (
        <span className="flex h-6 w-6 items-center justify-center bg-ink-950 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      );
    case 'in_progress':
      return (
        <span className="flex h-6 w-6 items-center justify-center border border-ink-950 bg-white">
          <span className="h-2.5 w-2.5 bg-ink-950" />
        </span>
      );
    case 'attention':
      return (
        <span className="flex h-6 w-6 items-center justify-center border border-error text-error">
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
      );
    default:
      return <span className="h-6 w-6 border border-ink-300 bg-white" />;
  }
}

/** The 11-stage BS 7858 workflow with a state glyph per stage. */
export function WorkflowStepper({
  stages,
  currentStage,
}: {
  stages: StageStatus[];
  currentStage: Stage;
}) {
  return (
    <ol className="grid grid-cols-2 gap-px border border-ink-950 bg-ink-200 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
      {stages.map((stage, i) => {
        const current = stage.key === currentStage;
        return (
          <li key={stage.key} className="bg-white">
            <Link
              href={stage.href}
              title={`${stage.label}: ${STATE_LABELS[stage.state]}${stage.detail ? ` · ${stage.detail}` : ''}`}
              className={cn(
                'flex h-full flex-col gap-2 p-3 transition-colors hover:bg-ink-50',
                current && 'bg-ink-50 ring-2 ring-inset ring-ink-950',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                <Glyph state={stage.state} />
              </div>
              <span className="font-mono text-[10px] uppercase leading-snug tracking-[0.05em] text-ink-900">
                {stage.label}
              </span>
              <span className={cn('text-[11px] leading-snug', stage.state === 'attention' ? 'text-error' : 'text-ink-500')}>
                {current ? 'Current stage' : STATE_LABELS[stage.state]}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
