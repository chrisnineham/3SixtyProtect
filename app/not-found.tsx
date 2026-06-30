import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center text-white">
      <div className="absolute inset-0 spotlight" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-25"
        aria-hidden
      />
      <div className="relative">
        <Logo light className="justify-center" />
        <p className="mt-10 font-heading text-7xl font-extrabold text-gradient-gold">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-300">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back
          on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">
            <Home className="h-4 w-4" />
            Back to home
          </Button>
          <Button href="/calendar" variant="outline-light">
            View courses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
