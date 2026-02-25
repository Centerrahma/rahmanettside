# Norwegian-Only Site Design

**Date:** 2026-02-24
**Approach:** Keep next-intl with single Norwegian locale and clean URLs

## Goal

Remove English locale, make Norwegian the only language, clean up URLs to remove `/no` prefix. Arabic/Islamic terms (Fajr, Dhuhr, Asr, Maghrib, Isha, Zakat, Sadaqah, Nikah, Tajweed, Tafseer, Khutbah, Jummah, etc.) remain as-is in Norwegian translations.

## Changes

### 1. Routing Config (`src/i18n/routing.ts`)
- Set `locales: ['no']`, `defaultLocale: 'no'`
- Add `localePrefix: 'never'` for clean URLs (`/contact` instead of `/no/contact`)

### 2. Middleware (`middleware.ts`)
- Update matcher pattern to reflect single locale
- Simplify to handle only Norwegian

### 3. Translation Files (`src/i18n/messages/`)
- Delete `en.json`
- Keep `no.json` as sole translation source

### 4. Language Switcher
- Delete `src/components/layout/LanguageSwitcher.tsx`
- Remove all imports/references in Navbar (desktop + mobile)

### 5. Layout (`src/app/[locale]/layout.tsx`)
- Simplify message loading to always use `no.json`
- Set `lang="no"` on HTML tag
- Update `generateStaticParams` to only return `{ locale: 'no' }`

### 6. Unchanged
- All `useTranslations()` / `getTranslations()` calls in components
- Page structure and component logic
- Arabic/Islamic terms in `no.json`
- `[locale]` folder structure (next-intl still manages routing)

## Trade-offs

- **Pro:** Clean URLs, simpler UX, no dead English code
- **Pro:** Easy to re-add English later by adding `en` back to locales and restoring `en.json`
- **Con:** Carries next-intl dependency for single language (negligible overhead)
