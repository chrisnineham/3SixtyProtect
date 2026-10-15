import { z } from 'zod';

export const bookingSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your full legal name')
    .max(120),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter your date of birth'),
  address_line_1: z.string().trim().min(2, 'Please enter your address').max(200),
  address_line_2: z.string().trim().max(200).optional().or(z.literal('')),
  town: z.string().trim().min(2, 'Please enter your town or city').max(120),
  postcode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9][A-Z0-9 ]{3,8}[A-Z0-9]$/, 'Please enter a valid postcode'),
  emergency_contact_name: z.string().trim().max(120).optional().or(z.literal('')),
  emergency_contact_phone: z.string().trim().max(40).optional().or(z.literal('')),
  confirm: z.literal('on', { errorMap: () => ({ message: 'Please confirm your details and agree to continue' }) }),
  customer_email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(180),
  customer_phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(40),
  course_id: z.string().trim().min(1, 'Please select a course'),
  message: z.string().trim().max(1500).optional().or(z.literal('')),
});

export type BookingValues = z.infer<typeof bookingSchema>;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(180),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  enquiry_type: z.enum([
    'door_supervision',
    'close_protection',
    'booking',
    'general',
    'other',
  ]),
  message: z
    .string()
    .trim()
    .min(5, 'Please tell us a little more')
    .max(2000),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

/** Flatten a ZodError into a simple { field: message } map for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
