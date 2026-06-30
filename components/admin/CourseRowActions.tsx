'use client';

import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  deleteCourseAction,
  setCourseStatusAction,
} from '@/app/admin/_actions/courses';
import type { CourseStatus } from '@/lib/types';

export function CourseRowActions({
  id,
  status,
}: {
  id: string;
  status: CourseStatus;
}) {
  const isPublished = status === 'published';

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/courses/${id}/edit`}
        title="Edit"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <form action={setCourseStatusAction}>
        <input type="hidden" name="id" value={id} />
        <input
          type="hidden"
          name="status"
          value={isPublished ? 'draft' : 'published'}
        />
        <button
          type="submit"
          title={isPublished ? 'Unpublish (set to draft)' : 'Publish'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          {isPublished ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </form>

      <form
        action={deleteCourseAction}
        onSubmit={(e) => {
          if (!confirm('Delete this course? This cannot be undone.')) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          title="Delete"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
