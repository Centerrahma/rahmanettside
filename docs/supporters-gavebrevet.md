# Supporters page: Gavebrevet

The selected B composition replaces the older portal drawing on `/stott-oss`: one luminous green arch over three equal cream giving panels. The page including the shared navbar fits the tested desktop viewport; the shared footer starts below it. Phone and tablet layouts stack the panels naturally.

## Giving content

- One-time Vipps: 77811, `https://qr.vipps.no/donations/77811`.
- Monthly-giving contact number: 43392, `https://qr.vipps.no/donations/43392`, supplied by the owner. This link opens Vipps; this change does not create or guarantee an automatic recurring-payment agreement.
- Bank transfer: `BANK_ACCOUNT` remains null. The visible message is “Kontonummer kommer”; the contact action opens an email to `post@centerrahma.no`.

Both QR PNGs have four-module quiet zones and remain stationary. They bypass image optimization so their module edges and white background stay intact. Physical phone-camera validation and confirmation of the monthly-giving account setup remain owner checks.

The Quran excerpt is the existing project's 3:92 text. Its visible reference is plain “Koranen 3:92”, without an external link or additional source text.

## Implementation and review

`Supporters.tsx` owns the page. The bottom blessing and visible pause control have been removed at the owner's request; system reduced-motion preferences still stop the animation. `supporters.module.css` owns its responsive styles and matches the front-page green plaster background, using the same texture, scale and luminosity blend. The only shared navigation styling is scoped to the supporters route. Giving destinations use the existing shared links module. No payment handler or checkout logic changes.

The renderer now reads the actual motion preference before its first draw, avoiding a completed-arch frame followed by a jump back to the particle entrance. Further visual motion tuning remains open for owner feedback.

`light-arch.ts` owns a bounded 9,000-point WebGL scene, capped to 1.5 device pixel ratio and approximately 30 rendered frames per second. It stops scheduling frames when paused, off screen or hidden, respects reduced motion, and releases its resources/listeners on route change. A CSS arch remains when WebGL is unavailable or its context is lost. The arch uses pixel-space bounds fitted to the measured heading, with its rails outside the copy. A continuous curve replaces the perspective projection and rectangular text masks that clipped the arch on phones and cut gaps around the heading. Particles travel along that curve with a short fade-in; brightness compensates for particle spacing along the crown. Pointer-driven rotation has been removed so the silhouette stays stable. QR codes are outside the renderer and every animated ancestor.

Review covered correctness, accessibility, maintainability, security and animation lifecycle. It found and resolved mobile footer/control overlap and added production lifecycle handling missing from the standalone prototype. No blocking source-review findings remain. Older unused illustration modules were left in place to keep this change focused.

## Arch repair validation

The live deployment reproduced top-edge clipping in a pixel-level browser check. The repaired production renderer passed at 1440×900, 1366×768, 1280×720, 768×1024, 390×844 and 320×740: no bright pixels clipped at the top, both rails visible, no glow pixels inside the heading bounds, changing animation pixels, stationary QR bounds, reduced-motion stop/resume, buffer cleanup and no drawing after route navigation. Production build and targeted ESLint passed. Desktop and phone screenshots were reviewed. The visual treatment is a stable, softly forming arch with light travelling along its outline; it intentionally replaces the previous scattered-particle entrance and pointer rotation. Owner review of that motion is still pending.
## Validation

The checks below describe the original integration. For the subsequent plaster, text and animation-initialization changes, the production build, TypeScript, targeted ESLint and `git diff --check` passed. Hidden Chrome checks against `next start` at 1440, 768 and 390 pixels verified the texture treatment, plain verse reference, removed corner controls, QR image presence, no horizontal overflow, no completed-arch flash during the entrance, reduced-motion stopping and no page errors. Desktop and phone screenshots were visually reviewed. The removed pause-control assertions below no longer apply to the current UI. Further visual animation tuning remains open for owner feedback.

- `npm run build`: passed, including TypeScript and static generation.
- ESLint on all changed TS/TSX files: passed.
- `npm test`: all six existing tests passed.
- Hidden Chrome against `next start`: seven viewport sizes (1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844 and 320×740). Checked equal desktop panel bounds, first-screen fit, footer/control separation, number/QR collisions, minimum 16px giving text, heading overflow, correct destinations and mobile menu/Escape.
- Live browser checks: changing WebGL frames, fixed QR bounds and pixel interiors during hover, pause/resume, dynamic reduced motion, GPU buffer cleanup and stopped drawing after client navigation, plus a forced no-WebGL fallback.
- OpenCV independently decoded both shipped source PNGs and six production-rendered QR crops at desktop, narrow desktop and phone sizes: eight images, all exact intended URLs.
- Desktop and phone screenshots were visually reviewed. Local test scripts and screenshots are retained in the separate preview workspace, not bundled in the website.

The local build reports multiple ancestor lockfiles and missing MyMasjid environment variables (mock prayer data), and the installed Browserslist data is old. These are existing environment conditions; no dependency, prayer-time or workspace-root changes are included. No real payment or physical-camera test was performed.
