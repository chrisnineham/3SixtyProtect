import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Use light text for dark backgrounds. */
  light?: boolean;
  showText?: boolean;
}

/** 3Sixty Protect lockup — shield mark with a 360° arc motif + wordmark. */
export function Logo({ className, light = false, showText = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {showText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-[1.35rem] font-extrabold tracking-tight',
              light ? 'text-white' : 'text-ink-900',
            )}
          >
            3Sixty
            <span className="text-gold-400">.</span>
          </span>
          <span
            className={cn(
              'text-[0.62rem] font-semibold uppercase tracking-[0.34em]',
              light ? 'text-ink-300' : 'text-ink-400',
            )}
          >
            Protect
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Shield body */}
      <path
        d="M24 3.5 41 9.2v12.1c0 11.2-7.1 19.3-17 23.2-9.9-3.9-17-12-17-23.2V9.2L24 3.5Z"
        className="fill-ink-900"
      />
      <path
        d="M24 3.5 41 9.2v12.1c0 11.2-7.1 19.3-17 23.2-9.9-3.9-17-12-17-23.2V9.2L24 3.5Z"
        className="stroke-gold-400"
        strokeWidth="1.5"
        opacity="0.55"
      />
      {/* 360 arc */}
      <path
        d="M32 24a8 8 0 1 1-3.2-6.4"
        className="stroke-gold-400"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="m28 12 1.4 5.7-5.7 1"
        className="stroke-gold-400"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Centre core */}
      <circle cx="24" cy="24" r="3" className="fill-gold-400" />
    </svg>
  );
}
