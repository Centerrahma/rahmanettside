'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SECTIONS = [
  { id: 'ungRahma',   href: '/ung-rahma',    image: '/UngRahma.jpeg',          icon: 'group' },
  { id: 'rahmaSkole', href: '/rahma-skole',   image: '/Rahmaskole_opt.jpg',     icon: 'school' },
  { id: 'bliMedlem',  href: '/become-member', image: '/BliMedlem_opt.jpg',      icon: 'person_add' },
  { id: 'nyMoske',    href: '/new-mosque',    image: '/nymoskeoversikt_opt.jpg', icon: 'mosque' },
] as const;

function ShowcaseCard({
  id,
  href,
  image,
  icon,
  index,
}: (typeof SECTIONS)[number] & { index: number }) {
  const t = useTranslations('showcase');
  const isEven = index % 2 === 0;

  return (
    <article className="relative rounded-2xl overflow-hidden group">
      {/* ── Desktop: full image background with floating glass card ── */}
      <div className="hidden md:block relative min-h-[450px]">
        <Image
          src={image}
          alt={t(`${id}.title`)}
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay — direction alternates, opacity adapts to theme */}
        <div
          className={`absolute inset-0 ${
            isEven
              ? 'bg-gradient-to-r'
              : 'bg-gradient-to-l'
          } from-black/50 dark:from-black/55 via-black/20 to-transparent`}
        />
        {/* Floating glass card */}
        <div
          className={`absolute inset-y-0 flex items-center p-8 md:p-12 ${
            isEven ? 'left-0' : 'right-0'
          }`}
          style={{ maxWidth: '50%' }}
        >
          <div
            className="bg-[var(--glass-card-bg)] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]
                        border border-[var(--glass-card-border)] rounded-2xl p-7
                        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                        transition-shadow duration-300
                        group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_25px_rgba(var(--color-primary-rgb),0.15)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[var(--color-gold)] text-xl">
                {icon}
              </span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gold)]">
                {t(`${id}.subtitle`)}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">
              {t(`${id}.title`)}
            </h3>
            <p className="text-sm text-white/85 leading-relaxed mb-5">
              {t(`${id}.description`)}
            </p>
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold
                         bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                         text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                         transition-colors duration-200"
            >
              {t(`${id}.cta`)}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked image + card ── */}
      <div className="md:hidden">
        <div className="relative h-[200px]">
          <Image
            src={image}
            alt={t(`${id}.title`)}
            fill
            className="object-cover rounded-t-2xl"
            sizes="100vw"
          />
        </div>
        <div
          className="bg-[var(--glass-card-bg)] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]
                      border border-[var(--glass-card-border)] border-t-0 rounded-b-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[var(--color-gold)] text-lg">
              {icon}
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-gold)]">
              {t(`${id}.subtitle`)}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 font-[family-name:var(--font-display)]">
            {t(`${id}.title`)}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
            {t(`${id}.description`)}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                       bg-[rgba(var(--color-primary-rgb),0.15)] border border-[rgba(var(--color-primary-rgb),0.35)]
                       text-[var(--color-primary-val)] hover:bg-[rgba(var(--color-primary-rgb),0.25)]
                       transition-colors duration-200"
          >
            {t(`${id}.cta`)}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ShowcaseSections() {
  const t = useTranslations('showcase');

  return (
    <section className="bg-[var(--color-bg)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-[var(--color-text-muted)]">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {t('title')}
          </h2>
        </div>

        {/* 4 showcase sections */}
        <div className="flex flex-col gap-12 md:gap-16">
          {SECTIONS.map((section, i) => (
            <ShowcaseCard key={section.id} {...section} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
