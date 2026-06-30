import Link from 'next/link';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'outline-light'
  | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-xl font-heading font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-sky-500 text-white shadow-glow hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(34,181,115,0.5)] active:translate-y-0',
  secondary:
    'bg-ink-900 text-white shadow-sm hover:bg-ink-800 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border border-ink-200 bg-white text-ink-900 shadow-sm hover:border-ink-300 hover:bg-ink-50 hover:-translate-y-0.5 active:translate-y-0',
  'outline-light':
    'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15 hover:border-white/40',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-[3.25rem] px-7 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  prefetch?: boolean;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = 'primary', size = 'md', className, children } = props;
    const classes = cn(base, variants[variant], sizes[size], className);

    if ('href' in props && props.href !== undefined) {
      const { href, prefetch, target, rel } = props;
      const external =
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:');
      if (external) {
        return (
          <a href={href} target={target} rel={rel} className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          prefetch={prefetch}
          target={target}
          rel={rel}
          className={classes}
        >
          {children}
        </Link>
      );
    }

    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as ButtonAsButton;
    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);
