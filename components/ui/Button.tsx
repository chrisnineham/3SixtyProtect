import Link from 'next/link';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'outline-light'
  | 'light'
  | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.05em] text-[12px] leading-none transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-950 text-white border border-ink-950 hover:bg-background hover:text-ink-950',
  secondary:
    'bg-ink-950 text-white border border-ink-950 hover:bg-background hover:text-ink-950',
  outline:
    'bg-transparent text-ink-950 border border-ink-950 hover:bg-ink-950 hover:text-white',
  'outline-light':
    'bg-transparent text-white border border-white hover:bg-white hover:text-ink-950',
  // Solid white on-dark CTA (strongest button on a black band); inverts to outline on hover
  light:
    'bg-white text-ink-950 border border-white hover:bg-transparent hover:text-white',
  ghost: 'text-ink-950 underline-offset-4 hover:underline',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
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
