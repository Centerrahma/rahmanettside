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

/**
 * Full-page aurora background with particles and Islamic pattern.
 * Renders as a fixed layer behind all page content.
 * Light mode gets stronger opacity so the effect is visible on white.
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Aurora blobs — spread across both sides */}

      {/* Large emerald — center top */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.30] dark:opacity-[0.20]"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, var(--color-primary-val) 0%, transparent 70%)',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(150px)',
          animation: 'aurora-drift 10s ease-in-out infinite',
        }}
      />

      {/* Gold accent — left side */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.22] dark:opacity-[0.14]"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, #C6A255 0%, transparent 70%)',
          top: '35%',
          left: '10%',
          filter: 'blur(130px)',
          animation: 'aurora-drift 14s ease-in-out infinite reverse',
        }}
      />

      {/* Gold accent — right side (mirror) */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.20] dark:opacity-[0.12]"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, #C6A255 0%, transparent 70%)',
          top: '60%',
          right: '8%',
          filter: 'blur(120px)',
          animation: 'aurora-drift 16s ease-in-out 2s infinite',
        }}
      />

      {/* Deep emerald — right side */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-25 dark:opacity-[0.16]"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, #047857 0%, transparent 70%)',
          top: '50%',
          right: '5%',
          filter: 'blur(130px)',
          animation: 'aurora-drift 12s ease-in-out 3s infinite',
        }}
      />

      {/* Deep emerald — left side (stronger to match right which gets center blob bleed) */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.35] dark:opacity-25"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, #047857 0%, transparent 70%)',
          top: '45%',
          left: '0%',
          filter: 'blur(130px)',
          animation: 'aurora-drift 13s ease-in-out 5s infinite reverse',
        }}
      />

      {/* Gold top highlight — center */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.18] dark:opacity-[0.12]"
        style={{
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.3) 0%, transparent 70%)',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(90px)',
          animation: 'aurora-drift 16s ease-in-out 5s infinite',
        }}
      />

      {/* Emerald glow — lower left (visible behind showcase cards as user scrolls) */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.25] dark:opacity-[0.16]"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, #047857 0%, transparent 70%)',
          top: '55%',
          left: '5%',
          filter: 'blur(140px)',
          animation: 'aurora-drift 15s ease-in-out 2s infinite',
        }}
      />

      {/* Gold glow — lower right (visible behind showcase cards as user scrolls) */}
      <div
        className="hidden md:block aurora-blob absolute rounded-full opacity-[0.18] dark:opacity-[0.10]"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, #C6A255 0%, transparent 70%)',
          top: '70%',
          right: '10%',
          filter: 'blur(130px)',
          animation: 'aurora-drift 13s ease-in-out 4s infinite reverse',
        }}
      />

      {/* ─── Mobile Optimized Background ─── */}
      <div
        className="md:hidden aurora-blob absolute rounded-[100%] opacity-[0.25] dark:opacity-[0.20]"
        style={{
          width: '150vw',
          height: '80vh',
          background: 'radial-gradient(ellipse, var(--color-primary-val) 0%, rgba(198,162,85,0.4) 40%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 20s ease-in-out infinite',
        }}
      />

      {/* Particle starfield — desktop only */}
      <div className="hidden md:block">
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
      <div className="absolute inset-0 pattern-islamic opacity-10" />
    </div>
  );
}
