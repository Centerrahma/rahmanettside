'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Landmark, Building, Home } from 'lucide-react';

const timelineItems: { key: string; icon: LucideIcon; isLeft: boolean }[] = [
  { key: 'founding', icon: Landmark, isLeft: true },
  { key: 'move', icon: Building, isLeft: false },
  { key: 'permanent', icon: Home, isLeft: true },
];

export default function TimelineSection() {
  const t = useTranslations('heritage');

  return (
    <section className="pb-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {t('history.eyebrow')}
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
          {t('history.title')}
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Center vertical line */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        {timelineItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`relative flex items-start mb-16 md:mb-20 ${
              item.isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Content Card */}
            <div
              className={`w-full md:w-5/12 pl-16 md:pl-0 ${
                item.isLeft ? 'md:pr-16' : 'md:pl-16'
              }`}
            >
              <div className="glass-panel rounded-xl p-6 md:p-8 group cursor-pointer">
                {/* Year badge inside card */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary text-[var(--color-bg)] px-4 py-1.5 rounded-full text-sm font-bold">
                    {t(`history.${item.key}.year`)}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-3 font-[family-name:var(--font-display)]">
                  {t(`history.${item.key}.title`)}
                </h3>

                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {t(`history.${item.key}.desc`)}
                </p>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <item.icon className="text-primary w-5 h-5" />
              </div>
            </div>

            {/* Empty space on other side */}
            <div className="hidden md:block w-5/12" />
          </motion.div>
        ))}

        {/* End dot */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 bottom-0">
          <div className="w-4 h-4 rounded-full bg-primary/30" />
        </div>
      </div>
    </section>
  );
}
