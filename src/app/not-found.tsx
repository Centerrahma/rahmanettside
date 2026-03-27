import Link from 'next/link';
import { Building2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <Building2 className="w-16 h-16 text-primary mx-auto" />
        </div>
        <h1 className="text-8xl font-bold text-primary mb-4 font-[family-name:var(--font-display)]">
          404
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-[var(--color-bg)] font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          <Home className="w-6 h-6" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
