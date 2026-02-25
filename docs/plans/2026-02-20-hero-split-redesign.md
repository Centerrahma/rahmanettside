# Hero Split Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current aurora-blob hero with a full-bleed vertical split layout — real community photo on the right half, clean headline + CTAs on the left — and move the dashboard bento below the fold as a standalone section.

**Architecture:** The `HeroSection.tsx` component is split into two logical parts: (1) a new `SplitHero` component (the above-the-fold split layout) and (2) the existing dashboard bento grid promoted to its own `<section>` beneath. The `ParticleField` and `AuroraBackground` sub-components are removed. The photo `hero-children.jpg` (already in `/public`) fills the right panel via `object-cover`. A decorative gold SVG arc divides the panels. The existing prayer cards, calendar, countdown, Jummah, etc. remain untouched — only their container moves.

**Tech Stack:** Next.js 15, Tailwind CSS v4, next-intl, React, TypeScript. No new dependencies.

---

### Task 1: Remove AuroraBackground and ParticleField from HeroSection

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

**Step 1: Delete the `ParticleField` function** (lines 25–44)

Remove this entire block:
```tsx
/* ─── Particle starfield ─── */
const PARTICLES = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  left: `${(i * 2.27) % 100}%`,
  delay: `${(i * 0.34) % 15}s`,
  duration: `${12 + (i * 0.57) % 18}s`,
  size: `${1 + (i % 3)}px`,
  opacity: 0.2 + (i % 5) * 0.08,
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[var(--color-gold)]"
          style={{
            left: p.left,
            bottom: '-2%',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `particle-rise ${p.duration} ${p.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
```

**Step 2: Delete the `AuroraBackground` function** (lines 46–109)

Remove this entire block:
```tsx
/* ─── Aurora background blobs ─── */
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* ... all blobs ... */}
    </div>
  );
}
```

**Step 3: Remove `<ParticleField />` and `<AuroraBackground />` from the JSX** in the `HeroSection` return (around line 467–468):

Remove these two lines:
```tsx
<ParticleField />
<AuroraBackground />
```

**Step 4: Verify dev server shows no green blobs**

Run: `open http://localhost:3000`
Expected: Hero renders without aurora blobs.

**Step 5: Commit**
```bash
git add src/components/home/HeroSection.tsx
git commit -m "refactor: remove ParticleField and AuroraBackground from hero"
```

---

### Task 2: Restructure the hero `<section>` into a split layout

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

**Goal:** The `<section>` that currently wraps everything becomes a two-column grid: left = content, right = photo. The dashboard bento stays inside the same component but moves to a separate `<section>` tag below.

**Step 1: Replace the outer `<section>` JSX in `HeroSection`**

Find this (around line 464):
```tsx
return (
  <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]">
    {/* Subtle Islamic pattern overlay */}
    <div className="absolute inset-0 pattern-islamic opacity-10 pointer-events-none" aria-hidden="true" />

    {/* Content wrapper */}
    <div className="relative z-10 flex flex-col items-center px-4 pt-28 pb-8 md:pt-36 md:pb-10">

      {/* ── Hero Text ── */}
      <div
        className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        style={{ animation: 'hero-fade-up 0.8s ease-out both' }}
      >
```

Replace the entire `return (...)` with this new structure (keep all the sub-components like `GlassCard`, `JummahCard`, etc. unchanged above):

