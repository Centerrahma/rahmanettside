# Homepage Showcase Redesign

## Problem

The current homepage has a density imbalance: the hero section is packed (prayer dashboard, countdown, calendar, project showcase, Jummah bar), then drops off to a single carousel (ShowcaseCardStack) that hides 4 key initiatives behind interaction, followed by a Facebook embed. The page feels empty after the hero.

## Solution

Replace the carousel with 4 full-width showcase sections using Layout B (full background image + floating glassmorphism card), and restructure the bottom into a side-by-side Facebook feed + Vipps donation widget.

## Design Decisions

- **Layout B chosen over A**: Full-width image backgrounds with floating glass cards (not alternating image/text columns). More cinematic, better use of existing photography.
- **Equal weight**: All 4 sections get identical visual treatment — no section is more prominent.
- **Glassmorphism**: Using existing CSS variables (`--glass-card-bg`, `--glass-card-border`, backdrop-blur). Particularly effective in dark mode.
- **Mobile**: Stacks vertically — image on top (~200px), glass card below as full-width block.
- **Abandoning scroll-driven approach**: An unused `ShowcaseSection.tsx` (676 lines) exists with parallax/sticky scroll mechanics. We are intentionally not using that approach — static full-width sections with glass cards are simpler, more performant, and naturally handle reduced-motion preferences without a fallback.

## Architecture

### Files to modify

- `src/app/page.tsx` — Replace `ShowcaseCardStack` import with new `ShowcaseSections` component; replace `FacebookFeed` with `BottomRow`
- `src/i18n/messages/en.json` — Add `showcase` namespace (matching keys from `no.json`)

### Files to create

- `src/components/home/ShowcaseSections.tsx` — 4 full-width showcase sections
- `src/components/home/BottomRow.tsx` — Side-by-side Facebook feed + Vipps donation widget
- `src/components/home/VippsDonationCard.tsx` — Standalone Vipps widget extracted from VideoAndDonate pattern

### Files to delete

- `src/components/home/ShowcaseCardStack.tsx` — Replaced by ShowcaseSections
- `src/components/ui/card-stack.tsx` — Only imported by ShowcaseCardStack.tsx (and its duplicate `(1)` copy). Safe to delete.
- `src/components/home/ShowcaseSection.tsx` — Unused 676-line parallax version, never imported in page.tsx. Delete to avoid confusion.

### Files to leave unchanged

- `src/components/home/FacebookFeed.tsx` — Keep as-is. BottomRow will render a compact inline version rather than modifying this shared component.

## Component: ShowcaseSections

### Data

```ts
const SECTIONS = [
  { id: 'ungRahma',   href: '/ung-rahma',     image: '/UngRahma.jpeg',         icon: 'group' },
  { id: 'rahmaSkole', href: '/rahma-skole',    image: '/Rahmaskole_opt.jpg',    icon: 'school' },
  { id: 'bliMedlem',  href: '/become-member',  image: '/BliMedlem_opt.jpg',     icon: 'person_add' },
  { id: 'nyMoske',    href: '/new-mosque',     image: '/nymoskeoversikt_opt.jpg', icon: 'mosque' },
];
```

Translations from `showcase` i18n namespace: `title`, `subtitle`, `description`, `cta` per section ID.

### Layout (per section)

**Desktop (md+):**
- Full-width container (max-w-7xl) with `Next/Image` as background (`fill`, `object-cover`, `sizes="100vw"`)
- Gradient overlay for readability:
  - Dark mode: `rgba(0,0,0,0.5)` to `transparent` (direction alternates per section)
  - Light mode: `rgba(0,0,0,0.35)` to `transparent` (lighter overlay since images provide contrast)
- Floating glassmorphism card positioned left (odd sections) or right (even sections), max-width ~50%
- Glass card contains: eyebrow subtitle, title (font-display), description, CTA button
- Section height: `min-h-[450px]`, rounded-2xl
- Spacing between sections: `gap-12 md:gap-16` (48-64px)

