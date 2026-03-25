# Homepage Showcase Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage carousel with 4 full-width showcase sections (Layout B: background image + floating glass card) and add a side-by-side Facebook feed + Vipps donation bottom row.

**Architecture:** New `ShowcaseSections` component renders 4 image-background sections with glassmorphism floating cards. New `BottomRow` wraps a compact Facebook iframe and a `VippsDonationCard`. Old carousel components are deleted.

**Tech Stack:** Next.js 16, Tailwind v4, next-intl, Next/Image

**Spec:** `docs/superpowers/specs/2026-03-25-homepage-showcase-redesign-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/home/ShowcaseSections.tsx` | 4 full-width showcase sections with glass cards |
| Create | `src/components/home/VippsDonationCard.tsx` | Standalone Vipps donation widget (QR, button, numbers) |
| Create | `src/components/home/BottomRow.tsx` | Side-by-side Facebook feed + Vipps donation |
| Modify | `src/app/page.tsx` | Wire up new components, remove old imports |
| Modify | `src/i18n/messages/en.json` | Add `showcase` and `facebook` namespaces |
| Modify | `src/i18n/messages/no.json` | Add `showcase.title` key |
| Delete | `src/components/home/ShowcaseCardStack.tsx` | Old carousel |
| Delete | `src/components/ui/card-stack.tsx` | Old carousel dependency |
| Delete | `src/components/home/ShowcaseSection.tsx` | Unused parallax version |

---

## Chunk 1: ShowcaseSections Component

### Task 1: Create ShowcaseSections component

**Files:**
- Create: `src/components/home/ShowcaseSections.tsx`

- [ ] **Step 1: Create the ShowcaseSections component**

This is the main new component — 4 full-width sections, each with a background image and a floating glassmorphism card that alternates left/right.

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SECTIONS = [
  { id: 'ungRahma',   href: '/ung-rahma',    image: '/UngRahma.jpeg',          icon: 'group' },
  { id: 'rahmaSkole', href: '/rahma-skole',   image: '/Rahmaskole_opt.jpg',     icon: 'school' },
  { id: 'bliMedlem',  href: '/become-member', image: '/BliMedlem_opt.jpg',      icon: 'person_add' },
  { id: 'nyMoske',    href: '/new-mosque',    image: '/nymoskeoversikt_opt.jpg', icon: 'mosque' },
] as const;

