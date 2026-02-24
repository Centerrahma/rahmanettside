# Mobile Compact Project Tiles

**Date:** 2026-02-24
**Status:** Approved

## Problem

On mobile, the new mosque page shows 8 project cards (7 projects + 1 Vipps card) stacked vertically. Each card is ~200-250px tall with a circular progress ring, title, thick progress bar, target amount, and remaining amount. This creates ~1600-2000px of scrolling just for the cards section — users must scroll through each oversized card one by one.

## Solution

Replace the full-size `ProjectCard` with compact tiles on mobile, arranged in a 2-column grid. All 8 items fit in ~480px (roughly one screen).

## Design

### Compact Tile (mobile < 768px)

Each tile is ~110-120px tall with `p-4` padding:

- **Top:** Project name (text-sm, font-semibold)
- **Middle:** Thin progress bar (h-1.5) with percentage label
- **Bottom:** Target amount (text-xs, muted color)
- **Badge:** Urgent projects get a `border-l-2 border-red-500` left accent instead of a Badge component

No circular SVG ring, no "Remaining" stat, no large spacing.

### Vipps Tile (compact)

- "Vipps" title + "77811" number in primary color
- Small hint text below

### Layout

- **Mobile (< 768px):** `grid-cols-2 gap-3` compact tiles
- **Desktop (>= 768px):** Existing `ProjectCard` in the current bento layout (unchanged)

### Tap Behavior

Tapping a tile:
1. Smooth-scrolls to the DonationWidget
2. Pre-selects that project in the widget
3. DonationWidget accepts a `selectedProject` prop/state

## Components

### New: `CompactProjectTile`

Located at `src/components/donate/CompactProjectTile.tsx`. Used only on mobile via responsive rendering.

### Modified: `src/app/new-mosque/page.tsx`

- Render `CompactProjectTile` grid on mobile, existing `ProjectCard` grid on desktop
- Use CSS `hidden`/`block` responsive classes (no JS media queries)

### Modified: `DonationWidget`

- Accept optional `selectedProject` state
- Expose a ref or ID for scroll targeting

## What Stays the Same

- Desktop/tablet layout: no changes
- `ProjectCard` component: untouched
- Data model (`PROJECTS` constant): untouched
- `DonationWidget` core functionality: untouched
