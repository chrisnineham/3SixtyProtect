import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CourseOverviewTemplate } from '@/components/course/CourseOverviewTemplate';
import { COURSE_OVERVIEWS, getCourseOverviewBySlug } from '@/lib/course-overviews';
import { getPublicCourses } from '@/lib/courses';
import { getCourseTypes } from '@/lib/course-types';
import { courseTypeLabel, courseTypeShortLabel } from '@/lib/constants';

export function generateStaticParams() {
  return COURSE_OVERVIEWS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const overview = getCourseOverviewBySlug(params.slug);
  if (!overview) return {};
  return {
    title: overview.seo.title,
    description: overview.seo.description,
    alternates: { canonical: `/courses/${overview.slug}` },
  };
}

export default async function CourseOverviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const overview = getCourseOverviewBySlug(params.slug);
  if (!overview) notFound();

  // Labels come from course_types so owner renames carry through to the page.
  const [types, courses] = await Promise.all([
    getCourseTypes(),
    getPublicCourses(overview.key),
  ]);

  return (
    <CourseOverviewTemplate
      overview={overview}
      typeLabel={courseTypeLabel(overview.key, types)}
      typeShortLabel={courseTypeShortLabel(overview.key, types)}
      courses={courses}
    />
  );
}
