# Compact Bento Services Grid - Design

**Date:** 2026-02-28
**Component:** `src/components/heritage/ServicesGrid.tsx`

## Goal

Replace the uniform 4-column services grid with a compact bento grid layout. 9 tiles total (8 services + contact note) with mixed sizes for visual hierarchy.

## Layout

4-column CSS grid, 3 rows on desktop. Prayer and Education are the emphasized large tiles.

### Desktop (lg: grid-cols-4)

```
┌──────────────────┐ ┌────────┐ ┌────────┐
│ PRAYER (span-2)  │ │ Friday │ │  Eid   │
├────────┬─────────┤ ├────────┤ ├────────┤
│ Safe   │ Social  │ │Guidance│ │ Venue  │
├────────┴─────────┤ ├────────┴─┴────────┤
│ EDUCATION (sp-2) │ │ CONTACT (span-2)  │
└──────────────────┘ └───────────────────┘
```

### Tablet (md: grid-cols-2)

All span-2 tiles collapse to span-2 in 2-col grid. Small tiles are single cells.

### Mobile (grid-cols-1)

All tiles stack vertically.

## Tile Variants

### Large tiles (Prayer, Education) - col-span-2
- Icon: 40px in primary/10 circle
- Title: text-lg font-bold
- Description: text-sm text-muted
- Padding: p-5 md:p-6
- glass-panel rounded-xl

### Small tiles (Friday, Eid, Safe, Social, Guidance, Venue)
- Icon: 24px inline with text
- Text: text-sm font-medium, single line
- Padding: p-4
- glass-panel rounded-xl
- Icon + text in horizontal flex layout

### Contact tile - col-span-2
- Gold heart icon with color-gold/10 background
- Italic description text, text-muted
- Visually distinct via subtle gold border tint

## Grid Config
- Gap: gap-3 (tighter than current gap-5)
- Animations: staggered whileInView fade-up, 0.04s delay per tile

## Files Changed
- `src/components/heritage/ServicesGrid.tsx` - rewrite grid layout

## Decisions
- Contact note absorbed into bento grid as 9th tile
- Prayer + Education are large (col-span-2) for visual hierarchy
- Tighter gap-3 for compact bento feel
- Small tiles use horizontal icon+text layout for density