```tsx
return (
  <>
    {/* ══════════════════════════════════════════
        SPLIT HERO — above the fold
    ══════════════════════════════════════════ */}
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] flex flex-col lg:flex-row">

      {/* ── LEFT: Content panel ── */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 pt-32 pb-12 lg:pt-0 lg:pb-0 lg:w-1/2 xl:w-[52%]">
        {/* Islamic pattern — subtle, left panel only */}
        <div className="absolute inset-0 pattern-islamic opacity-[0.06] pointer-events-none" aria-hidden="true" />

        <div
          className="relative max-w-xl"
          style={{ animation: 'hero-fade-up 0.8s ease-out both' }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(var(--color-primary-rgb),0.25)] bg-[rgba(var(--color-primary-rgb),0.06)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Est. Oslo 1995
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-6 leading-[1.05] tracking-tight font-display">
            {t('welcome')}
          </h1>

          {/* Subtitle */}
          <p className="text-[var(--color-text-muted)] text-lg md:text-xl mb-10 leading-relaxed max-w-md">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.25)] hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.45)]"
            >
              {t('ctaVisit')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/become-member"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[rgba(var(--color-primary-rgb),0.35)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] text-[var(--color-text)] font-semibold rounded-full transition-all duration-300"
            >
              {t('ctaJoin')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
                person_add
              </span>
            </Link>
          </div>

          {/* Ramadan calendar link — subtle text link below CTAs */}
          <div className="mt-6">
            <a
              href="/Rahma_Kalendar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">
                calendar_today
              </span>
              {t('ctaRamadan')}
            </a>
          </div>

          {/* Quick stats strip */}
          <div className="mt-12 flex items-center gap-8 pt-8 border-t border-[rgba(var(--color-primary-rgb),0.12)]">
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)] font-display">30+</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-0.5">Years</div>
            </div>
            <div className="w-px h-8 bg-[rgba(var(--color-primary-rgb),0.15)]" />
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)] font-display">5</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-0.5">Daily Prayers</div>
            </div>
            <div className="w-px h-8 bg-[rgba(var(--color-primary-rgb),0.15)]" />
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)] font-display">Oslo</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mt-0.5">Norway</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIVIDER: Gold arc SVG ── */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: 'calc(52% - 40px)', width: '80px' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 80 800"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft shadow on left edge of photo */}
          <defs>
            <linearGradient id="arcFade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--color-bg)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Fade rect that bleeds the left panel over the photo edge */}
          <rect x="0" y="0" width="60" height="800" fill="url(#arcFade)" />
          {/* Gold arc line */}
          <path
            d="M 40 0 Q 20 400 40 800"
            stroke="#C6A255"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* ── RIGHT: Photo panel ── */}
      <div className="relative lg:w-1/2 xl:w-[48%] min-h-[50vh] lg:min-h-screen">
        <img
          src="/hero-children.jpg"
          alt="Children from the Masjid Rahma community enjoying a day out together in Oslo"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        {/* Subtle top & bottom fade to blend with page */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--color-bg), transparent)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
          aria-hidden="true"
        />

        {/* Floating next-prayer pill on the photo — decorative only */}
        <div className="absolute top-8 right-6 z-10 hidden md:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-[rgba(16,34,26,0.6)] border border-[rgba(17,212,131,0.2)] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide">
            {nextPrayer ? `${nextPrayer.name.charAt(0).toUpperCase() + nextPrayer.name.slice(1)} coming up` : 'Isha coming up'}
          </span>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════
        DASHBOARD BENTO — below the fold
    ══════════════════════════════════════════ */}
    <section className="relative bg-[var(--color-bg)] px-4 py-12 md:py-16">
      <div
        className="w-full max-w-5xl mx-auto"
        style={{ animation: 'dashboard-rise 1s ease-out 0.3s both' }}
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[rgba(var(--color-primary-rgb),0.12)]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Prayer Times & Updates
          </span>
          <div className="h-px flex-1 bg-[rgba(var(--color-primary-rgb),0.12)]" />
        </div>

        {/* Outer glass container with animated border */}
        <div className="relative rounded-3xl p-[1px] overflow-hidden">
          <div
            className="absolute inset-[-50%]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, #11d483 10%, transparent 20%, rgba(198,162,85,0.6) 35%, transparent 45%, #047857 60%, transparent 70%, rgba(17,212,131,0.4) 85%, transparent 100%)',
              animation: 'border-spin 16s linear infinite',
              opacity: 0.08,
            }}
          />

          {/* Dashboard inner content */}
          <div className="relative hero-glass rounded-3xl p-4 md:p-6">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(17,212,131,0.3), rgba(198,162,85,0.2), rgba(17,212,131,0.3), transparent)',
              }}
              aria-hidden="true"
            />

            {/* Bento grid */}
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {/* Row 1: 5 Prayer Time Cards */}
              <div className="col-span-12 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {PRAYER_ORDER.map((name) => (
                  <PrayerCard
                    key={name}
                    name={name}
                    time={schedule.prayers[name].time}
                    iqamah={schedule.prayers[name].iqamah}
                    icon={PRAYER_ICONS[name]}
                    isActive={nextPrayer?.name === name}
                    label={tPrayer(name)}
                  />
                ))}
              </div>

              {/* Row 2: Jummah full-width */}
              <JummahCard schedule={schedule} t={tPrayer} />

              {/* Row 3: Project Showcase | Calendar | Countdown */}
              <ProjectShowcaseCard />
              <CalendarCard />
              <CountdownCard />

              {/* Row 4: Quick Actions | Upcoming Activities */}
              <QuickActionsCard />
              <UpcomingActivityCard />
            </div>
          </div>
        </div>

        {/* Bottom ambient glow */}
        <div
          className="mx-auto mt-[-2px] w-3/4 h-16 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(17,212,131,0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  </>
);
```

**Step 2: Verify it compiles**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
Expected: `200`

**Step 3: Commit**
```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: split hero layout — photo right, content left, dashboard below fold"
```

---

### Task 3: Add `next/image` optimisation for the hero photo

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

The raw `<img>` works but Next.js `<Image>` gives better LCP. However, since this is a local file with `fill` layout, we need to confirm `next.config.ts` doesn't restrict it.

**Step 1: Check next.config.ts**

Read `next.config.ts`. If it has `images.domains` or `remotePatterns`, note them — no change needed for local `/public` images.

