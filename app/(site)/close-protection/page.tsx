import type { Metadata } from 'next';
import { CoursePageTemplate } from '@/components/course/CoursePageTemplate';
import { CLOSE_PROTECTION_CONTENT } from '@/lib/course-content';
import { getPublicCourses } from '@/lib/courses';

export const metadata: Metadata = {
  title: CLOSE_PROTECTION_CONTENT.seo.title,
  description: CLOSE_PROTECTION_CONTENT.seo.description,
  alternates: { canonical: '/close-protection' },
};

export default async function CloseProtectionPage() {
  const courses = await getPublicCourses('close_protection');
  return <CoursePageTemplate content={CLOSE_PROTECTION_CONTENT} courses={courses} />;
}
