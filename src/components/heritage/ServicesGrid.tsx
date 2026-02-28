'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

type TileSize = 'large' | 'small' | 'contact';

interface ServiceTile {
  key: string;
  icon: string;
  size: TileSize;
}

const tiles: ServiceTile[] = [
  // Row 1
  { key: 'prayer', icon: 'mosque', size: 'large' },
  { key: 'friday', icon: 'event', size: 'small' },
  { key: 'eid', icon: 'celebration', size: 'small' },
  // Row 2
  { key: 'safespace', icon: 'diversity_3', size: 'small' },
  { key: 'social', icon: 'groups', size: 'small' },
  { key: 'guidance', icon: 'support_agent', size: 'small' },
  { key: 'venue', icon: 'meeting_room', size: 'small' },
  // Row 3
  { key: 'education', icon: 'school', size: 'large' },
  { key: 'contact', icon: 'favorite', size: 'contact' },
];

function LargeTile({ icon, text, delay }: { icon: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="md:col-span-2 glass-panel rounded-xl p-5 md:p-6 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
          <span className="material-icons text-primary text-xl">{icon}</span>
        </div>
        <p className="text-[var(--color-text)] text-sm md:text-base leading-relaxed font-medium pt-1.5">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function SmallTile({ icon, text, delay }: { icon: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="glass-panel rounded-xl p-4 group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
          <span className="material-icons text-primary text-lg">{icon}</span>
        </div>
        <p className="text-[var(--color-text)] text-sm leading-snug font-medium">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function ContactTile({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="md:col-span-2 glass-panel rounded-xl p-5 md:p-6 border-[var(--color-gold)]/20"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0">
          <span className="material-icons text-[var(--color-gold)] text-xl">favorite</span>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed italic pt-1.5">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const t = useTranslations('heritage');

  return (
    <section className="mb-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {t('services.eyebrow')}
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
          {t('services.title')}
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
          {t('services.subtitle')}
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((tile, index) => {
          const delay = index * 0.04;

          if (tile.size === 'contact') {
            return (
              <ContactTile
                key={tile.key}
                text={t('contact.text')}
                delay={delay}
              />
            );
          }

          const text = t(`services.${tile.key}`);

          if (tile.size === 'large') {
            return (
              <LargeTile
                key={tile.key}
                icon={tile.icon}
                text={text}
                delay={delay}
              />
            );
          }

          return (
            <SmallTile
              key={tile.key}
              icon={tile.icon}
              text={text}
              delay={delay}
            />
          );
        })}
      </div>
    </section>
  );
}
