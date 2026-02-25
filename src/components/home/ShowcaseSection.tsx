'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/* ═══════════════════════════════════════════════
   CATEGORY CONFIGURATION
   ═══════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'ungRahma',   href: '/ung-rahma',       icon: 'group' },
  { id: 'rahmaSkole', href: '/rahma-skole',      icon: 'school' },
  { id: 'bliMedlem',  href: '/become-member',    icon: 'person_add' },
  { id: 'nyMoske',    href: '/new-mosque',        icon: 'mosque' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

/* ═══════════════════════════════════════════════
   NOISE TEXTURE (anti-AI-slop grain)
   Tiny SVG data-URI for a subtle organic feel
   ═══════════════════════════════════════════════ */

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════════════
   SVG PATTERN DATA-URIs
   Each category gets a unique geometric overlay
   ═══════════════════════════════════════════════ */

const PATTERNS: Record<CategoryId, string> = {
  // Hexagonal grid — modernity, connectivity
  ungRahma: `url("data:image/svg+xml,%3Csvg width='60' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15L60 37L30 52L0 37L0 15Z' fill='none' stroke='%2311d483' stroke-width='0.4' opacity='0.35'/%3E%3C/svg%3E")`,
  // Diamond tessellation — structure, Islamic art
  rahmaSkole: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0L48 24L24 48L0 24Z' fill='none' stroke='%23C6A255' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M24 8L40 24L24 40L8 24Z' fill='none' stroke='%23C6A255' stroke-width='0.25' opacity='0.2'/%3E%3C/svg%3E")`,
  // Interlocking circles — unity, community bonds
  bliMedlem: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='%2311d483' stroke-width='0.4' opacity='0.25'/%3E%3Ccircle cx='0' cy='30' r='20' fill='none' stroke='%2311d483' stroke-width='0.4' opacity='0.25'/%3E%3Ccircle cx='60' cy='30' r='20' fill='none' stroke='%2311d483' stroke-width='0.4' opacity='0.25'/%3E%3C/svg%3E")`,
  // Star pattern — aspiration, Islamic geometry
  nyMoske: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='none' stroke='%2311d483' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M40 10L70 40L40 70L10 40Z' fill='none' stroke='%23C6A255' stroke-width='0.3' opacity='0.2'/%3E%3C/svg%3E")`,
};

/* ═══════════════════════════════════════════════
   VISUAL CONFIG PER CATEGORY
   Gradients, shapes, and animation parameters
   ═══════════════════════════════════════════════ */

interface ShapeConfig {
  width: string;
  height: string;
  bg: string;
  top: string;
  left: string;
  blur: string;
  opacity: number;
  duration: string;
  delay: string;
  borderRadius?: string;
  border?: string;
}

interface VisualConfig {
  gradient: string;
  gradientLight: string;
  shapes: ShapeConfig[];
}

const VISUALS: Record<CategoryId, VisualConfig> = {
  /* ── Ung Rahma: Emerald → Cyan, floating bubbles ── */
  ungRahma: {
    gradient: 'linear-gradient(135deg, rgba(17, 212, 131, 0.55) 0%, rgba(6, 182, 212, 0.45) 50%, rgba(4, 120, 87, 0.30) 100%)',
    gradientLight: 'linear-gradient(135deg, rgba(4, 120, 87, 0.25) 0%, rgba(6, 182, 212, 0.20) 50%, rgba(4, 120, 87, 0.15) 100%)',
    shapes: [
      { width: '220px', height: '220px', bg: 'radial-gradient(circle, rgba(17, 212, 131, 0.5) 0%, transparent 70%)', top: '15%', left: '60%', blur: '60px', opacity: 0.9, duration: '10s', delay: '0s' },
      { width: '160px', height: '160px', bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)', top: '55%', left: '72%', blur: '40px', opacity: 0.8, duration: '14s', delay: '2s' },
      { width: '100px', height: '100px', bg: 'radial-gradient(circle, rgba(17, 212, 131, 0.5) 0%, transparent 70%)', top: '35%', left: '78%', blur: '30px', opacity: 0.7, duration: '8s', delay: '1s' },
      { width: '70px', height: '70px', bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, transparent 70%)', top: '70%', left: '55%', blur: '20px', opacity: 0.8, duration: '12s', delay: '3s' },
      { width: '400px', height: '400px', bg: 'radial-gradient(circle, rgba(17, 212, 131, 0.25) 0%, transparent 70%)', top: '30%', left: '50%', blur: '100px', opacity: 0.6, duration: '16s', delay: '0s' },
    ],
  },

  /* ── Rahma Skole: Gold → Amber, concentric arcs ── */
  rahmaSkole: {
    gradient: 'linear-gradient(160deg, rgba(198, 162, 85, 0.50) 0%, rgba(245, 158, 11, 0.40) 40%, rgba(198, 162, 85, 0.25) 100%)',
    gradientLight: 'linear-gradient(160deg, rgba(198, 162, 85, 0.22) 0%, rgba(245, 158, 11, 0.18) 40%, rgba(198, 162, 85, 0.12) 100%)',
    shapes: [
      // Large warm glow — center-right, like a lamp of knowledge
      { width: '450px', height: '450px', bg: 'radial-gradient(circle, rgba(198, 162, 85, 0.4) 0%, transparent 60%)', top: '25%', left: '55%', blur: '80px', opacity: 0.8, duration: '12s', delay: '0s' },
      // Arc shapes — concentric curves
      { width: '200px', height: '200px', bg: 'transparent', top: '10%', left: '70%', blur: '0px', opacity: 0.25, duration: '14s', delay: '1s', borderRadius: '0 100% 0 0', border: '2px solid rgba(198, 162, 85, 0.6)' },
      { width: '280px', height: '280px', bg: 'transparent', top: '5%', left: '65%', blur: '0px', opacity: 0.18, duration: '16s', delay: '2s', borderRadius: '0 100% 0 0', border: '1.5px solid rgba(245, 158, 11, 0.5)' },
      { width: '140px', height: '140px', bg: 'transparent', top: '60%', left: '15%', blur: '0px', opacity: 0.20, duration: '10s', delay: '0s', borderRadius: '0 0 0 100%', border: '1.5px solid rgba(198, 162, 85, 0.45)' },
      { width: '300px', height: '300px', bg: 'radial-gradient(circle, rgba(245, 158, 11, 0.20) 0%, transparent 70%)', top: '50%', left: '65%', blur: '60px', opacity: 0.7, duration: '11s', delay: '1.5s' },
    ],
  },

  /* ── Bli Medlem: Deep emerald → Teal, overlapping Venn circles ── */
  bliMedlem: {
    gradient: 'linear-gradient(180deg, rgba(4, 120, 87, 0.50) 0%, rgba(13, 148, 136, 0.40) 50%, rgba(4, 120, 87, 0.28) 100%)',
    gradientLight: 'linear-gradient(180deg, rgba(4, 120, 87, 0.22) 0%, rgba(13, 148, 136, 0.18) 50%, rgba(4, 120, 87, 0.12) 100%)',
    shapes: [
      // Three overlapping circles — Venn diagram / community
      { width: '280px', height: '280px', bg: 'radial-gradient(circle, rgba(17, 212, 131, 0.30) 0%, transparent 60%)', top: '20%', left: '52%', blur: '40px', opacity: 0.9, duration: '13s', delay: '0s' },
      { width: '260px', height: '260px', bg: 'radial-gradient(circle, rgba(13, 148, 136, 0.35) 0%, transparent 60%)', top: '32%', left: '65%', blur: '35px', opacity: 0.8, duration: '11s', delay: '1.5s' },
      { width: '240px', height: '240px', bg: 'radial-gradient(circle, rgba(4, 120, 87, 0.35) 0%, transparent 60%)', top: '42%', left: '57%', blur: '45px', opacity: 0.7, duration: '15s', delay: '0.5s' },
      // Horizontal light band — the "open door"
      { width: '100%', height: '2px', bg: 'linear-gradient(90deg, transparent 10%, rgba(17, 212, 131, 0.35) 50%, transparent 90%)', top: '50%', left: '0%', blur: '8px', opacity: 0.8, duration: '20s', delay: '0s' },
      { width: '400px', height: '400px', bg: 'radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, transparent 70%)', top: '25%', left: '50%', blur: '90px', opacity: 0.6, duration: '16s', delay: '2s' },
    ],
  },

  /* ── Ny Moske: Full brand spectrum, arch silhouette + diamonds ── */
  nyMoske: {
    gradient: 'linear-gradient(to top, rgba(17, 212, 131, 0.50) 0%, rgba(198, 162, 85, 0.40) 40%, rgba(4, 120, 87, 0.28) 100%)',
    gradientLight: 'linear-gradient(to top, rgba(4, 120, 87, 0.22) 0%, rgba(198, 162, 85, 0.18) 40%, rgba(4, 120, 87, 0.12) 100%)',
    shapes: [
      // Tall arch shape — mihrab / mosque silhouette
      { width: '180px', height: '320px', bg: 'linear-gradient(to top, rgba(17, 212, 131, 0.18), rgba(198, 162, 85, 0.12))', top: '12%', left: '63%', blur: '0px', opacity: 0.4, duration: '18s', delay: '0s', borderRadius: '50% 50% 0 0', border: '2px solid rgba(198, 162, 85, 0.35)' },
      // Floating diamonds
      { width: '44px', height: '44px', bg: 'rgba(198, 162, 85, 0.25)', top: '20%', left: '78%', blur: '0px', opacity: 0.5, duration: '10s', delay: '1s', borderRadius: '4px' },
      { width: '32px', height: '32px', bg: 'rgba(17, 212, 131, 0.28)', top: '55%', left: '82%', blur: '0px', opacity: 0.45, duration: '12s', delay: '2.5s', borderRadius: '3px' },
      // Upward radiance glow
      { width: '550px', height: '450px', bg: 'radial-gradient(ellipse at bottom, rgba(17, 212, 131, 0.30) 0%, transparent 70%)', top: '35%', left: '48%', blur: '80px', opacity: 0.7, duration: '14s', delay: '0s' },
      { width: '350px', height: '350px', bg: 'radial-gradient(circle, rgba(198, 162, 85, 0.25) 0%, transparent 70%)', top: '18%', left: '58%', blur: '70px', opacity: 0.6, duration: '16s', delay: '1s' },
    ],
  },
};

/* ═══════════════════════════════════════════════
   SHOWCASE VISUAL — Gradient background per category
   ═══════════════════════════════════════════════ */

function ShowcaseVisual({
  categoryId,
  isActive,
  chapterProgress,
  reducedMotion,
}: {
  categoryId: CategoryId;
  isActive: boolean;
  chapterProgress: number;
  reducedMotion: boolean;
}) {
  const visual = VISUALS[categoryId];
  const pattern = PATTERNS[categoryId];
  const parallaxY = chapterProgress * 15;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.7s ease',
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      {/* Base gradient — vivid in dark, softer in light */}
      <div className="absolute inset-0 dark:hidden" style={{ background: visual.gradientLight }} />
      <div className="absolute inset-0 hidden dark:block" style={{ background: visual.gradient }} />

      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: pattern,
          backgroundRepeat: 'repeat',
          opacity: 0.06,
        }}
      />

      {/* Noise / grain texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Floating shapes */}
      {!reducedMotion &&
        visual.shapes.map((shape, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: shape.width,
              height: shape.height,
              background: shape.bg,
              top: shape.top,
              left: shape.left,
              filter: shape.blur !== '0px' ? `blur(${shape.blur})` : undefined,
              opacity: shape.opacity * (isActive ? 1 : 0),
              borderRadius: shape.borderRadius || '50%',
              border: shape.border || 'none',
              animation: `showcase-float ${shape.duration} ${shape.delay} ease-in-out infinite`,
              transform: isActive
                ? `translateY(${-parallaxY + (i % 2 === 0 ? 5 : -5)}px) rotate(${
                    (shape.borderRadius?.includes('4px') || shape.borderRadius?.includes('3px')) ? '45deg' : '0deg'
                  })`
                : 'translateY(20px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
              willChange: 'opacity, transform',
            }}
          />
        ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHOWCASE CONTENT — Text, subtitle, CTA per category
   ═══════════════════════════════════════════════ */

function ShowcaseContent({
  categoryId,
  href,
  icon,
  isActive,
  chapterProgress,
  t,
}: {
  categoryId: CategoryId;
  href: string;
  icon: string;
  isActive: boolean;
  chapterProgress: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const parallaxY = isActive ? chapterProgress * -8 : 30;
  const scale = isActive ? 1 + chapterProgress * 0.01 : 0.97;

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none"
      style={{
        opacity: isActive ? 1 : 0,
        transform: `translateY(${parallaxY}px) scale(${scale})`,
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        willChange: 'opacity, transform',
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          {/* Icon badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--glass-card-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-card-border)',
            }}
          >
            <span
              className="material-symbols-outlined text-[var(--color-primary-val)]"
              style={{ fontSize: '20px' }}
            >
              {icon}
            </span>
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t(`${categoryId}.subtitle`)}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {t(`${categoryId}.title`)}
          </h3>

          {/* Description */}
          <p
            className="text-lg sm:text-xl leading-relaxed mb-8 max-w-md"
            style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}
          >
            {t(`${categoryId}.description`)}
          </p>

          {/* CTA Button */}
          <Link
            href={href}
            className="pointer-events-auto inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-base cursor-pointer group"
            style={{
              background: 'var(--color-primary-val)',
              color: 'var(--color-bg)',
              boxShadow: isActive
                ? '0 0 30px rgba(var(--color-primary-rgb), 0.3)'
                : 'none',
              transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            }}
          >
            {t(`${categoryId}.cta`)}
            <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1" style={{ fontSize: '20px' }}>
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHOWCASE PROGRESS — Vertical dot rail (desktop)
                        Horizontal dots (mobile)
   ═══════════════════════════════════════════════ */

function ShowcaseProgress({
  activeIndex,
  scrollProgress,
  onDotClick,
}: {
  activeIndex: number;
  scrollProgress: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <>
      {/* Desktop: Vertical rail on the right */}
      <div className="hidden md:flex absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1">
        {/* Background rail line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ background: 'var(--color-border)' }}
        />
        {/* Progress fill */}
        <div
          className="absolute top-0 w-px origin-top"
          style={{
            background: 'var(--color-primary-val)',
            height: '100%',
            transform: `scaleY(${scrollProgress})`,
            transition: 'transform 0.15s ease-out',
          }}
        />
        {/* Dots */}
        {CATEGORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className="relative z-10 my-3 cursor-pointer"
            style={{
              width: activeIndex === i ? '14px' : '8px',
              height: activeIndex === i ? '14px' : '8px',
              borderRadius: '50%',
              background:
                activeIndex === i
                  ? 'var(--color-primary-val)'
                  : 'var(--color-border)',
              boxShadow:
                activeIndex === i
                  ? '0 0 14px rgba(var(--color-primary-rgb), 0.5)'
                  : 'none',
              transition: 'all 0.3s ease',
              border: activeIndex === i ? '2px solid rgba(var(--color-primary-rgb), 0.3)' : '1px solid transparent',
            }}
            aria-label={`Go to section ${i + 1} of ${CATEGORIES.length}`}
          />
        ))}
      </div>

      {/* Mobile: Horizontal dots at bottom */}
      <div className="flex md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center gap-3">
        {CATEGORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className="cursor-pointer"
            style={{
              width: activeIndex === i ? '28px' : '8px',
              height: '8px',
              borderRadius: activeIndex === i ? '4px' : '50%',
              background:
                activeIndex === i
                  ? 'var(--color-primary-val)'
                  : 'var(--color-border)',
              boxShadow:
                activeIndex === i
                  ? '0 0 10px rgba(var(--color-primary-rgb), 0.4)'
                  : 'none',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to section ${i + 1} of ${CATEGORIES.length}`}
          />
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   REDUCED MOTION FALLBACK — Static vertical cards
   ═══════════════════════════════════════════════ */

function ShowcaseFallback({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="py-24" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('eyebrow')}
          </span>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const visual = VISUALS[cat.id];
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="relative overflow-hidden rounded-2xl p-8 min-h-[260px] flex flex-col justify-end cursor-pointer group"
                style={{
                  background: visual.gradientLight,
                  border: '1px solid var(--glass-card-border)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: PATTERNS[cat.id],
                    backgroundRepeat: 'repeat',
                    opacity: 0.05,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="material-symbols-outlined text-[var(--color-primary-val)]"
                      style={{ fontSize: '24px' }}
                    >
                      {cat.icon}
                    </span>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {t(`${cat.id}.subtitle`)}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold tracking-tight mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {t(`${cat.id}.title`)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t(`${cat.id}.description`)}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all duration-200"
                    style={{ color: 'var(--color-primary-val)' }}
                  >
                    {t(`${cat.id}.cta`)}
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SHOWCASE SECTION
   Owns scroll tracking, sticky container, transitions
   ═══════════════════════════════════════════════ */

export default function ShowcaseSection() {
  const t = useTranslations('showcase');
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* ─── Reduced motion detection ─── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ─── Intersection Observer gate ─── */
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reducedMotion]);

  /* ─── Scroll listener (RAF-batched) ─── */
  useEffect(() => {
    if (reducedMotion || !isInView) return;
    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;
        const scrollable = rect.height - windowH;

        if (scrollable <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
        setScrollProgress(progress);

        const idx = Math.min(3, Math.floor(progress * 4));
        setActiveIndex(idx);
        setChapterProgress((progress * 4) - idx);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isInView, reducedMotion]);

  /* ─── Click a progress dot → scroll to chapter ─── */
  const handleDotClick = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const targetProgress = (index + 0.1) / 4;
    const targetScroll = window.scrollY + rect.top + (targetProgress * scrollable);

    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  /* ─── Eyebrow text (memoized) ─── */
  const eyebrow = useMemo(() => t('eyebrow'), [t]);

  /* ─── Reduced motion: show static fallback ─── */
  if (reducedMotion) {
    return <ShowcaseFallback t={t} />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh' }}
      aria-label={eyebrow}
    >
      {/* ─── Sticky viewport container ─── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Top seam: fade from bg */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '120px',
            background: 'linear-gradient(to bottom, var(--color-bg), transparent)',
          }}
        />

        {/* Bottom seam: fade to surface (matches FacebookFeed bg) */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: '120px',
            background: 'linear-gradient(to top, var(--color-bg), transparent)',
          }}
        />

        {/* ── Visual layers (4 stacked, crossfade via opacity) ── */}
        {CATEGORIES.map((cat, i) => (
          <ShowcaseVisual
            key={cat.id}
            categoryId={cat.id}
            isActive={activeIndex === i}
            chapterProgress={activeIndex === i ? chapterProgress : 0}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* ── Text legibility overlay — subtle scrim behind content area ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, var(--color-bg) 0%, transparent 50%)',
            opacity: 0.6,
          }}
        />

        {/* ── Eyebrow label (top-left, fixed) ── */}
        <div className="absolute top-8 left-6 sm:left-8 lg:left-12 z-20">
          <span
            className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {eyebrow}
          </span>
        </div>

        {/* ── Category counter (top-right on mobile) ── */}
        <div className="absolute top-8 right-6 z-20 md:hidden">
          <span
            className="text-xs font-medium tabular-nums"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {activeIndex + 1} / {CATEGORIES.length}
          </span>
        </div>

        {/* ── Content layers (4 stacked, crossfade via opacity) ── */}
        {CATEGORIES.map((cat, i) => (
          <ShowcaseContent
            key={cat.id}
            categoryId={cat.id}
            href={cat.href}
            icon={cat.icon}
            isActive={activeIndex === i}
            chapterProgress={activeIndex === i ? chapterProgress : 0}
            t={t}
          />
        ))}

        {/* ── Progress indicators ── */}
        <ShowcaseProgress
          activeIndex={activeIndex}
          scrollProgress={scrollProgress}
          onDotClick={handleDotClick}
        />
      </div>
    </section>
  );
}
