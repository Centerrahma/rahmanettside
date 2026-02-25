# Light Mode: Emerald Green Primary Color

**Date:** 2026-02-24
**Goal:** Change light mode primary green from bright mint (#11d483) to deep emerald (#047857). Dark mode stays untouched.

## Approach: CSS Variable Swap + Hardcoded Color Cleanup (Approach B)

### 1. CSS Variable Changes (`globals.css` `:root` block)

| Variable | Before | After |
|---|---|---|
| `--color-primary-val` | `#11d483` | `#047857` |
| `--color-primary-rgb` | `17, 212, 131` | `4, 120, 87` |
| `--color-primary-dark` | `#0eba6f` | `#065f46` |
| `--prayer-active-bg` | `rgba(17, 212, 131, ...)` | `rgba(4, 120, 87, ...)` |
| `--prayer-active-border` | `rgba(17, 212, 131, 0.3)` | `rgba(4, 120, 87, 0.3)` |
| `--prayer-active-shadow` | `rgba(17, 212, 131, 0.15)` | `rgba(4, 120, 87, 0.15)` |

Dark mode (`.dark` block) remains unchanged.

### 2. Hardcoded #11d483 Replacements in Components

Replace inline `#11d483` with `var(--color-primary-val)` where possible:

- **HeroSection.tsx**: Aurora blob radial gradients, conic gradient borders, glow lines
- **CalendarCard.tsx**: Conic gradient border

For SVG data URIs (can't use CSS variables), leave as-is since they're decorative at very low opacity.

### 3. Files NOT Changed

- Dark mode CSS variables (`.dark` block)
- SVG data URI patterns in ShowcaseSection.tsx and globals.css (decorative, low opacity)
- Tailwind `bg-green-500` classes in MembershipForm/ContactForm (success states, not brand green)

### 4. Scope

~3-5 files modified. No new dependencies or structural changes.
