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
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Aurora blobs */}
      {/* Primary green — large center blob */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, var(--color-primary-val) 0%, transparent 70%)',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(130px)',
          opacity: 0.22,
          animation: 'aurora-drift 10s ease-in-out infinite',
        }}
      />
      {/* Gold accent — left */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #C6A255 0%, transparent 70%)',
          top: '45%',
          left: '25%',
          filter: 'blur(110px)',
          opacity: 0.14,
          animation: 'aurora-drift 14s ease-in-out infinite reverse',
        }}
      />
      {/* Deep emerald — right */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, #047857 0%, transparent 70%)',
          top: '55%',
          right: '15%',
          filter: 'blur(100px)',
          opacity: 0.16,
          animation: 'aurora-drift 12s ease-in-out 3s infinite',
        }}
      />
      {/* Subtle gold top highlight */}
      <div
        className="aurora-blob absolute rounded-full"
        style={{
          width: '300px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.3) 0%, transparent 70%)',
          top: '8%',
          left: '45%',
          filter: 'blur(80px)',
          opacity: 0.12,
          animation: 'aurora-drift 16s ease-in-out 5s infinite',
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
