import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';
import { Users, GraduationCap, HeartHandshake } from 'lucide-react';

export default function MissionSection() {
  const t = useTranslations('heritage');

  const missionCards: { title: string; description: string; icon: LucideIcon }[] = [
    {
      title: t('community.title'),
      description: t('community.desc'),
      icon: Users,
    },
    {
      title: t('education.title'),
      description: t('education.desc'),
      icon: GraduationCap,
    },
    {
      title: t('service.title'),
      description: t('service.desc'),
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
          {t('missionTitle')}
        </h2>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {missionCards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all duration-300 group"
          >
            {/* Icon Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <card.icon className="text-primary w-9 h-9" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[var(--color-text)] text-center mb-4 font-[family-name:var(--font-display)]">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-[var(--color-text-muted)] text-center leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
