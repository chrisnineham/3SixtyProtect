import {
  GraduationCap,
  UserRoundCheck,
  ClipboardCheck,
  ScanEye,
  Users,
  Search,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceIconName } from '@/lib/services';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  GraduationCap,
  UserRoundCheck,
  ClipboardCheck,
  ScanEye,
  Users,
  Search,
};

export function ServiceIcon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: ServiceIconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[name];
  return <Icon className={cn('h-6 w-6', className)} strokeWidth={strokeWidth} />;
}
