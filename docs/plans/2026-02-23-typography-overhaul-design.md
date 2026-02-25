# Typography Overhaul: Sacred & Modern

**Date:** 2026-02-23
**Goal:** Replace the robotic, techy feel of Space Grotesk with a typography system that evokes calm, warmth, and the dignity of a holy place — while staying modern and readable.

## Font Stack

| Role | Current | New |
|------|---------|-----|
| Headings (h1-h5, display) | Space Grotesk | **Source Serif 4** |
| Body / UI text | Space Grotesk | **Plus Jakarta Sans** |
| Arabic text | Amiri | **Amiri** (unchanged) |
| Monospace | System mono | System mono (unchanged) |

## Weights

- **Source Serif 4:** 400, 600, 700
- **Plus Jakarta Sans:** 300, 400, 500, 600, 700
- **Amiri:** 400, 700 (unchanged)

## Implementation Scope

### File: `src/app/layout.tsx`
- Remove `Space_Grotesk` and `Inter` imports from `next/font/google`
- Add `Source_Serif_4` with variable `--font-display`, subsets `['latin']`, weights `['400', '600', '700']`
- Add `Plus_Jakarta_Sans` with variable `--font-jakarta`, subsets `['latin']`, weights `['300', '400', '500', '600', '700']`
- Keep `Amiri` unchanged
- Update body className to include new font variables

### File: `src/app/globals.css`
- Update `--font-sans` to use `var(--font-jakarta)` as primary
- Add `--font-display` to theme using `var(--font-display-var)` (Source Serif 4)
- Update body `font-family` to use the new sans stack

### Components: No Changes Needed
- Many components already reference `font-[family-name:var(--font-display)]` for headings — this will now resolve correctly to Source Serif 4 (currently broken/falling back)
- Body text inherits from the CSS variable cascade
- No individual component edits required

## Design Rationale

- **Source Serif 4** is a refined transitional serif by Adobe, designed for screen readability. It carries the calm, dignified presence of sacred architecture without feeling stuffy or dated.
- **Plus Jakarta Sans** is a soft geometric sans-serif. Modern and clean, but with friendlier curves than Space Grotesk — removing the "robotic" feel while maintaining readability.
- **Amiri** now harmonizes with Source Serif headings (serif + serif for Arabic/Latin) instead of clashing with the previous geometric sans.

## Risk Assessment

- **Low risk:** Both fonts are free on Google Fonts and supported by `next/font`
- **No component changes:** CSS variable propagation handles everything
- **Amiri unchanged:** Arabic rendering is unaffected
