'use client';

import { useEffect } from 'react';

const ICON_FONT_URLS = [
  'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
];

export function DeferredIconFonts() {
  useEffect(() => {
    for (const href of ICON_FONT_URLS) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
