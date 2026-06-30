import type { Metadata } from 'next';
import { Montserrat, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/lib/constants';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'SIA Door Supervision training',
    'Door Supervisor course',
    'SIA Close Protection training',
    'Close Protection course',
    'security training',
    'SIA training provider',
    'security courses UK',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
