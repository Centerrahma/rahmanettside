# Light Mode Emerald Green Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Change light mode primary green from bright mint (#11d483) to deep emerald (#047857). Dark mode stays untouched.

**Architecture:** CSS custom properties drive the entire color system. Light mode variables live in `:root`, dark mode in `.dark`. Most components reference `var(--color-primary-val)` and `rgba(var(--color-primary-rgb), ...)` already. The remaining work is updating the `:root` values and replacing ~10 hardcoded `#11d483` / `rgba(17, 212, 131, ...)` occurrences in inline styles.

**Tech Stack:** Next.js, Tailwind CSS v4, CSS custom properties

---

### Task 1: Update Light Mode CSS Variables

**Files:**
- Modify: `src/app/globals.css:20-51` (`:root` block only — do NOT touch `.dark` block)

**Step 1: Update primary color variables**

In the `:root` block (lines 20-51), change these three lines:

```css
/* Line 29 */ --color-primary-val: #047857;
/* Line 30 */ --color-primary-rgb: 4, 120, 87;
```

**Step 2: Update primary-dark in the theme block**

In the `@theme inline` block (line 11), change:

```css
--color-primary-dark: #065f46;
```

**Step 3: Update prayer card active variables in `:root`**

Change the light-mode prayer variables (lines 41-43):

```css
--prayer-active-bg: linear-gradient(135deg, rgba(4, 120, 87, 0.12) 0%, rgba(4, 120, 87, 0.08) 100%);
--prayer-active-border: rgba(4, 120, 87, 0.3);
--prayer-active-shadow: 0 0 30px rgba(4, 120, 87, 0.15);
```

**Step 4: Verify dark mode is untouched**

Confirm the `.dark` block (lines 56-87) still has `--color-primary-val: #11d483` and `--color-primary-rgb: 17, 212, 131`.

**Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "style: update light mode primary to emerald #047857"
```

---

### Task 2: Replace Hardcoded Colors in HeroSection

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

**Step 1: Update aurora blob gradient (line 55)**

Change the primary green aurora blob from:
```
background: 'radial-gradient(circle, #11d483 0%, transparent 70%)'
```
to:
```
background: 'radial-gradient(circle, var(--color-primary-val) 0%, transparent 70%)'
```

**Step 2: Update GlassCard conic gradient (line 134)**

Change:
```
background: 'conic-gradient(from 0deg, transparent 0%, #11d483 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)'
```
to:
```
background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)'
```

**Step 3: Update GlassCard hover shadow (line 140)**

Change the Tailwind class:
```
group-hover:shadow-[0_0_25px_rgba(17,212,131,0.15)]
```
to:
```
group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)]
```

**Step 4: Update outer dashboard conic gradient (line 494)**

Change:
```
background: 'conic-gradient(from 0deg, transparent 0%, #11d483 10%, transparent 20%, rgba(198,162,85,0.6) 35%, transparent 45%, #047857 60%, transparent 70%, rgba(17,212,131,0.4) 85%, transparent 100%)'
```
to:
```
background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 10%, transparent 20%, rgba(198,162,85,0.6) 35%, transparent 45%, #047857 60%, transparent 70%, rgba(var(--color-primary-rgb),0.4) 85%, transparent 100%)'
```

**Step 5: Update top glow line (line 506)**

Change:
```
background: 'linear-gradient(90deg, transparent, rgba(17,212,131,0.3), rgba(198,162,85,0.2), rgba(17,212,131,0.3), transparent)'
```
to:
```
background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.3), rgba(198,162,85,0.2), rgba(var(--color-primary-rgb),0.3), transparent)'
```

**Step 6: Update bottom ambient glow (line 550)**

Change:
```
background: 'radial-gradient(ellipse at center, rgba(17,212,131,0.25) 0%, transparent 70%)'
```
to:
```
background: 'radial-gradient(ellipse at center, rgba(var(--color-primary-rgb),0.25) 0%, transparent 70%)'
```

**Step 7: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "style: replace hardcoded #11d483 with CSS vars in HeroSection"
```

---

### Task 3: Replace Hardcoded Colors in CalendarCard

**Files:**
- Modify: `src/components/home/CalendarCard.tsx`

**Step 1: Update conic gradient (line 19)**

Change:
```
background: 'conic-gradient(from 0deg, transparent 0%, #11d483 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)'
```
to:
```
background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)'
```

**Step 2: Update hover shadow class (line 25)**

Change:
```
group-hover:shadow-[0_0_25px_rgba(17,212,131,0.15)]
```
to:
```
group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)]
```

**Step 3: Commit**

```bash
git add src/components/home/CalendarCard.tsx
git commit -m "style: replace hardcoded #11d483 with CSS vars in CalendarCard"
```

---

### Task 4: Update ShowcaseSection gradientLight Values

**Files:**
- Modify: `src/components/home/ShowcaseSection.tsx`

The `gradientLight` values in `VISUALS` are used specifically for light mode. Update them to use the emerald green instead of mint. The `gradient` values (used for dark mode via `dark:block`) stay unchanged.

**Step 1: Update ungRahma gradientLight (line 72)**

Change:
```
gradientLight: 'linear-gradient(135deg, rgba(17, 212, 131, 0.25) 0%, rgba(6, 182, 212, 0.20) 50%, rgba(4, 120, 87, 0.15) 100%)'
```
to:
```
gradientLight: 'linear-gradient(135deg, rgba(4, 120, 87, 0.25) 0%, rgba(6, 182, 212, 0.20) 50%, rgba(4, 120, 87, 0.15) 100%)'
```

**Step 2: Update bliMedlem gradientLight (line 100)**

Change:
```
gradientLight: 'linear-gradient(180deg, rgba(4, 120, 87, 0.22) 0%, rgba(13, 148, 136, 0.18) 50%, rgba(4, 120, 87, 0.12) 100%)'
```
This one already uses `4, 120, 87` — no change needed.

**Step 3: Update nyMoske gradientLight (line 115)**

Change:
```
gradientLight: 'linear-gradient(to top, rgba(17, 212, 131, 0.22) 0%, rgba(198, 162, 85, 0.18) 40%, rgba(4, 120, 87, 0.12) 100%)'
```
to:
```
gradientLight: 'linear-gradient(to top, rgba(4, 120, 87, 0.22) 0%, rgba(198, 162, 85, 0.18) 40%, rgba(4, 120, 87, 0.12) 100%)'
```

**Step 4: Commit**

```bash
git add src/components/home/ShowcaseSection.tsx
git commit -m "style: update ShowcaseSection light mode gradients to emerald"
```

---

### Task 5: Visual Verification

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Check light mode**

Open the site in a browser. Verify:
- Buttons are deep emerald green (#047857)
- Aurora background glows are emerald
- Conic gradient card borders use emerald
- Prayer card active state uses emerald
- Hover states and glow effects are emerald
- Showcase section light-mode gradients are emerald

**Step 3: Check dark mode**

Toggle to dark mode. Verify:
- Everything still uses bright mint green (#11d483)
- No visual regression

**Step 4: Final commit (if any touch-ups needed)**

```bash
git add -A
git commit -m "style: light mode emerald green - final adjustments"
```
