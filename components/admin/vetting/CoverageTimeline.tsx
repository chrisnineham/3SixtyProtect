import type { CoverageSegment, IntervalAnalysis, SegmentKind } from '@/lib/screening/engine';
import { toDays } from '@/lib/screening/engine';
import { cn } from '@/lib/utils';
import { fmtDate } from './primitives';

// The timeline is the one place the module uses colour, as the brief asks:
// green = verified, amber = awaiting verification, red = gap / discrepancy.
const KIND_STYLES: Record<SegmentKind, { className: string; label: string }> = {
  verified: { className: 'bg-[#1f6f43]', label: 'Verified' },
  supplied: { className: 'bg-[#d29a2b]', label: 'Awaiting verification' },
  gap: { className: 'bg-error', label: 'Gap' },
  discrepancy: { className: 'bg-error bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(255,255,255,0.35)_4px_8px)]', label: 'Discrepancy' },
  tolerated: { className: 'bg-ink-200', label: 'Short break (within tolerance)' },
};

function segmentHref(seg: CoverageSegment, sectionHref: string, anchorPrefix: string, issuesHref: string): string | null {
  if (seg.kind === 'gap') return issuesHref;
  if (seg.recordId) return `${sectionHref}#${anchorPrefix}-${seg.recordId}`;
  return null;
}

/** Horizontal coverage bar for the screening period, with clickable segments and year ticks. */
export function CoverageTimeline({
  analysis,
  sectionHref,
  anchorPrefix,
  issuesHref,
  title,
  className,
}: {
  analysis: IntervalAnalysis;
  /** Page that renders the records (segments deep-link to `${sectionHref}#${anchorPrefix}-<id>`). */
  sectionHref: string;
  anchorPrefix: string;
  issuesHref: string;
  title: string;
  className?: string;
}) {
  const ps = toDays(analysis.periodStart);
  const startYear = Number(analysis.periodStart.slice(0, 4)) + 1;
  const endYear = Number(analysis.periodEnd.slice(0, 4));
  const ticks: { year: number; pct: number }[] = [];
  for (let y = startYear; y <= endYear; y++) {
    ticks.push({ year: y, pct: ((toDays(`${y}-01-01`) - ps) / analysis.periodDays) * 100 });
  }
  const pct = (days: number) => Math.round((days / analysis.periodDays) * 100);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900">{title}</p>
        <p className="text-xs text-ink-500">
          {fmtDate(analysis.periodStart)} → {fmtDate(analysis.periodEnd)} · {analysis.periodDays} days
        </p>
      </div>

      <div className="relative">
        <div className="relative h-7 w-full overflow-hidden border border-ink-950 bg-ink-100">
          {analysis.segments.map((seg, i) => {
            const style = KIND_STYLES[seg.kind];
            const href = segmentHref(seg, sectionHref, anchorPrefix, issuesHref);
            const label = `${seg.label ?? style.label}: ${fmtDate(seg.from)} → ${fmtDate(seg.to)} (${seg.days} days)`;
            const cls = cn('absolute inset-y-0 border-r border-white/60', style.className, href && 'hover:opacity-80');
            const pos = { left: `${seg.startPct}%`, width: `${Math.max(seg.widthPct, 0.4)}%` };
            return href ? (
              <a key={i} href={href} title={label} aria-label={label} className={cls} style={pos} />
            ) : (
              <span key={i} title={label} className={cls} style={pos} />
            );
          })}
        </div>
        <div className="relative mt-1 h-4">
          {ticks.map((t) => (
            <span
              key={t.year}
              className="absolute -translate-x-1/2 font-mono text-[10px] text-ink-500"
              style={{ left: `${t.pct}%` }}
            >
              {t.year}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600">
        <Legend kind="verified" text={`Verified ${pct(analysis.verifiedDays)}%`} />
        <Legend kind="supplied" text={`Awaiting verification ${pct(analysis.suppliedDays)}%`} />
        <Legend kind="gap" text={`Gaps ${pct(analysis.gapDays)}%`} />
        {analysis.discrepancyDays > 0 ? <Legend kind="discrepancy" text={`Discrepancy ${pct(analysis.discrepancyDays)}%`} /> : null}
        <Legend kind="tolerated" text="Within tolerance" />
      </div>
    </div>
  );
}

function Legend({ kind, text }: { kind: SegmentKind; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-3 w-3 border border-ink-950/20', KIND_STYLES[kind].className)} aria-hidden />
      {text}
    </span>
  );
}
