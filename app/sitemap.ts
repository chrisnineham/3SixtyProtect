import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const routes = [
    { path: '/', priority: 1 },
    { path: '/door-supervision', priority: 0.9 },
    { path: '/close-protection', priority: 0.9 },
    { path: '/calendar', priority: 0.8 },
    { path: '/book', priority: 0.8 },
    { path: '/contact', priority: 0.6 },
  ];

  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: r.priority,
  }));
}
