'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-ink-100 bg-white/85 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-ink-900'
                  : 'text-ink-500 hover:text-ink-900',
              )}
            >
              {link.label}
              {isActive(link.href) ? (
                <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-gold-400" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <Phone className="h-4 w-4 text-gold-500" />
            {SITE.phone}
          </a>
          <Button href="/book" size="sm">
            Book a Course
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 text-ink-800 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'fixed inset-x-0 top-18 z-40 origin-top border-b border-ink-100 bg-white px-5 pb-8 pt-2 shadow-card transition-all duration-200',
            open ? 'opacity-100' : '-translate-y-2 opacity-0',
          )}
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center justify-between border-b border-ink-50 py-4 text-base font-medium',
                  isActive(link.href) ? 'text-gold-600' : 'text-ink-800',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/book" className="w-full">
              Book a Course
            </Button>
            <Button href="/calendar" variant="outline" className="w-full">
              View Training Calendar
            </Button>
            <a
              href={SITE.phoneHref}
              className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-ink-600"
            >
              <Phone className="h-4 w-4 text-gold-500" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
