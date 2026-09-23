import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

/** Dark, centred frame shared by the sign-in and password-reset pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  backHref = '/',
  backLabel = 'Back to website',
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-12 text-white">
      <div className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-10" aria-hidden />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo light />
          <h1 className="mt-6 font-heading text-2xl uppercase tracking-tight text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-300">{subtitle}</p>
        </div>

        <div className="border border-ink-950 bg-background p-7 text-ink-900 sm:p-8">{children}</div>

        <div className="mt-6 text-center">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
