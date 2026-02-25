# Typography Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Space Grotesk + Inter with Source Serif 4 (headings) + Plus Jakarta Sans (body) across the entire site for a calm, sacred, modern feel.

**Architecture:** Two files change — `layout.tsx` swaps the font imports and CSS variables, `globals.css` updates the theme tokens and body style. All 14+ components using `--font-display` will automatically resolve to Source Serif 4 via CSS variable cascade. No component-level edits needed.

**Tech Stack:** Next.js `next/font/google`, Tailwind CSS v4 `@theme`, CSS custom properties

---

### Task 1: Replace font imports in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx:1-22` (font imports and instantiation)

**Step 1: Replace the import statement**

Change line 2 from:
```tsx
import { Space_Grotesk, Inter, Amiri } from 'next/font/google';
```
to:
```tsx
import { Source_Serif_4, Plus_Jakarta_Sans, Amiri } from 'next/font/google';
```

**Step 2: Replace Space_Grotesk instantiation with Source_Serif_4**

Replace lines 5-9:
```tsx
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
```
with:
```tsx
const sourceSerif = Source_Serif_4({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
```

**Step 3: Replace Inter instantiation with Plus_Jakarta_Sans**

Replace lines 11-15:
```tsx
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
```
with:
```tsx
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
```

**Step 4: Update body className**

Replace line 48:
```tsx
className={`${spaceGrotesk.variable} ${inter.variable} ${amiri.variable} antialiased`}
```
with:
```tsx
className={`${sourceSerif.variable} ${plusJakarta.variable} ${amiri.variable} antialiased`}
```

---

### Task 2: Update CSS theme tokens in globals.css

**Files:**
- Modify: `src/app/globals.css:4-11` (theme block)

**Step 1: Update the Tailwind v4 @theme block**

Replace lines 4-11:
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--color-primary-val);
  --color-primary-dark: #0eba6f;
  --font-sans: var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```
with:
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--color-primary-val);
  --color-primary-dark: #0eba6f;
  --font-sans: var(--font-jakarta), system-ui, sans-serif;
  --font-display: var(--font-display), Georgia, serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```

**Step 2: Update body font-family**

Replace line 91:
```css
  font-family: var(--font-space-grotesk, var(--font-inter, system-ui, sans-serif));
```
with:
```css
  font-family: var(--font-jakarta, system-ui, sans-serif);
```

---

### Task 3: Verify the build compiles

**Step 1: Run the dev server build**

Run: `cd /Users/daodilyas/Desktop/moskenettside && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no font-related errors.

If build fails, check for typos in font names or CSS variable references.

---

### Task 4: Visual verification

**Step 1: Start dev server and check the site**

Run: `cd /Users/daodilyas/Desktop/moskenettside && npx next dev`

Verify in browser:
- Body text (nav, paragraphs, buttons) renders in Plus Jakarta Sans
- Headings on all pages (home, heritage, services, contact, become-member, new-mosque, donate) render in Source Serif 4
- Arabic text still renders in Amiri
- No FOUT (flash of unstyled text) — fonts should be optimized by next/font

---

### Task 5: Commit

**Step 1: Stage and commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: replace Space Grotesk with Source Serif 4 + Plus Jakarta Sans

Swap the typography system from techy geometric (Space Grotesk/Inter)
to a calm, sacred-modern pairing (Source Serif 4 for headings,
Plus Jakarta Sans for body). Amiri for Arabic text unchanged.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
