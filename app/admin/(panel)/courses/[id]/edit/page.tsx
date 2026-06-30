import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CourseForm } from '@/components/admin/CourseForm';
import { getCourseById } from '@/lib/courses';

export const metadata = { title: 'Edit course' };
export const dynamic = 'force-dynamic';

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourseById(params.id);
  if (!course) notFound();

  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-ink-900">Edit course</h1>
      <p className="mt-1 text-sm text-ink-500">
        Update the details and save. Published changes appear on the website
        immediately.
      </p>

      <div className="mt-7">
        <CourseForm course={course} />
      </div>
    </div>
  );
}
