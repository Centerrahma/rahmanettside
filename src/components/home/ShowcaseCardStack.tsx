'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CardStack, { type CardStackItem } from '@/components/ui/card-stack';

/* ═══════════════════════════════════════════════
   CATEGORY CONFIG
   ═══════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'ungRahma',   href: '/ung-rahma',     icon: 'group',      image: '/UngRahma.jpeg' },
  { id: 'rahmaSkole', href: '/rahma-skole',   icon: 'school',     image: '/Rahmaskole.jpeg' },
  { id: 'bliMedlem',  href: '/become-member', icon: 'person_add', image: '/BliMedlem.jpeg' },
  { id: 'nyMoske',    href: '/new-mosque',    icon: 'mosque',     image: '/nymoskeoversikt.png' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function ShowcaseCardStack() {
  const t = useTranslations('showcase');
  const [activeIndex, setActiveIndex] = useState(0);
  const [btnVisible, setBtnVisible] = useState(true);

  // Fade the button briefly when active card changes
  useEffect(() => {
    setBtnVisible(false);
    const id = setTimeout(() => setBtnVisible(true), 180);
    return () => clearTimeout(id);
  }, [activeIndex]);

  const currentCat = CATEGORIES[activeIndex % CATEGORIES.length];

  const cards: CardStackItem[] = CATEGORIES.map((cat) => ({
    id: cat.id,
    title: t(`${cat.id}.title`),
    subtitle: t(`${cat.id}.subtitle`),
    description: t(`${cat.id}.description`),
    ctaText: t(`${cat.id}.cta`),
    href: cat.href,
    image: cat.image,
    icon: (
      <span
        className="material-symbols-outlined text-white/90"
        style={{ fontSize: '24px' }}
      >
        {cat.icon}
      </span>
    ),
  }));

  return (
    <section className="bg-[var(--color-bg)]" style={{ paddingBottom: '80px' }}>
      <div className="max-w-2xl mx-auto px-6 sm:px-8">

        {/* ── Section header ── */}
        <div className="text-center" style={{ paddingTop: '64px', paddingBottom: '0px' }}>
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Utforsk Fellesskapet
          </h2>
        </div>

        {/*
          ── Card stack container ──
          paddingTop: 20% of container width gives ~134px at max-w-2xl.
          The stacked cards overflow upward by max 18.75% of container width
          (3 cards × 10% OFFSET × aspect ratio 10/16 = 18.75%), so 20% is safe.
          This means the overflow stays inside this padding — no header clash.
        */}
        <div style={{ paddingTop: '24%' }}>
          <CardStack cards={cards} onCardChange={setActiveIndex} />
        </div>

        {/* ── CTA button below the carousel ── */}
        <div className="hidden md:flex justify-center mt-8">
          <Link
            href={currentCat.href}
            className="group inline-flex items-center gap-3 rounded-full font-bold text-white text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              padding: '14px 32px',
              background: 'var(--color-primary-val)',
              boxShadow: '0 4px 24px rgba(var(--color-primary-rgb), 0.35)',
              opacity: btnVisible ? 1 : 0,
              transition: 'opacity 0.18s ease, transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
            >
              {currentCat.icon}
            </span>
            {t(`${currentCat.id}.cta`)}
            <span
              className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1"
              style={{ fontSize: '18px' }}
            >
              arrow_forward
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
