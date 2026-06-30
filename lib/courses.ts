import 'server-only';

import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { MOCK_COURSES } from './mock-data';
import type { Course, CourseType } from './types';

/** Statuses that are allowed to appear on the public website. */
const PUBLIC_STATUSES = ['published', 'fully_booked'] as const;

function sortByStartDate(a: Course, b: Course) {
  return a.start_date.localeCompare(b.start_date);
}

/** Today's date as YYYY-MM-DD (UTC) for "upcoming" filtering. */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Public: upcoming, visible courses — optionally filtered by type.
 * Falls back to demo data when Supabase is not configured or errors.
 */
export async function getPublicCourses(type?: CourseType): Promise<Course[]> {
  const today = todayIso();

  if (!isSupabaseConfigured()) {
    return MOCK_COURSES.filter(
      (c) =>
        (PUBLIC_STATUSES as readonly string[]).includes(c.status) &&
        c.end_date >= today &&
        (!type || c.course_type === type),
    ).sort(sortByStartDate);
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from('courses')
      .select('*')
      .in('status', PUBLIC_STATUSES as unknown as string[])
      .gte('end_date', today)
      .order('start_date', { ascending: true });

    if (type) query = query.eq('course_type', type);

    const { data, error } = await query;
    if (error) throw error;
    return (data as Course[]) ?? [];
  } catch (err) {
    console.error('[courses] getPublicCourses failed, serving demo data:', err);
    return MOCK_COURSES.filter(
      (c) =>
        (PUBLIC_STATUSES as readonly string[]).includes(c.status) &&
        c.end_date >= today &&
        (!type || c.course_type === type),
    ).sort(sortByStartDate);
  }
}

/** Public: a small set of the soonest upcoming courses for previews. */
export async function getUpcomingCourses(limit = 3): Promise<Course[]> {
  const all = await getPublicCourses();
  return all.slice(0, limit);
}

/** Public: a single course by id (any visible status), for the booking page. */
export async function getCourseById(id: string): Promise<Course | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_COURSES.find((c) => c.id === id) ?? null;
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as Course) ?? null;
  } catch (err) {
    console.error('[courses] getCourseById failed:', err);
    return MOCK_COURSES.find((c) => c.id === id) ?? null;
  }
}

/** Admin: every course regardless of status, newest start date first. */
export async function getAllCoursesAdmin(): Promise<Course[]> {
  if (!isSupabaseConfigured()) {
    return [...MOCK_COURSES].sort((a, b) => b.start_date.localeCompare(a.start_date));
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return (data as Course[]) ?? [];
  } catch (err) {
    console.error('[courses] getAllCoursesAdmin failed:', err);
    return [...MOCK_COURSES].sort((a, b) => b.start_date.localeCompare(a.start_date));
  }
}
