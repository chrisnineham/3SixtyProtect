import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE } from '@/lib/constants';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  areaServed: 'GB',
  knowsAbout: [
    'SIA Door Supervision training',
    'SIA Close Protection training',
    'Security training',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'SIA Security Training Courses',
    itemListElement: [
      {
        '@type': 'Course',
        name: 'SIA Door Supervision Training',
        description:
          'Level 2 SIA Door Supervisor qualification — your route to an SIA licence.',
        provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      },
      {
        '@type': 'Course',
        name: 'SIA Close Protection Training',
        description:
          'Level 3 SIA Close Protection qualification for professional protection officers.',
        provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      },
    ],
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
