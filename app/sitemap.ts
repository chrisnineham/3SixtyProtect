import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { DETAIL_SERVICES } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const routes = [
    { path: '/', priority: 1 },
    { path: '/services', priority: 0.9 },
    { path: '/door-supervision', priority: 0.9 },
    { path: '/close-protection', priority: 0.9 },
    { path: '/calendar', priority: 0.8 },
    { path: '/book', priority: 0.8 },
    { path: '/contact', priority: 0.6 },
    ...DETAIL_SERVICES.map((s) => ({
      path: '/services/' + s.slug,
      priority: 0.8,
    })),
  ];

  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: r.priority,
  }));
}
