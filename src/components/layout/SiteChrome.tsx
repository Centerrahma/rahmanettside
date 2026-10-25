'use client';

import type { ReactNode } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';

/** The mosque's touch screen has its own full-viewport layout. */
export function SiteChrome({ children, navigation, footer }: {
  children: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
}) {
  const segment = useSelectedLayoutSegment();

  if (segment === 'skjerm') return children;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-[var(--color-bg)] focus:rounded-lg focus:font-semibold"
      >
        Hopp til innhold
      </a>
      {navigation}
      {children}
      {footer}
    </>
  );
}
