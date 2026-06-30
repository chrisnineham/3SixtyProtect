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
        '2xl': '1280px',
      },
    },
    extend: {
      spacing: {
        18: '4.5rem',
      },
      colors: {
        // Deep professional base — charcoal / near-black neutrals
        ink: {
          50: '#F4F6F9',
          100: '#E3E8EF',
          200: '#BFC8D6',
          300: '#94A1B6',
          400: '#5F6E88',
          500: '#3C4A62',
          600: '#283449',
          700: '#1A2536',
          800: '#111A28',
          900: '#0B111C',
          950: '#070B12',
        },
        // Strong premium accent — refined amber-gold
        gold: {
          50: '#FCF8EC',
          100: '#F8EFCE',
          200: '#F1DD9B',
          300: '#EACB67',
          400: '#E4B93E',
          500: '#D69E22',
          600: '#B97E1A',
          700: '#945E18',
          800: '#7A4B1B',
          900: '#673F1B',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7, 11, 18, 0.06), 0 12px 32px -12px rgba(7, 11, 18, 0.18)',
        'card-hover': '0 1px 2px rgba(7, 11, 18, 0.08), 0 24px 48px -16px rgba(7, 11, 18, 0.28)',
        glow: '0 0 0 1px rgba(228, 185, 62, 0.25), 0 18px 50px -12px rgba(214, 158, 34, 0.45)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(148,161,182,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,161,182,0.06) 1px, transparent 1px)',
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
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
