import { forwardRef } from 'react';
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-xl border border-ink-200 bg-white px-4 text-[0.95rem] text-ink-900 placeholder:text-ink-400 transition-colors focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/15 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400';

export function Label({
  htmlFor,
  children,
  required,
  className,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-semibold text-ink-800', className)}
    >
      {children}
      {required ? <span className="ml-0.5 text-sky-600">*</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-600">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

/** Wraps a label + control + optional hint/error with consistent spacing. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error ? <p className="text-xs text-ink-400">{hint}</p> : null}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlBase, 'h-12', className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(controlBase, 'min-h-[120px] resize-y py-3', className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          controlBase,
          'h-12 appearance-none bg-white pr-10',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <path
          d="m4 6 4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});