**Mobile (<md):**
- Image on top: `h-[200px]`, rounded-t-2xl, object-cover
- Glass card below: full-width, rounded-b-2xl, no overlay
- Contains same content: eyebrow, title, description, CTA
- Stacked vertically

### Glass card styling

Uses existing CSS variables. Note: `--color-primary-rgb` is comma-separated (e.g., `4, 120, 87`) which allows `rgba(var(--color-primary-rgb), 0.15)` syntax.

```css
background: var(--glass-card-bg);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);  /* Safari support */
border: 1px solid var(--glass-card-border);
border-radius: 16px;
padding: 28px;
box-shadow: 0 8px 32px rgba(0,0,0,0.3);
```

### CTA button

```css
background: rgba(var(--color-primary-rgb), 0.15);
border: 1px solid rgba(var(--color-primary-rgb), 0.35);
color: var(--color-primary-val);
/* Hover: background opacity increases to 0.25 */
```

Links to respective `href`. Includes arrow_forward icon.

### Accessibility

- Each section image has descriptive alt text via `t('${id}.title')`
- CTA buttons are `<Link>` elements (keyboard navigable by default)
- Static layout naturally works with reduced-motion preferences — no fallback needed
- Each section is a semantic `<article>` or `<div role="group">`

## Component: BottomRow

### Layout

**Desktop (md+):**
- `grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`, inside max-w-7xl container
- Left: Compact Facebook feed iframe
- Right: Vipps donation widget
- Both wrapped in glass-panel cards, equal height (`items-stretch`)
- Section padding: `py-16 md:py-24`

**Mobile (<md):**
- Stacks vertically: Facebook feed on top, Vipps below
- Full width each

### Facebook feed (left)

Renders an inline version (not importing FacebookFeed component to avoid modifying it):
- Facebook page plugin iframe at reduced height (~400px)
- Same scaling logic as existing component (measure container, scale if needed)
- Glass-panel wrapper
- "Follow us" link below iframe
- Skeleton loader while iframe loads

### Vipps donation widget (right)

**i18n exception**: Vipps is a Norway-only payment service. All Vipps-related strings are hardcoded in Norwegian, matching the existing pattern in `VideoAndDonate.tsx`. This is intentional — there is no English equivalent.

Contains (extracted from `VideoAndDonate.tsx` pattern):
- Header: volunteer_activism icon + "Støtt Masjid Rahma"
- Info box: explains one-time/monthly Vipps options
- QR code: `/vippsdonasjon.png` (220x220) in white rounded container
- Orange CTA button: "Doner med Vipps" → `https://qr.vipps.no/donations/43392`
- Vipps numbers grid: 77811 and 43392
- Same glass-panel styling as Facebook side

## Section header

Above the 4 showcase sections:
- Eyebrow: `showcase.eyebrow` ("UTFORSK FELLESSKAPET VÅRT")
- Title: from translations or "Utforsk Fellesskapet"
- Uses existing SectionHeader component or inline equivalent

## Animations

- Each showcase section fades in on scroll via CSS `@starting-style` or intersection observer
- Glass cards: `hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)]` on desktop
- No heavy animations — images and glass do the visual work

## Responsive breakpoints

| Breakpoint | Showcase sections | Bottom row |
|------------|-------------------|------------|
| < md (mobile) | Stacked: image top, card below | Stacked vertically |
| md+ (desktop) | Full image bg + floating glass card | Side-by-side grid-cols-2 |

## Error handling

- Images use Next/Image with `sizes="100vw"` for showcase backgrounds
- Facebook iframe keeps existing skeleton loader pattern
- Vipps strings are hardcoded Norwegian (see i18n exception above)
- All showcase text from i18n `showcase` namespace

## Testing

- Visual verification in both light and dark mode
- Mobile responsive check at 375px width
- Verify all 4 CTA links navigate correctly
- Verify Vipps QR code and button link work
- Confirm `card-stack.tsx` and `ShowcaseCardStack.tsx` have no other importers before deletion
- Verify `en.json` has showcase namespace after adding it
