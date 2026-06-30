import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conditional logic, de-duping conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in GBP. Whole numbers drop the decimals. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format an ISO date (YYYY-MM-DD) into a friendly UK string.
 * e.g. "2026-07-14" -> "Tue 14 Jul 2026"
 */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(date);
}

/** Render a start–end date range compactly. */
export function formatDateRange(startIso: string, endIso: string): string {
  if (!endIso || startIso === endIso) return formatDate(startIso);
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return formatDate(startIso);
  }
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' });
    const tail = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${day.format(start)}–${tail.format(end)}`;
  }
  return `${formatDate(startIso, { weekday: undefined })} – ${formatDate(endIso, {
    weekday: undefined,
  })}`;
}

/** "09:00" + "17:00" -> "09:00 – 17:00" */
export function formatTimeRange(start?: string | null, end?: string | null): string {
  const clean = (t?: string | null) => (t ? t.slice(0, 5) : '');
  if (!start && !end) return '';
  if (start && end) return `${clean(start)} – ${clean(end)}`;
  return clean(start ?? end);
}

/** Number of days inclusive between two ISO dates. */
export function durationInDays(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso || startIso}T00:00:00`);
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, diff + 1);
}

/** Build an absolute URL against the configured site origin. */
export function absoluteUrl(path = ''): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
