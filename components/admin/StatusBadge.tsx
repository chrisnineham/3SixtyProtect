import { Badge } from '@/components/ui/Badge';
import { BOOKING_STATUS_META, COURSE_STATUS_META } from '@/lib/constants';
import type { BookingStatus, CourseStatus } from '@/lib/types';

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  const meta = COURSE_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
