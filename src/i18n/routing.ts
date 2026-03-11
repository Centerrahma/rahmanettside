import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['no'],
  defaultLocale: 'no',
});

export type Locale = (typeof routing.locales)[number];
