// ─────────────────────────────────────────────────────────────
// Domain types — mirror the Supabase schema in supabase/schema.sql
// ─────────────────────────────────────────────────────────────

/** The two original types; each has its own landing page and content. */
export type BuiltInCourseType = 'door_supervision' | 'close_protection';
/** Any course type key, including ones added from the owner portal. */
export type CourseType = string;

/** A row of the course_types table. */
export interface CourseTypeInfo {
  key: string;
  label: string;
  short_label: string;
  sort_order: number;
}

export interface CourseLocation {
  id: string;
  name: string;
  sort_order: number;
}

export type CourseStatus = 'draft' | 'published' | 'fully_booked' | 'cancelled';

export type BookingStatus = 'new' | 'confirmed' | 'cancelled' | 'completed';

export type PaymentStatus = 'unpaid' | 'deposit_paid';

export type EnquiryType =
  | 'door_supervision'
  | 'close_protection'
  | 'booking'
  | 'general'
  | 'other';

export interface Course {
  id: string;
  title: string;
  course_type: CourseType;
  /** Filled in from course_types when courses are loaded. */
  type_label?: string;
  type_short_label?: string;
  type_sort?: number;
  description: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM
  end_time: string | null; // HH:MM
  location: string;
  price: number;
  max_spaces: number;
  available_spaces: number;
  image_url: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  course_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string | null;
  booking_status: BookingStatus;
  reference?: string | null;
  payment_status?: PaymentStatus;
  deposit_amount?: number | null;
  stripe_session_id?: string | null;
  created_at: string;
  updated_at: string;
  // Joined when reading bookings in the admin portal
  course?: Pick<Course, 'id' | 'title' | 'course_type' | 'start_date'> | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  /** Individually granted capabilities (see lib/permissions.ts). */
  permissions?: string[];
  created_at: string;
}

/** Shape accepted by the create/edit course form. */
export interface CourseInput {
  title: string;
  course_type: CourseType;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  price: number;
  max_spaces: number;
  available_spaces: number;
  image_url: string | null;
  status: CourseStatus;
}
