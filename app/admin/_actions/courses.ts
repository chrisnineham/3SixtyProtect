'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { canManage } from '@/lib/auth';
import { fieldErrors } from '@/lib/validation';
import { getCourseTypes } from '@/lib/course-types';

export interface CourseFormState {
  status: 'idle' | 'error';
  message?: string;
  errors?: Record<string, string>;
}

const courseSchema = z
  .object({
    title: z.string().trim().min(3, 'Enter a course title').max(160),
    course_type: z.string().regex(/^[a-z0-9_]{2,60}$/, 'Choose a course type'),
    description: z.string().trim().max(4000).optional().or(z.literal('')),
    start_date: z.string().min(1, 'Choose a start date'),
    end_date: z.string().min(1, 'Choose an end date'),
    start_time: z.string().optional().or(z.literal('')),
    end_time: z.string().optional().or(z.literal('')),
    location: z.string().trim().min(2, 'Enter a location').max(160),
    price: z.coerce.number().min(0, 'Price must be 0 or more'),
    max_spaces: z.coerce.number().int().min(0).max(1000),
    available_spaces: z.coerce.number().int().min(0).max(1000),
    image_url: z
      .string()
      .trim()
      .url('Enter a valid image URL')
      .optional()
      .or(z.literal('')),
    status: z.enum(['draft', 'published', 'fully_booked', 'cancelled']),
  })
  .superRefine((val, ctx) => {
    if (val.end_date < val.start_date) {
      ctx.addIssue({
        code: 'custom',
        path: ['end_date'],
        message: 'End date cannot be before the start date',
      });
    }
    if (val.available_spaces > val.max_spaces) {
      ctx.addIssue({
        code: 'custom',
        path: ['available_spaces'],
        message: 'Available spaces cannot exceed maximum spaces',
      });
    }
  });

function parseForm(formData: FormData) {
  return courseSchema.safeParse({
    title: formData.get('title'),
    course_type: formData.get('course_type'),
    description: formData.get('description'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time'),
    location: formData.get('location'),
    price: formData.get('price'),
    max_spaces: formData.get('max_spaces'),
    available_spaces: formData.get('available_spaces'),
    image_url: formData.get('image_url'),
    status: formData.get('status'),
  });
}

function toRow(values: z.infer<typeof courseSchema>) {
  return {
    title: values.title,
    course_type: values.course_type,
    description: values.description || '',
    start_date: values.start_date,
    end_date: values.end_date,
    start_time: values.start_time || null,
    end_time: values.end_time || null,
    location: values.location,
    price: values.price,
    max_spaces: values.max_spaces,
    available_spaces: values.available_spaces,
    image_url: values.image_url || null,
    status: values.status,
  };
}

function db() {
  return isServiceRoleConfigured() ? createAdminClient() : createClient();
}

function revalidateAll() {
  for (const path of [
    '/',
    '/calendar',
    '/door-supervision',
    '/close-protection',
    '/book',
    '/admin/dashboard',
    '/admin/courses',
  ]) {
    revalidatePath(path);
  }
}

const NOT_CONFIGURED: CourseFormState = {
  status: 'error',
  message:
    'Connect Supabase (add your keys to .env.local) to create and edit courses.',
};

export async function createCourseAction(
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  if (!(await canManage())) {
    return { status: 'error', message: 'You are not authorised to do that.' };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: fieldErrors(parsed.error),
    };
  }
  const knownTypes = await getCourseTypes();
  if (!knownTypes.some((t) => t.key === parsed.data.course_type)) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: { course_type: 'Choose one of the listed course types' },
    };
  }

  const { error } = await db().from('courses').insert(toRow(parsed.data));
  if (error) {
    console.error('[admin] createCourse failed:', error);
    return { status: 'error', message: 'Could not save the course. Please try again.' };
  }

  revalidateAll();
  redirect('/admin/courses?created=1');
}

export async function updateCourseAction(
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  if (!(await canManage())) {
    return { status: 'error', message: 'You are not authorised to do that.' };
  }

  const id = String(formData.get('id') ?? '');
  if (!id) return { status: 'error', message: 'Missing course id.' };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: fieldErrors(parsed.error),
    };
  }
  const knownTypes = await getCourseTypes();
  if (!knownTypes.some((t) => t.key === parsed.data.course_type)) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: { course_type: 'Choose one of the listed course types' },
    };
  }

  const { error } = await db().from('courses').update(toRow(parsed.data)).eq('id', id);
  if (error) {
    console.error('[admin] updateCourse failed:', error);
    return { status: 'error', message: 'Could not update the course. Please try again.' };
  }

  revalidateAll();
  redirect('/admin/courses?updated=1');
}

/** Delete a course (used by a form button). */
export async function deleteCourseAction(formData: FormData) {
  if (!isSupabaseConfigured() || !(await canManage())) return;
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const { error } = await db().from('courses').delete().eq('id', id);
  if (error) console.error('[admin] deleteCourse failed:', error);
  revalidateAll();
}

/** Set a course status directly (publish, archive to draft, cancel, etc.). */
export async function setCourseStatusAction(formData: FormData) {
  if (!isSupabaseConfigured() || !(await canManage())) return;
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  const allowed = ['draft', 'published', 'fully_booked', 'cancelled'];
  if (!id || !allowed.includes(status)) return;
  const { error } = await db().from('courses').update({ status }).eq('id', id);
  if (error) console.error('[admin] setCourseStatus failed:', error);
  revalidateAll();
}
