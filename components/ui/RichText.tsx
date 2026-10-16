import { cn, isRichText } from '@/lib/utils';

/**
 * Renders an admin-authored description. HTML is sanitised on save
 * (lib/rich-text.ts), so the stored markup is already safe; descriptions
 * written before the editor existed are plain text and render as such.
 */
export function RichText({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  if (!value) return null;

  if (!isRichText(value)) {
    return <p className={cn('whitespace-pre-line', className)}>{value}</p>;
  }

  return (
    <div
      className={cn('rich-text', className)}
      // Sanitised server side before it reaches the database.
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
