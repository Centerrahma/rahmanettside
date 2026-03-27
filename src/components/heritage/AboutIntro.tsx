'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export default function AboutIntro() {
  const t = useTranslations('heritage');

  return (
    <section className="mb-24">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {t('intro.eyebrow')}
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
          {t('intro.title')}
        </h2>
      </motion.div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative glass-panel p-8 md:p-12 rounded-2xl overflow-hidden"
      >
        {/* Decorative gradient corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[var(--color-gold)]/8 to-transparent rounded-tr-full pointer-events-none" />

        {/* Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="text-primary w-6 h-6" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="space-y-5 relative z-10">
          <p className="text-[var(--color-text)] text-lg md:text-xl leading-relaxed font-[family-name:var(--font-display)]">
            {t('intro.desc')}
          </p>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {t('intro.desc2')}
          </p>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {t('intro.desc3')}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
