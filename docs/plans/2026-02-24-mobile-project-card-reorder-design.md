# Mobile: Move ProjectShowcaseCard Above Dashboard

**Date:** 2026-02-24
**File:** `src/components/home/HeroSection.tsx`

## Goal

On mobile, the ProjectShowcaseCard (rotating project progress) should appear directly beneath the hero CTA buttons (Visit / Donate), outside and above the dashboard bento grid.

Desktop layout is unchanged.

## Approach

Conditional rendering with duplicate (Approach A):

1. Render `<ProjectShowcaseCard />` in a `md:hidden` wrapper between the CTA buttons and the dashboard container.
2. Hide the existing `<ProjectShowcaseCard />` inside the bento grid on mobile with `hidden md:block`.

## Mobile Layout Order

1. Hero text (title + subtitle)
2. CTA buttons (Visit / Donate)
3. **ProjectShowcaseCard** (mobile-only, standalone)
4. Dashboard bento grid (prayer cards, Jummah, CalendarCard + CountdownCard)

## Changes

### HeroSection.tsx

- After the CTA buttons `</div>` and before the dashboard `<div>`, insert:
  ```tsx
  <div className="md:hidden w-full max-w-5xl mx-auto mt-4 px-2">
    <ProjectShowcaseCard />
  </div>
  ```

- On the existing `<ProjectShowcaseCard />` inside the bento grid, change its wrapper to hide on mobile:
  - The card uses `className="col-span-12 md:col-span-4"` internally. Wrap it or adjust so it gets `hidden md:block` on mobile.

No other files change.