function ShowcaseCard({
  id,
  href,
  image,
  icon,
  index,
}: (typeof SECTIONS)[number] & { index: number }) {
  const t = useTranslations('showcase');
  const isEven = index % 2 === 0;

  return (
    <article className="relative rounded-2xl overflow-hidden group">
      {/* ── Desktop: full image background with floating glass card ── */}
      <div className="hidden md:block relative min-h-[450px]">
        <Image
          src={image}
          alt={t(`${id}.title`)}
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay — direction alternates, opacity adapts to theme */}
        <div
          className={`absolute inset-0 ${
            isEven
              ? 'bg-gradient-to-r'
              : 'bg-gradient-to-l'
          } from-black/50 dark:from-black/55 via-black/20 to-transparent`}
        />
        {/* Floating glass card */}
        <div
          className={`absolute inset-y-0 flex items-center p-8 md:p-12 ${
            isEven ? 'left-0' : 'right-0'
          }`}
          style={{ maxWidth: '50%' }}
        >
          <div
            className="bg-[var(--glass-card-bg)] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]
                        border border-[var(--glass-card-border)] rounded-2xl p-7
                        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                        transition-shadow duration-300
                        group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_25px_rgba(var(--color-primary-rgb),0.15)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[var(--color-gold)] text-xl">
                {icon}
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gold)]">
                {t(`${id}.subtitle`)}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">
              {t(`${id}.title`)}
            </h3>
            <p className="text-sm text-white/85 leading-relaxed mb-5">
              {t(`${id}.description`)}
            </p>
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold
                         bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                         text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                         transition-colors duration-200"
            >
              {t(`${id}.cta`)}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked image + card ── */}
      <div className="md:hidden">
        <div className="relative h-[200px]">
          <Image
            src={image}
            alt={t(`${id}.title`)}
            fill
            className="object-cover rounded-t-2xl"
            sizes="100vw"
          />
        </div>
        <div
          className="bg-[var(--glass-card-bg)] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]
                      border border-[var(--glass-card-border)] border-t-0 rounded-b-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[var(--color-gold)] text-lg">
              {icon}
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-gold)]">
              {t(`${id}.subtitle`)}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 font-[family-name:var(--font-display)]">
            {t(`${id}.title`)}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            {t(`${id}.description`)}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                       bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                       text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                       transition-colors duration-200"
          >
            {t(`${id}.cta`)}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ShowcaseSections() {
  const t = useTranslations('showcase');

  return (
    <section className="bg-[var(--color-bg)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-[var(--color-text-muted)]">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {t('title')}
          </h2>
        </div>

        {/* 4 showcase sections */}
        <div className="flex flex-col gap-12 md:gap-16">
          {SECTIONS.map((section, i) => (
            <ShowcaseCard key={section.id} {...section} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the file was created correctly**

Run: `npx tsc --noEmit src/components/home/ShowcaseSections.tsx 2>&1 | head -20`
Expected: No type errors (or only unrelated project-wide errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ShowcaseSections.tsx
git commit -m "feat: Add ShowcaseSections component with glassmorphism cards"
```

---

## Chunk 2: VippsDonationCard + BottomRow Components

### Task 2: Create VippsDonationCard component

**Files:**
- Create: `src/components/home/VippsDonationCard.tsx`
- Reference: `src/components/donate/VideoAndDonate.tsx:127-188` (existing Vipps pattern)

- [ ] **Step 1: Create VippsDonationCard**

Standalone Vipps widget extracted from the VideoAndDonate pattern. All strings hardcoded in Norwegian (Vipps is Norway-only, matching existing pattern).

```tsx
import Image from 'next/image';

const VIPPS_DONATION_URL = 'https://qr.vipps.no/donations/43392';

export default function VippsDonationCard() {
  return (
    <div className="glass-panel p-4 md:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">
          volunteer_activism
        </span>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text)]">Støtt Masjid Rahma</h3>
          <p className="text-[10px] md:text-xs text-[var(--color-text-muted)]">Doner enkelt via Vipps</p>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 mb-4">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-primary text-lg mt-0.5 flex-shrink-0">info</span>
          <p className="text-sm leading-relaxed text-[var(--color-text)]">
            Bruk QR-koden eller knappen nedenfor for å donere via Vipps. Du kan velge mellom{' '}
            <span className="font-bold">engangsbetaling</span> eller{' '}
            <span className="font-bold">månedlig trekk</span> med valgfritt beløp.
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="rounded-2xl bg-white p-3 shadow-md">
          <Image
            src="/vippsdonasjon.png"
            alt="Vipps donasjon QR-kode"
            width={220}
            height={220}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Vipps button */}
      <a
        href={VIPPS_DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#ff5b24] hover:bg-[#e64f1e] text-white py-3 px-6 rounded-xl
                   text-base font-bold flex items-center justify-center gap-2.5
                   transition-colors shadow-md mb-4"
      >
        <span>Doner med Vipps</span>
        <span className="material-symbols-outlined text-lg">open_in_new</span>
      </a>

      {/* Vipps numbers */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 mt-auto">
        <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wide text-center mb-2">
          Send via Vipps
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-2 px-2 text-center">
            <p className="text-xl font-black text-[#ff5b24] tracking-wide">77811</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-medium">Vipps nr. 1</p>
          </div>
          <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-2 px-2 text-center">
            <p className="text-xl font-black text-[#ff5b24] tracking-wide">43392</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-medium">Vipps nr. 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/VippsDonationCard.tsx
git commit -m "feat: Add standalone VippsDonationCard component"
```

### Task 3: Create BottomRow component

**Files:**
- Create: `src/components/home/BottomRow.tsx`
- Reference: `src/components/home/FacebookFeed.tsx` (iframe pattern, scaling logic)

- [ ] **Step 1: Create BottomRow with inline Facebook feed + VippsDonationCard**

The Facebook feed is rendered inline (not importing the existing component) to avoid modifying it. Uses the same iframe URL pattern and scaling logic from `FacebookFeed.tsx`.

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import VippsDonationCard from './VippsDonationCard';

const FB_PAGE_URL = 'https://www.facebook.com/masjidrahma';
const IFRAME_WIDTH = 500;
const IFRAME_HEIGHT = 400;

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FeedSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Loading feed">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-border)]" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-32 rounded bg-[var(--color-border)]" />
          <div className="h-2 w-20 rounded bg-[var(--color-border)]" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-[var(--color-border)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-border)]" />
      </div>
      <div className="h-40 w-full rounded-lg bg-[var(--color-border)]" />
    </div>
  );
}

function CompactFacebookFeed() {
  const t = useTranslations('facebook');
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth;
        setScale(availableWidth < IFRAME_WIDTH ? availableWidth / IFRAME_WIDTH : 1);
      }
    }
    updateScale();
    window.addEventListener('resize', updateScale, { passive: true });
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    FB_PAGE_URL
  )}&tabs=timeline&width=${IFRAME_WIDTH}&height=${IFRAME_HEIGHT}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <div className="glass-panel p-4 md:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FacebookIcon />
        <h3 className="text-lg font-bold text-[var(--color-text)]">{t('title')}</h3>
      </div>

      {/* Iframe container */}
      <div ref={containerRef} className="flex-1 overflow-hidden rounded-lg">
        {!loaded && <FeedSkeleton />}
        <div
          style={{
            width: `${IFRAME_WIDTH}px`,
            height: `${IFRAME_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <iframe
            src={iframeSrc}
            width={IFRAME_WIDTH}
            height={IFRAME_HEIGHT}
            className={`border-none overflow-hidden rounded-lg ${loaded ? '' : 'h-0'}`}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Masjid Rahma Facebook"
            onLoad={() => setLoaded(true)}
          />
        </div>
        {scale < 1 && (
          <div style={{ marginTop: `${-(IFRAME_HEIGHT * (1 - scale))}px` }} />
        )}
      </div>

      {/* Follow link */}
      <a
        href={FB_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 mt-4
                   px-4 py-2 rounded-full text-sm font-medium
                   border border-[var(--color-border)] text-[var(--color-text)]
                   hover:border-[var(--color-text)] hover:bg-[var(--color-text)]/5
                   transition-all duration-300"
      >
        <FacebookIcon />
        {t('followUs')}
      </a>
    </div>
  );
}

export default function BottomRow() {
  return (
    <section className="bg-[var(--color-surface)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <CompactFacebookFeed />
          <VippsDonationCard />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors from the created files.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/BottomRow.tsx
git commit -m "feat: Add BottomRow with Facebook feed and Vipps donation side by side"
```

---

## Chunk 3: Wire Up page.tsx + i18n + Cleanup

### Task 4: Add English showcase translations

**Files:**
- Modify: `src/i18n/messages/en.json`

- [ ] **Step 1: Add showcase and facebook namespaces to en.json**

Add the following after the last existing namespace (before the closing `}`). Both namespaces are needed — `showcase` for the new sections, `facebook` for the BottomRow's CompactFacebookFeed which calls `useTranslations('facebook')`.

```json
  "facebook": {
    "eyebrow": "COMMUNITY",
    "title": "Stay Updated",
    "subtitle": "Follow our latest updates, events and community moments on Facebook",
    "followUs": "Follow us on Facebook"
  },
  "showcase": {
    "eyebrow": "EXPLORE OUR COMMUNITY",
    "title": "Explore the Community",
    "ungRahma": {
      "title": "Ung Rahma",
      "subtitle": "Youth Program",
      "description": "Empowering the next generation through faith, learning and leadership. Activities, trips and mentoring for youth aged 13–25.",
      "cta": "Explore Ung Rahma"
    },
    "rahmaSkole": {
      "title": "Rahma School",
      "subtitle": "Islamic Education",
      "description": "Structured Quran teaching, Arabic language and Islamic studies for children and youth in a safe and caring environment.",
      "cta": "Discover Rahma School"
    },
    "bliMedlem": {
      "title": "Become a Member",
      "subtitle": "Join the Community",
      "description": "Be part of Oslo's growing Muslim community. Your membership supports programs, services and the vision for our new mosque.",
      "cta": "Join Today"
    },
    "nyMoske": {
      "title": "New Mosque",
      "subtitle": "Building the Future",
      "description": "Help us build a modern Islamic center for Oslo. A place for worship, education and community for generations to come.",
      "cta": "Support the Project"
    }
  }
```

- [ ] **Step 2: Add `showcase.title` key to no.json**

The Norwegian `no.json` has the `showcase` namespace but is missing the `title` key (only has `eyebrow`). Add it:

Find in `no.json` the line `"eyebrow": "UTFORSK FELLESSKAPET VÅRT",` and add after it:
```json
    "title": "Utforsk Fellesskapet",
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages/en.json src/i18n/messages/no.json
git commit -m "feat: Add showcase and facebook translations for en.json, add showcase.title to no.json"
```

### Task 5: Update page.tsx to use new components

**Files:**
- Modify: `src/app/page.tsx:1-93`

- [ ] **Step 1: Replace imports and component usage**

Replace the entire `page.tsx` content. Changes:
1. Remove `ShowcaseCardStack` import (line 5)
2. Remove lazy `FacebookFeed` import (line 7)
3. Add `ShowcaseSections` import
4. Add lazy `BottomRow` import
5. In `HomePage`: replace `<ShowcaseCardStack />` with `<ShowcaseSections />`
6. Replace `<Suspense><FacebookFeed /></Suspense>` with `<Suspense><BottomRow /></Suspense>`

The updated component section of `page.tsx` should be:

```tsx
import ShowcaseSections from '@/components/home/ShowcaseSections';

const BottomRow = lazy(() => import('@/components/home/BottomRow'));
```

And the render:

```tsx
export default function HomePage() {
  return (
    <>
      <MosqueJsonLd />
      <HeroSection />
      <ShowcaseSections />
      <Suspense>
        <BottomRow />
      </Suspense>
    </>
  );
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds without errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: Wire up ShowcaseSections and BottomRow on homepage"
```

### Task 6: Delete old carousel components

**Files:**
- Delete: `src/components/home/ShowcaseCardStack.tsx`
- Delete: `src/components/ui/card-stack.tsx`
- Delete: `src/components/home/ShowcaseSection.tsx`

- [ ] **Step 1: Verify no other files import these components**

Run:
```bash
grep -r "ShowcaseCardStack\|card-stack\|ShowcaseSection" src/ --include="*.tsx" --include="*.ts" -l
```

Expected: Only the files being deleted (and possibly their `(1)` duplicates). If `page.tsx` still references them, Task 5 was not completed correctly — go back and fix.

- [ ] **Step 2: Delete the files**

```bash
rm src/components/home/ShowcaseCardStack.tsx
rm src/components/ui/card-stack.tsx
rm src/components/home/ShowcaseSection.tsx
```

- [ ] **Step 3: Verify build still compiles**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -u src/components/home/ShowcaseCardStack.tsx src/components/ui/card-stack.tsx src/components/home/ShowcaseSection.tsx
git commit -m "refactor: Remove old carousel and unused parallax showcase components"
```

### Task 7: Visual verification

- [ ] **Step 1: Start dev server and verify in browser**

Run: `npm run dev`

Check the following:
1. Homepage loads without errors
2. 4 showcase sections render with background images
3. Glass cards alternate left/right on desktop
4. Mobile view (375px): image stacks on top, card below
5. Bottom row: Facebook feed left, Vipps widget right
6. Dark mode: glassmorphism effect is visible and beautiful
7. Light mode: still looks good with appropriate overlay opacity
8. All 4 CTA buttons link to correct pages
9. Vipps button opens donation URL
10. Facebook iframe loads and scales correctly

- [ ] **Step 2: Final commit if any adjustments needed**

```bash
git add -A
git commit -m "fix: Visual adjustments from review"
```
