import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArrowLeft, Check, CheckCircle2, ChevronDown } from 'lucide-react';
import type { ActionLevel } from '@/lib/screening/engine';
import { cn, formatDate } from '@/lib/utils';

// ── Formatting helpers ───────────────────────────────────────

/** "2026-07-14" → "14 Jul 2026". Empty values render as an en dash. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '–';
  return formatDate(iso.slice(0, 10), { weekday: undefined });
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return '–';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function fmtRange(from: string | null | undefined, to: string | null | undefined): string {
  return `${fmtDate(from)} → ${to ? fmtDate(to) : 'Present'}`;
}

export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000));
}

export function fmtBytes(bytes: number | null | undefined): string {
  if (!bytes) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Layout primitives ────────────────────────────────────────

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500', className)}>
      {children}
    </p>
  );
}

export function Panel({
  id,
  title,
  description,
  actions,
  children,
  className,
}: {
  id?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('border border-ink-950 bg-white', className)}>
      {title || actions ? (
        <div className="flex flex-col gap-2 border-b border-ink-950 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-900">{title}</h2>
            ) : null}
            {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function PanelBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export interface KeyValueItem {
  label: string;
  value: ReactNode;
  span?: 1 | 2;
  /** Highlight a required value that has not been recorded. */
  missing?: boolean;
}

export function KeyValue({
  items,
  columns = 2,
  className,
}: {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : '',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className={cn('min-w-0', item.span === 2 && 'sm:col-span-2')}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">{item.label}</dt>
          <dd className={cn('mt-1 break-words text-sm text-ink-900', item.missing && 'font-medium text-error')}>
            {item.value === null || item.value === undefined || item.value === ''
              ? item.missing
                ? 'Required'
                : '–'
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <Icon className="h-8 w-8 text-ink-300" />
      <h3 className="mt-3 font-heading text-base font-semibold text-ink-900">{title}</h3>
      {text ? <p className="mt-1 max-w-md text-sm text-ink-500">{text}</p> : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

/** Flash message driven by a query-string flag, matching the existing admin toasts. */
export function Toast({
  params,
  messages,
}: {
  params: Record<string, string | string[] | undefined>;
  messages: Record<string, string>;
}) {
  const key = Object.keys(messages).find((k) => params[k]);
  if (!key) return null;
  return (
    <p className="flex items-center gap-2 border border-ink-950 bg-ink-950 px-4 py-3 text-sm font-medium text-white">
      <CheckCircle2 className="h-4 w-4" />
      {messages[key]}
    </p>
  );
}

export function ProgressBar({
  percent,
  size = 'md',
  showLabel = false,
  className,
}: {
  percent: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('relative w-full overflow-hidden border border-ink-950 bg-ink-100', size === 'sm' ? 'h-2' : 'h-3')}
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="absolute inset-y-0 left-0 bg-ink-950" style={{ width: `${p}%` }} />
      </div>
      {showLabel ? (
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-900">{p}%</span>
      ) : null}
    </div>
  );
}

export function KpiTile({
  label,
  value,
  hint,
  href,
  attention = false,
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  attention?: boolean;
}) {
  const inner = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500">{label}</p>
      <p
        className={cn(
          'mt-2 font-heading text-3xl tracking-tight',
          attention && Number(value) > 0 ? 'text-error' : 'text-ink-900',
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </>
  );
  const cls = 'block border border-ink-950 bg-white p-4 transition-colors';
  return href ? (
    <Link href={href} className={cn(cls, 'hover:bg-ink-50')}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/**
 * Native <details> disclosure. No client state, so it works inside server
 * pages; give it a `key` that changes on save to close it after a redirect.
 */
export function Disclosure({
  summary,
  icon: Icon,
  defaultOpen = false,
  variant = 'outline',
  children,
  className,
}: {
  summary: string;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  variant?: 'outline' | 'solid' | 'ghost';
  children: ReactNode;
  className?: string;
}) {
  const summaryCls =
    variant === 'solid'
      ? 'border border-ink-950 bg-ink-950 text-white hover:bg-background hover:text-ink-950'
      : variant === 'ghost'
        ? 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
        : 'border border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-white';
  return (
    <details open={defaultOpen} className={cn('group', className)}>
      <summary
        className={cn(
          'inline-flex cursor-pointer select-none list-none items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors [&::-webkit-details-marker]:hidden',
          summaryCls,
        )}
      >
        {Icon ? <Icon className="h-4 w-4" /> : null}
        {summary}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500 transition-colors hover:text-ink-900"
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}

/** Stage-page intro: title, guidance and (optionally) the engine's progress detail. */
export function SectionIntro({
  title,
  text,
  detail,
  children,
}: {
  title: string;
  text: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-ink-900">{title}</h2>
        <p className="mt-1 text-sm text-ink-600">{text}</p>
        {detail ? <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500">{detail}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

/** A record card with an anchor id so outstanding actions can deep-link to it. */
export function RecordCard({
  id,
  children,
  actions,
  footer,
  attention = false,
  className,
}: {
  id: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  attention?: boolean;
  className?: string;
}) {
  return (
    <article
      id={id}
      className={cn('scroll-mt-28 border bg-white', attention ? 'border-error' : 'border-ink-950', className)}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">{children}</div>
        {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
      </div>
      {footer ? <div className="border-t border-ink-200 px-4 py-3">{footer}</div> : null}
    </article>
  );
}

export const LEVEL_LABELS: Record<ActionLevel, string> = {
  high: 'Needs attention',
  medium: 'Outstanding',
  low: 'Follow up',
  ok: 'Verified',
};

/** Priority marker for actions: red = attention, black = outstanding, grey = follow-up, tick = verified. */
export function LevelDot({ level, className }: { level: ActionLevel; className?: string }) {
  if (level === 'ok') {
    return (
      <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center bg-ink-950 text-white', className)} aria-hidden>
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  const tone = level === 'high' ? 'bg-error' : level === 'medium' ? 'bg-ink-900' : 'bg-ink-400';
  return <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', tone, className)} aria-hidden />;
}
