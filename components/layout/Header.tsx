'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <div
        className={cn(
          'mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled
            ? 'mt-3 max-w-5xl rounded-2xl border border-ink-200/70 bg-white/85 shadow-lg shadow-ink-900/[0.06] backdrop-blur-xl'
            : 'mt-0 max-w-6xl rounded-none border border-transparent bg-transparent',
        )}
      >
        {/* Desktop */}
        <div
          className={cn(
            'hidden items-center justify-between gap-4 transition-all duration-500 lg:flex',
            scrolled ? 'h-16 px-4' : 'h-20 px-2',
          )}
        >
          <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-ink-500 hover:bg-ink-100/70 hover:text-ink-900',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={SITE.phoneHref}
              className={cn(
                'hidden items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 xl:flex',
                scrolled && 'xl:hidden',
              )}
            >
              <Phone className="h-4 w-4 text-sky-500" />
              {SITE.phone}
            </a>
            <Button href="/book" size="sm">
              Book a Course
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500 lg:hidden',
            scrolled ? 'h-14 px-3' : 'h-16 px-2',
          )}
        >
          <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn(
            'fixed inset-x-4 top-[4.75rem] z-40 origin-top rounded-2xl border border-ink-200/70 bg-white p-4 shadow-xl shadow-ink-900/10 transition-all duration-200',
            open ? 'scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
          )}
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl px-3 py-3 text-base font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-ink-800 hover:bg-ink-50',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
            <Button href="/book" className="w-full">
              Book a Course
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href={SITE.phoneHref}
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-ink-600"
            >
              <Phone className="h-4 w-4 text-sky-500" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
