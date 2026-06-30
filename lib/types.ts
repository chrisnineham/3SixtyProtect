// ─────────────────────────────────────────────────────────────
// Domain types — mirror the Supabase schema in supabase/schema.sql
// ─────────────────────────────────────────────────────────────

export type CourseType = 'door_supervision' | 'close_protection';

export type CourseStatus = 'draft' | 'published' | 'fully_booked' | 'cancelled';

export type BookingStatus = 'new' | 'confirmed' | 'cancelled' | 'completed';

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
  created_at: string;
  updated_at: string;
  // Joined when reading bookings in the admin portal
  course?: Pick<Course, 'id' | 'title' | 'course_type' | 'start_date'> | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
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
