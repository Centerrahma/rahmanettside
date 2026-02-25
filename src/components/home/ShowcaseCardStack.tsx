'use client';

import { useTranslations } from 'next-intl';
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
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=560&fit=crop',
  },
  {
    id: 'rahmaSkole',
    href: '/rahma-skole',
    icon: 'school',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=560&fit=crop',
  },
  {
    id: 'bliMedlem',
    href: '/become-member',
    icon: 'person_add',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=560&fit=crop',
  },
  {
    id: 'nyMoske',
    href: '/new-mosque',
    icon: 'mosque',
    image:
      'https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?w=900&h=560&fit=crop',
  },
] as const;

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function ShowcaseCardStack() {
  const t = useTranslations('showcase');

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
    <section className="pt-4 pb-4 md:py-24 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block relative z-10">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title="Utforsk Fellesskapet"
            centered
          />
        </div>

        <div className="md:mt-12">
          <CardStack cards={cards} />
        </div>
      </div>
    </section>
  );
}
