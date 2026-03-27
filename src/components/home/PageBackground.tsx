'use client';

/* ─── Particle starfield (reduced from 24 to 10 for perf) ─── */
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 10) % 100}%`,
  delay: `${(i * 1.5) % 15}s`,
  duration: `${14 + (i * 1.7) % 16}s`,
  size: `${1 + (i % 3)}px`,
  opacity: 0.2 + (i % 5) * 0.08,
}));

/**
 * Full-page aurora background with particles and Islamic pattern.
 * Renders as a fixed layer behind all page content.
 *
 * Perf notes:
 *  - 3 blobs (down from 8) — the visual overlap of many blobs is
 *    indistinguishable from fewer, larger ones, but each animated
 *    blur() layer costs real GPU time.
 *  - Mobile uses lower blur values (60-80px vs 120-150px desktop).
 *  - `will-change: transform` hints the compositor to promote layers.
 *  - Particles reduced from 24 to 10 and desktop-only.
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">

      {/* ── Blob 1: Large emerald — center top ── */}
      <div
        className="aurora-blob absolute rounded-full opacity-[0.30] dark:opacity-[0.20]"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, var(--color-primary-val) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(100px)',
          willChange: 'transform',
          animation: 'aurora-drift 14s ease-in-out infinite',
        }}
      />

      {/* ── Blob 2: Gold accent — left/center ── */}
      <div
        className="aurora-blob absolute rounded-full opacity-[0.25] dark:opacity-[0.15]"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, #C6A255 0%, transparent 70%)',
          top: '40%',
          left: '5%',
          filter: 'blur(100px)',
          willChange: 'transform',
          animation: 'aurora-drift 18s ease-in-out infinite reverse',
        }}
      />

      {/* ── Blob 3: Deep emerald — right side ── */}
      <div
        className="aurora-blob absolute rounded-full opacity-[0.30] dark:opacity-[0.18]"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, #047857 0%, transparent 70%)',
          top: '55%',
          right: '0%',
          filter: 'blur(100px)',
          willChange: 'transform',
          animation: 'aurora-drift 16s ease-in-out 3s infinite',
        }}
      />

      {/* Particle starfield — desktop only (SSR-safe: rendered only on md+) */}
      <div className="contents max-md:hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="hidden md:block absolute rounded-full bg-[var(--color-gold)]"
            style={{
              left: p.left,
              bottom: '-2%',
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `particle-rise ${p.duration} ${p.delay} linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle Islamic pattern overlay */}
      <div className="absolute inset-0 pattern-islamic opacity-10" />
    </div>
  );
}
