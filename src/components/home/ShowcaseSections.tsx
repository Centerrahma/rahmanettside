'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SECTIONS = [
  { id: 'ungRahma',   href: '/ung-rahma',    image: '/UngRahma_opt.jpg' },
  { id: 'rahmaSkole', href: '/rahma-skole',   image: '/Rahmaskole_opt.jpg' },
  { id: 'bliMedlem',  href: '/become-member', image: '/BliMedlem_opt.jpg' },
  { id: 'nyMoske',    href: '/new-mosque',    image: '/nymoskeoversikt_opt.jpg' },
] as const;

function ShowcaseCard({
  id,
  href,
  image,
  index,
}: (typeof SECTIONS)[number] & { index: number }) {
  const t = useTranslations('showcase');
  const isEven = index % 2 === 0;

  return (
    <article className="relative rounded-2xl overflow-hidden group
                        shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_6px_rgba(0,0,0,0.06)]
                        dark:shadow-[0_4px_24px_rgba(0,0,0,0.4),0_1px_6px_rgba(0,0,0,0.2)]
                        transition-shadow duration-300
                        hover:shadow-[0_8px_40px_rgba(0,0,0,0.15),0_2px_12px_rgba(0,0,0,0.1)]
                        dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_2px_12px_rgba(0,0,0,0.3)]">
      {/* ── Desktop: side-by-side image + content card ── */}
      <div className={`hidden md:grid md:grid-cols-2 min-h-[336px] ${
        isEven ? '' : 'direction-rtl'
      }`} style={isEven ? undefined : { direction: 'rtl' }}>
        {/* Image side */}
        <div className="relative" style={{ direction: 'ltr' }}>
          <Image
            src={image}
            alt={t(`${id}.title`)}
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        {/* Content card side */}
        <div
          className="bg-[var(--glass-card-bg)]
                      border border-[var(--glass-card-border)]
                      flex flex-col justify-center p-6 lg:p-9
                      transition-all duration-300
                      shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
                      dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]
                      group-hover:shadow-[0_12px_48px_rgba(var(--color-primary-rgb),0.18),0_4px_16px_rgba(0,0,0,0.12)]
                      dark:group-hover:shadow-[0_12px_48px_rgba(var(--color-primary-rgb),0.25),0_4px_16px_rgba(0,0,0,0.4)]"
          style={{ direction: 'ltr' }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-3 font-[family-name:var(--font-display)]">
            {t(`${id}.title`)}
          </h3>

          <p className="text-sm text-[var(--color-text)] opacity-70 leading-relaxed mb-4">
            {t(`${id}.description`)}
          </p>

          <Link
            href={href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold w-fit
                       bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                       text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                       transition-colors duration-200"
          >
            {t(`${id}.cta`)}
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>

      {/* ── Mobile: stacked image + card ── */}
      <div className="md:hidden">
        <div className="relative h-[160px]">
          <Image
            src={image}
            alt={t(`${id}.title`)}
            fill
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div
          className="bg-[var(--glass-card-bg)]
                      border border-[var(--glass-card-border)] border-t-0 rounded-b-2xl p-4
                      shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
                      dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]"
        >
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 font-[family-name:var(--font-display)]">
            {t(`${id}.title`)}
          </h3>
          <p className="text-sm text-[var(--color-text)] opacity-70 leading-relaxed mb-3">
            {t(`${id}.mobileDescription`)}
          </p>

          <Link
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                       bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                       text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                       transition-colors duration-200"
          >
            {t(`${id}.cta`)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ShowcaseSections() {
  const t = useTranslations('showcase');

  return (
    <section className="relative py-10 md:py-14 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-[var(--color-text-muted)]">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {t('title')}
          </h2>
        </div>

        {/* 4 showcase sections */}
        <div className="flex flex-col gap-6 md:gap-12">
          {SECTIONS.map((section, i) => (
            <ShowcaseCard key={section.id} {...section} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
