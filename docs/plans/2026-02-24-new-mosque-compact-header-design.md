# New Mosque Page: Compact Header with Mosque Image

**Date:** 2026-02-24
**Status:** Approved

## Goal

Shrink the New Mosque page header and place the `nymoskeoversikt.png` image next to the title, so the header fits compactly between the page top and the donation project cards.

## Changes

### Header Section (`src/app/new-mosque/page.tsx`)

1. Replace centered single-column header with a two-column flex row inside `Container`
2. Left column (~45%): `next/image` showing `/nymoskeoversikt.png` with rounded corners and glass border
3. Right column (~55%): badge, title, subtitle — all left-aligned
4. Title font size reduced from `text-5xl md:text-7xl` to `text-3xl md:text-4xl`
5. Header bottom margin reduced from `mb-12` to `mb-8`
6. Background glow repositioned behind the image
7. Mobile: image stacks above title, constrained max-height

### Untouched

- All project cards, Vipps box, DonationWidget, StatsRow, bento grid layout
