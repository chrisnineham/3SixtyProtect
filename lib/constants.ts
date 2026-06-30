import type {
  BookingStatus,
  CourseStatus,
  CourseType,
  EnquiryType,
} from './types';

export const SITE = {
  name: '3Sixty Protect',
  shortName: '3Sixty',
  tagline: 'Professional SIA Security Training',
  description:
    'Professional SIA Door Supervision and Close Protection training built around real-world standards. Train with experienced instructors and launch your career in the private security industry.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://3sixtyprotect.co.uk',
  email: 'info@3sixtyprotect.co.uk',
  phone: '0800 123 4567',
  phoneHref: 'tel:08001234567',
  serviceArea: 'London & the South East · Nationwide group bookings',
} as const;

/** Primary navigation shown in the header. */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Door Supervision', href: '/door-supervision' },
  { label: 'Close Protection', href: '/close-protection' },
  { label: 'Training Calendar', href: '/calendar' },
  { label: 'Book Online', href: '/book' },
  { label: 'Contact', href: '/contact' },
] as const;

export const COURSE_TYPE_META: Record<
  CourseType,
  {
    label: string;
    shortLabel: string;
    slug: string;
    href: string;
    abbr: string;
    blurb: string;
  }
> = {
  door_supervision: {
    label: 'SIA Door Supervision',
    shortLabel: 'Door Supervision',
    slug: 'door-supervision',
    href: '/door-supervision',
    abbr: 'DS',
    blurb:
      'The licence-linked qualification to work as an SIA Door Supervisor in pubs, clubs, events and licensed premises.',
  },
  close_protection: {
    label: 'SIA Close Protection',
    shortLabel: 'Close Protection',
    slug: 'close-protection',
    href: '/close-protection',
    abbr: 'CP',
    blurb:
      'The advanced qualification for protecting individuals — the gateway to a career as a professional bodyguard or CPO.',
  },
};

export const COURSE_STATUS_META: Record<
  CourseStatus,
  { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }
> = {
  draft: { label: 'Draft', tone: 'neutral' },
  published: { label: 'Published', tone: 'success' },
  fully_booked: { label: 'Fully booked', tone: 'warning' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }
> = {
  new: { label: 'New', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  completed: { label: 'Completed', tone: 'neutral' },
};

export const ENQUIRY_TYPES: { value: EnquiryType; label: string }[] = [
  { value: 'door_supervision', label: 'Door Supervision training' },
  { value: 'close_protection', label: 'Close Protection training' },
  { value: 'booking', label: 'Booking / course dates' },
  { value: 'general', label: 'General enquiry' },
  { value: 'other', label: 'Something else' },
];

export const COURSE_TYPE_OPTIONS: { value: CourseType; label: string }[] = [
  { value: 'door_supervision', label: 'SIA Door Supervision' },
  { value: 'close_protection', label: 'SIA Close Protection' },
];

export const COURSE_STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'fully_booked', label: 'Fully booked' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const BOOKING_STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];
