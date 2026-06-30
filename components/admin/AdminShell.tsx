'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { signOutAction } from '@/app/admin/_actions/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { label: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
];

export function AdminShell({
  email,
  demo,
  children,
}: {
  email: string | null;
  demo: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-18 items-center px-6">
        <Link href="/admin/dashboard">
          <Logo light />
        </Link>
      </div>

      {demo ? (
        <div className="mx-4 mb-2 rounded-lg bg-gold-400/10 px-3 py-2 text-center text-xs font-semibold text-gold-400 ring-1 ring-gold-400/25">
          Demo mode · read-only
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-white/10 text-white'
                : 'text-ink-300 hover:bg-white/5 hover:text-white',
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}

        <Link
          href="/admin/courses/new"
          onClick={() => setOpen(false)}
          className="mt-3 flex items-center gap-3 rounded-xl bg-gold-400 px-3 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-300"
        >
          <PlusCircle className="h-5 w-5" />
          New course
        </Link>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" />
          View website
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs text-ink-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-white">
              {email ?? 'Demo admin'}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink-950 lg:block">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 lg:hidden">
        <Link href="/admin/dashboard">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-ink-950">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      {/* Content */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