**Step 2: Replace `<img>` with `<Image>` in the photo panel**

Add import at top of file:
```tsx
import Image from 'next/image';
```

Replace:
```tsx
<img
  src="/hero-children.jpg"
  alt="Children from the Masjid Rahma community enjoying a day out together in Oslo"
  className="absolute inset-0 w-full h-full object-cover object-center"
  loading="eager"
  fetchPriority="high"
/>
```

With:
```tsx
<Image
  src="/hero-children.jpg"
  alt="Children from the Masjid Rahma community enjoying a day out together in Oslo"
  fill
  className="object-cover object-center"
  priority
  sizes="(max-width: 1024px) 100vw, 48vw"
/>
```

**Step 3: Verify no console errors**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
Expected: `200`

**Step 4: Commit**
```bash
git add src/components/home/HeroSection.tsx
git commit -m "perf: use next/image with fill+priority for hero photo"
```

---

### Task 4: Light-mode polish — ensure left panel is readable

**Files:**
- Modify: `src/app/globals.css`

In light mode the background is `#ffffff → #dcfce7` gradient. The left panel needs to stay legible with the white/green bg. The right photo panel's top/bottom fade uses `var(--color-bg)` which correctly maps to white in light mode. The only potential issue is the "next prayer" pill being dark-on-dark.

**Step 1: Make the pill adaptive in HeroSection.tsx**

In `HeroSection.tsx`, find the floating next-prayer pill div:
```tsx
className="... backdrop-blur-md bg-[rgba(16,34,26,0.6)] border border-[rgba(17,212,131,0.2)] shadow-lg"
```

Change to use CSS variable so it's readable in both modes:
```tsx
className="... backdrop-blur-md bg-[rgba(16,34,26,0.65)] dark:bg-[rgba(16,34,26,0.65)] border border-[rgba(17,212,131,0.25)] shadow-lg"
```
(This is already dark-glass — fine in both modes since it's on top of the photo which is always the photo image.)

**Step 2: Verify light mode looks correct**

Toggle light mode in the browser (click the theme toggle in navbar). Check:
- Left panel text is readable ✓
- Right photo is clear with no green overlay ✓
- Gold arc divider is visible ✓

**Step 3: Commit if any changes made**
```bash
git add src/components/home/HeroSection.tsx src/app/globals.css
git commit -m "fix: light mode polish on split hero"
```

---

### Task 5: Remove unused CSS animations for particle/aurora

**Files:**
- Modify: `src/app/globals.css`

The `@keyframes particle-rise` and `@keyframes aurora-drift` rules are no longer needed since we removed those components.

**Step 1: Remove these keyframe blocks from globals.css**

Remove:
```css
@keyframes aurora-drift {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.18; }
  25% { transform: translate(40px, -30px) scale(1.15); opacity: 0.25; }
  50% { transform: translate(-20px, 20px) scale(0.95); opacity: 0.20; }
  75% { transform: translate(30px, 10px) scale(1.08); opacity: 0.22; }
}

:root:not(.dark) .aurora-blob {
  opacity: 0.07 !important;
}

@keyframes particle-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  8% { opacity: 0.6; }
  85% { opacity: 0.4; }
  100% { transform: translateY(-105vh) translateX(30px); opacity: 0; }
}
```

**Step 2: Commit**
```bash
git add src/app/globals.css
git commit -m "chore: remove unused aurora and particle CSS animations"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/home/HeroSection.tsx` | Remove `ParticleField` + `AuroraBackground`; restructure return JSX to split layout; dashboard bento moved to separate `<section>` below |
| `src/app/globals.css` | Remove `@keyframes aurora-drift`, `.aurora-blob`, `@keyframes particle-rise` |
| `public/hero-children.jpg` | Already downloaded — no change needed |

## Visual Result

```
┌─────────────────────────────────────────────────────────┐
│  LEFT (52%)                │ ╲  RIGHT (48%)              │
│                            │  ╲                          │
│  [Est. Oslo 1995 badge]    │   ╲  [PHOTO: happy          │
│                            │    ╲  children on           │
│  Welcome to                │     ╲  autumn outing]       │
│  Masjid Rahma              │      │                      │
│                            │      │  [next prayer pill]  │
│  Subtitle text here        │      │                      │
│                            │      │                      │
│  [Visit Us] [Become Member]│      │                      │
│  Ramadan Calendar ↗        │      │                      │
│                            │      │                      │
│  30+ yrs | 5 prayers | Oslo│      │                      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│          ─── Prayer Times & Updates ───                  │
│  [Fajr] [Dhuhr] [Asr] [Maghrib] [Isha]                  │
│  [Jummah Banner]                                         │
│  [Project] [Calendar] [Countdown]                        │
│  [Quick Actions] [Upcoming Events]                       │
└─────────────────────────────────────────────────────────┘
```
