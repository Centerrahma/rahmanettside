'use client';

/* ─── Particle starfield ─── */
const PARTICLES_DESKTOP = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 4.17) % 100}%`,
  delay: `${(i * 0.6) % 15}s`,
  duration: `${14 + (i * 0.7) % 16}s`,
  size: `${1 + (i % 3)}px`,
  opacity: 0.2 + (i % 5) * 0.08,
}));

/*
 * Aurora blobs distributed along the full page height.
 * Alternating left/right so the glow appears on both sides as you scroll.
 * Using viewport-height units (vh) so they spread across the full page.
 */
const AURORA_BLOBS = [
  // Top area — center emerald
  { w: 900, h: 900, bg: 'var(--color-primary-val)', top: '5vh', left: '50%', tx: '-50%', blur: 150, opacity: 0.2, anim: 'aurora-drift 10s ease-in-out infinite' },
  // Gold — top left
  { w: 500, h: 400, bg: 'rgba(212,168,67,0.3)', top: '8vh', left: '15%', blur: 90, opacity: 0.12, anim: 'aurora-drift 16s ease-in-out 5s infinite' },
  // Emerald — left, below hero
  { w: 700, h: 700, bg: '#047857', top: '80vh', left: '0%', blur: 130, opacity: 0.16, anim: 'aurora-drift 12s ease-in-out 3s infinite' },
  // Gold — right, below hero
  { w: 600, h: 600, bg: '#C6A255', top: '100vh', right: '5%', blur: 120, opacity: 0.13, anim: 'aurora-drift 14s ease-in-out infinite reverse' },
  // Emerald — right, showcase area
  { w: 700, h: 700, bg: '#047857', top: '160vh', right: '0%', blur: 130, opacity: 0.15, anim: 'aurora-drift 13s ease-in-out 2s infinite' },
  // Gold — left, showcase area
  { w: 600, h: 600, bg: '#C6A255', top: '200vh', left: '5%', blur: 120, opacity: 0.13, anim: 'aurora-drift 15s ease-in-out 4s infinite reverse' },
  // Emerald — left, lower showcase
  { w: 650, h: 650, bg: '#047857', top: '260vh', left: '0%', blur: 120, opacity: 0.14, anim: 'aurora-drift 11s ease-in-out 1s infinite' },
  // Gold — right, bottom row area
  { w: 550, h: 550, bg: '#C6A255', top: '310vh', right: '8%', blur: 110, opacity: 0.12, anim: 'aurora-drift 14s ease-in-out 3s infinite reverse' },
  // Emerald — right, footer area
  { w: 600, h: 600, bg: 'var(--color-primary-val)', top: '350vh', right: '5%', blur: 130, opacity: 0.15, anim: 'aurora-drift 12s ease-in-out 6s infinite' },
] as const;

/**
 * Full-page aurora background with particles and Islamic pattern.
 * Uses absolute positioning within a full-height wrapper so blobs
 * are distributed along the entire page, visible on both sides as you scroll.
 */
export default function PageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Aurora blobs — distributed across full page height, alternating sides */}
      {AURORA_BLOBS.map((blob, i) => (
        <div
          key={i}
          className="aurora-blob absolute rounded-full"
          style={{
            width: `${blob.w}px`,
            height: `${blob.h}px`,
            background: `radial-gradient(circle, ${blob.bg} 0%, transparent 70%)`,
            top: blob.top,
            left: 'left' in blob ? blob.left : undefined,
            right: 'right' in blob ? blob.right : undefined,
            transform: 'tx' in blob ? `translateX(${blob.tx})` : undefined,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            animation: blob.anim,
          }}
        />
      ))}

      {/* Particle starfield — desktop only, fixed so they float in viewport */}
      <div className="fixed inset-0 hidden md:block pointer-events-none">
        {PARTICLES_DESKTOP.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[var(--color-gold)]"
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
      <div className="fixed inset-0 pattern-islamic opacity-10 pointer-events-none" />
    </div>
  );
}
