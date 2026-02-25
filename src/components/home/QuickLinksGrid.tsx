import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';

const quickLinks = [
  {
    titleKey: 'newMosqueTitle' as const,
    descKey: 'newMosqueDesc' as const,
    icon: 'mosque',
    href: '/new-mosque' as const,
    accent: 'from-[var(--color-primary-val)] to-emerald-400',
  },
  {
    titleKey: 'servicesTitle' as const,
    descKey: 'servicesDesc' as const,
    icon: 'school',
    href: '/services' as const,
    accent: 'from-amber-400 to-orange-400',
  },
  {
    titleKey: 'contactTitle' as const,
    descKey: 'contactDesc' as const,
    icon: 'mail',
    href: '/contact' as const,
    accent: 'from-blue-400 to-indigo-400',
  },
];

export default function QuickLinksGrid() {
  const t = useTranslations('hub');
  const tc = useTranslations('common');

  return (
    <section className="py-24 bg-[var(--color-surface)] relative">
      <Container>
        <SectionHeader
          eyebrow={t('sectionLabel')}
          title={t('sectionTitle')}
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {quickLinks.map((link) => (
            <Link
              key={link.titleKey}
              href={link.href}
              className="group relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary-val)] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-icons text-white text-xl">
                  {link.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                {t(link.titleKey)}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                {t(link.descKey)}
              </p>
              <span className="text-sm font-medium text-[var(--color-text)] flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                {tc('learnMore')}
                <span className="material-icons text-sm">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
