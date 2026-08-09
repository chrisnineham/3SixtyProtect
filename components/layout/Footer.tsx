import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';

const footerNav = [
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Executive Protection', href: '/services/executive-protection' },
      {
        label: 'Risk Management',
        href: '/services/security-risk-management-consultancy',
      },
      {
        label: 'Technical Surveillance',
        href: '/services/technical-surveillance',
      },
      {
        label: 'Manpower Supply',
        href: '/services/manpower-supply-management',
      },
      {
        label: 'Private Investigations',
        href: '/services/private-investigations',
      },
    ],
  },
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
    <footer className="bg-background text-ink-900 border-t border-ink-950">
      <div className="container">
        {/* CTA band */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-ink-200 py-10 md:flex-row md:items-center md:py-12">
          <div className="max-w-xl">
            <h2 className="text-balance font-heading uppercase tracking-tight text-headline-md text-ink-900">
              Ready to start your security career?
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-500">
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
        <div className="grid grid-cols-1 gap-8 pt-12 pb-8 md:grid-cols-2 md:gap-10 md:pt-20 md:pb-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-5 max-w-xs text-lg leading-relaxed text-ink-500">
              {SITE.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 md:col-span-2 md:gap-8 lg:contents">
            {footerNav.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-400">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-ink-600 underline-offset-4 transition-colors hover:text-ink-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-400">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-ink-600 underline-offset-4 transition-colors hover:text-ink-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
                >
                  <Mail className="h-4 w-4 shrink-0 text-ink-400" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-ink-600 underline-offset-4 transition-colors hover:text-ink-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
                >
                  <Phone className="h-4 w-4 shrink-0 text-ink-400" />
                  {SITE.phone}
                </a>
              </li>
              {SITE.addresses.map((addr) => (
                <li key={addr.label} className="flex gap-3 text-ink-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span className="text-sm leading-relaxed">
                    <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">
                      {addr.label}
                    </span>
                    {addr.lines.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-6 sm:flex-row md:mt-16">
          <p className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400 transition-colors hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              Contact
            </Link>
            <Link
              href="/calendar"
              className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400 transition-colors hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              Courses
            </Link>
            <Link
              href="/privacy-policy"
              className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400 transition-colors hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              Privacy
            </Link>
            <Link
              href="/admin/login"
              className="font-mono text-[12px] uppercase tracking-[0.05em] text-ink-400 transition-colors hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
