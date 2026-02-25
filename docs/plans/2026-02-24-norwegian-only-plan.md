# Norwegian-Only Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove English locale, make the site Norwegian-only with clean URLs (no `/no` prefix), keeping all Arabic/Islamic terms intact.

**Architecture:** Keep next-intl with a single `no` locale and `localePrefix: 'never'` for clean URLs. Delete English translations and language switcher. The `[locale]` dynamic segment stays so next-intl still works — re-adding English later is trivial.

**Tech Stack:** Next.js 16, next-intl v4, TypeScript

---

### Task 1: Update Routing Config

**Files:**
- Modify: `src/i18n/routing.ts`

**Step 1: Update routing to Norwegian-only with no prefix**

Replace the entire file contents with:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['no'],
  defaultLocale: 'no',
  localePrefix: 'never',
});

export type Locale = (typeof routing.locales)[number];
```

**Step 2: Verify the file saved correctly**

Run: `cat src/i18n/routing.ts`
Expected: The updated content with `locales: ['no']` and `localePrefix: 'never'`

---

### Task 2: Update Middleware

**Files:**
- Modify: `middleware.ts`

**Step 1: Simplify middleware matcher for single locale**

Replace the entire file contents with:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(no)/:path*'],
};
```

---

### Task 3: Update Root Layout Language

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Change `lang="en"` to `lang="no"` on the HTML tag**

Change line 36 from:
```html
<html lang="en" className="dark" suppressHydrationWarning>
```
to:
```html
<html lang="no" className="dark" suppressHydrationWarning>
```

---

### Task 4: Delete English Translations

**Files:**
- Delete: `src/i18n/messages/en.json`

**Step 1: Remove the English translation file**

Run: `rm src/i18n/messages/en.json`

**Step 2: Verify only `no.json` remains**

Run: `ls src/i18n/messages/`
Expected: Only `no.json`

---

### Task 5: Remove Language Switcher from Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Step 1: Remove the LanguageSwitcher import (line 7)**

Remove this line:
```typescript
import { LanguageSwitcher } from './LanguageSwitcher';
```

**Step 2: Remove desktop LanguageSwitcher usage (line 134)**

Change:
```tsx
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
```
to:
```tsx
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
```

**Step 3: Remove mobile LanguageSwitcher usage (lines 207-209)**

Change:
```tsx
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
```
to:
```tsx
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
```

---

### Task 6: Delete Language Switcher Component

**Files:**
- Delete: `src/components/layout/LanguageSwitcher.tsx`

**Step 1: Remove the component file**

Run: `rm src/components/layout/LanguageSwitcher.tsx`

**Step 2: Verify it's gone**

Run: `ls src/components/layout/Language*`
Expected: No such file

---

### Task 7: Verify Build

**Step 1: Kill any running dev servers and start fresh**

Run: `lsof -ti :3000 | xargs kill -9 2>/dev/null; npm run dev`

**Step 2: Test the homepage loads at `/` (not `/no`)**

Visit `http://localhost:3000/` — should load the Norwegian homepage directly without redirect.

**Step 3: Test a subpage loads at `/contact` (not `/no/contact`)**

Visit `http://localhost:3000/contact` — should load the contact page in Norwegian.

**Step 4: Verify no LanguageSwitcher visible in navbar**

Check desktop and mobile nav — no EN/NO buttons should appear.

---

### Task 8: Commit

**Step 1: Stage all changes**

```bash
git add src/i18n/routing.ts middleware.ts src/app/layout.tsx src/components/layout/Navbar.tsx
git add -u src/i18n/messages/en.json src/components/layout/LanguageSwitcher.tsx
```

**Step 2: Commit**

```bash
git commit -m "feat: make site Norwegian-only with clean URLs

- Remove English locale, set Norwegian as sole locale
- Add localePrefix: 'never' for clean URLs (/contact not /no/contact)
- Delete en.json translations and LanguageSwitcher component
- Update root layout lang attribute to 'no'

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
