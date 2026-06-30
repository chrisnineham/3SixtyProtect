import type { Metadata } from 'next';
import { CoursePageTemplate } from '@/components/course/CoursePageTemplate';
import { DOOR_SUPERVISION_CONTENT } from '@/lib/course-content';
import { getPublicCourses } from '@/lib/courses';

export const metadata: Metadata = {
  title: DOOR_SUPERVISION_CONTENT.seo.title,
  description: DOOR_SUPERVISION_CONTENT.seo.description,
  alternates: { canonical: '/door-supervision' },
};

export default async function DoorSupervisionPage() {
  const courses = await getPublicCourses('door_supervision');
  return <CoursePageTemplate content={DOOR_SUPERVISION_CONTENT} courses={courses} />;
}
