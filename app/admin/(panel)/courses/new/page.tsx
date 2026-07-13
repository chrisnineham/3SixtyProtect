import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CourseForm } from '@/components/admin/CourseForm';

export const metadata = { title: 'New course' };

export default function NewCoursePage() {
  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>
      <h1 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight text-ink-900">
        Create a new course
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Publish it straight away, or save it as a draft to publish later.
      </p>

      <div className="mt-7">
        <CourseForm />
      </div>
    </div>
  );
}
