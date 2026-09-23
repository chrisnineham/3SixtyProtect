import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Use light text for dark backgrounds (only applies when showText is on). */
  light?: boolean;
  /** Show the "3SIXTY / PROTECT" wordmark beside the badge. Off by default. */
  showText?: boolean;
  /** Size classes for the badge mark (e.g. "h-32 w-32"). */
  markClassName?: string;
}

/** 3Sixty Protect lockup — the circular badge mark, optionally with a wordmark. */
export function Logo({
  className,
  light = false,
  showText = false,
  markClassName = 'h-10 w-10',
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={cn('shrink-0', markClassName)} />
      {showText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-[1.4rem] font-extrabold uppercase tracking-tight leading-none',
              light ? 'text-white' : 'text-ink-950',
            )}
          >
            3SIXTY
          </span>
          <span
            className={cn(
              'mt-1 font-mono text-[11px] uppercase tracking-[0.2em]',
              light ? 'text-ink-300' : 'text-ink-500',
            )}
          >
            PROTECT
          </span>
        </span>
      ) : null}
    </span>
  );
}

/**
 * The circular 3Sixty Protect badge. The source JPG sits on a dark square
 * background, so the mark is clipped to a circle and scaled slightly to trim
 * that margin — only the badge itself shows, whatever the page background.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn('relative block overflow-hidden rounded-full', className)}
      aria-hidden="true"
    >
      <Image
        src="/logos/3SIXTYLOGO.jpg"
        alt=""
        fill
        sizes="160px"
        className="scale-[1.2] object-cover"
        priority
      />
    </span>
  );
}
