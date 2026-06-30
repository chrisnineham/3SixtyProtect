import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';

const footerNav = [
  {
    title: 'Training',
    links: [
      { label: 'Door Supervision', href: '/door-supervision' },
      { label: 'Close Protection', href: '/close-protection' },
      { label: 'Training Calendar', href: '/calendar' },
      { label: 'Book Online', href: '/book' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
      { label: 'Training Calendar', href: '/calendar' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-200">
      <div className="absolute inset-0 spotlight opacity-40" aria-hidden />
      <div className="container relative">
        {/* CTA band */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
              Ready to start your security career?
            </h2>
            <p className="mt-2 text-ink-300">
              Secure your place on an upcoming SIA course and get fully qualified
              with 3Sixty Protect.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/book">Book a Course</Button>
            <Button href="/calendar" variant="outline-light">
              View Calendar <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
              {SITE.description}
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-300 transition-colors hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-ink-300 transition-colors hover:text-sky-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-sky-500" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-ink-300 transition-colors hover:text-sky-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-sky-500" />
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-ink-300">
                <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
                {SITE.serviceArea}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-ink-400 sm:flex-row">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="transition-colors hover:text-ink-200">
              Contact
            </Link>
            <Link href="/calendar" className="transition-colors hover:text-ink-200">
              Courses
            </Link>
            <Link
              href="/admin/login"
              className="transition-colors hover:text-sky-400"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
