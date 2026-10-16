// ─────────────────────────────────────────────────────────────
// Grouping and link targets for the Training Courses mega menu.
// Client-safe: the header is a client component, so nothing here
// may import server-only code.
// ─────────────────────────────────────────────────────────────

import { COURSE_TYPE_META } from './constants';
import { getCourseOverviewByKey, getCourseOverviewBySlug } from './course-overviews';
import type { BuiltInCourseType, CourseTypeInfo } from './types';

/**
 * The two licence-linked courses, pulled out of the list and shown as
 * highlighted cards at the top of the menu. Order is the display order.
 */
export const FEATURED_COURSE_KEYS: BuiltInCourseType[] = [
  'door_supervision',
  'close_protection',
];

function isFeaturedKey(key: string): key is BuiltInCourseType {
  return (FEATURED_COURSE_KEYS as string[]).includes(key);
}

/**
 * Course types that belong under "First Aid Courses" rather than "Security
 * Courses". Matched on the key and labels instead of a fixed list, so types
 * added later from the owner portal (paediatric first aid, CPR and so on)
 * land in the right column without a code change.
 */
const FIRST_AID_PATTERN =
  /first[\s_-]?aid|life[\s_-]?support|paediatric|pediatric|\bcpr\b|defibrillat/i;

export function isFirstAidType(type: CourseTypeInfo): boolean {
  return [type.key, type.short_label, type.label].some((v) =>
    FIRST_AID_PATTERN.test(v ?? ''),
  );
}

/**
 * Where a course type links to. The two built-ins have their own bespoke
 * landing pages, the rest have an overview page under /courses. A type with
 * neither (one added from the owner portal, say) falls back to the filtered
 * calendar, which accepts any key as `?type=some-key`.
 */
export function courseTypeHref(key: string): string {
  const builtIn = COURSE_TYPE_META[key as keyof typeof COURSE_TYPE_META];
  if (builtIn) return builtIn.href;
  const overview = getCourseOverviewByKey(key);
  if (overview) return `/courses/${overview.slug}`;
  return `/calendar?type=${key.replace(/_/g, '-')}`;
}

/** The slug used in /contact?course=… for a course type. */
export function courseEnquirySlug(key: string): string {
  const builtIn = COURSE_TYPE_META[key as keyof typeof COURSE_TYPE_META];
  if (builtIn) return builtIn.slug;
  return getCourseOverviewByKey(key)?.slug ?? key.replace(/_/g, '-');
}

/** Reverse of courseEnquirySlug: the course type a /contact?course= slug names. */
export function courseKeyFromSlug(slug: string): string | undefined {
  if (!slug) return undefined;
  const builtIn = Object.entries(COURSE_TYPE_META).find(([, m]) => m.slug === slug);
  if (builtIn) return builtIn[0];
  return getCourseOverviewBySlug(slug)?.key;
}

export interface FeaturedCourse {
  key: string;
  label: string;
  blurb: string;
  abbr: string;
  href: string;
}

export interface CourseNavGroups {
  featured: FeaturedCourse[];
  security: CourseTypeInfo[];
  firstAid: CourseTypeInfo[];
}

/**
 * Split course types into the mega menu's sections, keeping sort order.
 * Featured courses are removed from the lists so they appear once, as cards.
 */
export function groupCourseTypes(types: CourseTypeInfo[]): CourseNavGroups {
  const security: CourseTypeInfo[] = [];
  const firstAid: CourseTypeInfo[] = [];

  for (const t of types) {
    if (isFeaturedKey(t.key)) continue;
    (isFirstAidType(t) ? firstAid : security).push(t);
  }

  const byKey = new Map(types.map((t) => [t.key, t]));
  const featured = FEATURED_COURSE_KEYS.flatMap<FeaturedCourse>((key) => {
    const type = byKey.get(key);
    const meta = COURSE_TYPE_META[key];
    if (!type || !meta) return [];
    // Name comes from the table so owner renames carry through; the selling
    // line and abbreviation are curated copy that has no column of its own.
    return [
      {
        key,
        label: type.short_label,
        blurb: meta.blurb,
        abbr: meta.abbr,
        href: meta.href,
      },
    ];
  });

  return { featured, security, firstAid };
}
