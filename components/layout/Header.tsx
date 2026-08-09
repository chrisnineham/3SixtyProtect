'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-950 bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-mono text-[12px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2',
                isActive(link.href)
                  ? 'border-b-2 border-ink-950 pb-0.5 text-ink-950'
                  : 'text-ink-600 hover:text-ink-950',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Button href="/admin/login" size="sm">
              Login
            </Button>
          </div>
          <div className="hidden lg:block">
            <Button href="/book" size="sm">
              Book
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center border border-ink-950 bg-background text-ink-950 transition-colors hover:bg-ink-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="flex h-20 items-center justify-between border-b border-ink-950 px-4">
            <Link
              href="/"
              aria-label={`${SITE.name} home`}
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              <Logo />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center border border-ink-950 bg-background text-ink-950 transition-colors hover:bg-ink-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-4">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-baseline gap-4 border-b border-ink-200 py-4 font-heading text-3xl uppercase tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2',
                  isActive(link.href)
                    ? 'text-ink-950'
                    : 'text-ink-800 hover:text-ink-950',
                )}
              >
                <span className="font-mono text-[12px] tracking-[0.05em] text-ink-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 border-t border-ink-950 px-4 py-6">
            <Button href="/book" className="w-full">
              Book a Course
            </Button>
            <Button href="/admin/login" variant="outline" className="w-full">
              Login
            </Button>
            <a
              href={SITE.phoneHref}
              className="flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-600 transition-colors hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
