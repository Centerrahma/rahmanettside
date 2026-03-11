'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CardStack, { type CardStackItem } from '@/components/ui/card-stack';
import SectionHeader from '@/components/ui/SectionHeader';

/* ═══════════════════════════════════════════════
   CATEGORY CONFIG
   Same categories as the old ShowcaseSection
   ═══════════════════════════════════════════════ */

const CATEGORIES = [
  {
    id: 'ungRahma',
    href: '/ung-rahma',
    icon: 'group',
    image: '/UngRahma.jpeg',
  },
  {
    id: 'rahmaSkole',
    href: '/rahma-skole',
    icon: 'school',
    image: '/Rahmaskole.jpeg',
  },
  {
    id: 'bliMedlem',
    href: '/become-member',
    icon: 'person_add',
    image: '/BliMedlem.jpeg',
  },
  {
    id: 'nyMoske',
    href: '/new-mosque',
    icon: 'mosque',
    image: '/nymoskeoversikt.png',
  },
] as const;

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function ShowcaseCardStack() {
  const t = useTranslations('showcase');
  const [activeIndex, setActiveIndex] = useState(0);

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

  const activeCard = cards[activeIndex % cards.length];

  return (
    <section className="pt-[100px] pb-[100px] md:pt-24 md:pb-32 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block relative z-10">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title="Utforsk Fellesskapet"
            centered
          />
        </div>

        <div className="md:mt-52">
          <CardStack cards={cards} onCardChange={setActiveIndex} />
        </div>

        {/* Desktop CTA — outside the draggable card so clicks always work */}
        <div className="hidden md:flex justify-center mt-6">
          <Link
            href={activeCard.href ?? '#'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-[var(--color-primary-val)] text-white font-bold text-sm
                       hover:opacity-90 transition-opacity"
          >
            {activeCard.ctaText}
            <span
              className="material-symbols-outlined"
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
