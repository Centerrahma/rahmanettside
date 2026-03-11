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
          <CardStack cards={cards} />
        </div>
      </div>
    </section>
  );
}
