'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium" role="group" aria-label="Language selection">
      <button
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
        aria-current={locale === 'en' ? 'true' : undefined}
        className={`cursor-pointer transition-colors duration-200 ${
          locale === 'en' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('no')}
        aria-label="Bytt til norsk"
        aria-current={locale === 'no' ? 'true' : undefined}
        className={`cursor-pointer transition-colors duration-200 ${
          locale === 'no' ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
        }`}
      >
        NO
      </button>
    </div>
  );
}
