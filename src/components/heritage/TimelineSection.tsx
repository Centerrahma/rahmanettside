import { useTranslations } from 'next-intl';
import TimelineItem from './TimelineItem';

export default function TimelineSection() {
  const t = useTranslations('heritage');

  const timelineItems = [
    {
      year: t('foundation.year'),
      title: t('foundation.title'),
      description: t('foundation.desc'),
      isLeft: true,
      icon: 'foundation',
    },
    {
      year: t('expansion.year'),
      title: t('expansion.title'),
      description: t('expansion.desc'),
      isLeft: false,
      icon: 'apartment',
    },
    {
      year: t('digital.year'),
      title: t('digital.title'),
      description: t('digital.desc'),
      isLeft: true,
      icon: 'devices',
    },
    {
      year: t('present.year'),
      title: t('present.title'),
      description: t('present.desc'),
      isLeft: false,
      icon: 'hub',
    },
  ];

  return (
    <section className="relative py-12 md:py-20">
      {/* Center Vertical Line */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>

      {/* Timeline Items */}
      <div className="relative pl-20 md:pl-0">
        {timelineItems.map((item, index) => (
          <TimelineItem
            key={index}
            year={item.year}
            title={item.title}
            description={item.description}
            isLeft={item.isLeft}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
