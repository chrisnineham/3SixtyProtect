import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      spacing: {
        18: '4.5rem',
      },
      colors: {
        // Cool slate neutrals (SkySign-aligned: #0F172A heads, #F8FAFC surfaces)
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B1120',
        },
        // SkySign emerald — the signature accent
        sky: {
          50: '#ECFBF3',
          100: '#D8F1E4',
          200: '#B3E6CC',
          300: '#82D6AC',
          400: '#4ACE94',
          500: '#22B573',
          600: '#1B9460',
          700: '#16774E',
          800: '#145E3F',
          900: '#114B34',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px -14px rgba(15, 23, 42, 0.14)',
        'card-hover': '0 1px 2px rgba(15, 23, 42, 0.06), 0 24px 48px -18px rgba(15, 23, 42, 0.22)',
        glow: '0 10px 30px -10px rgba(34, 181, 115, 0.45)',
        float: '0 4px 24px -4px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(1deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(0deg)' },
          '25%': { transform: 'translateY(-6px) rotate(-1.4deg)' },
          '75%': { transform: 'translateY(-6px) rotate(1.4deg)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0deg)' },
          '25%': { transform: 'translateY(-4px) rotate(1deg)' },
          '75%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-1': 'float-1 6s ease-in-out infinite',
        'float-2': 'float-2 7s ease-in-out infinite',
        'float-3': 'float-3 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
