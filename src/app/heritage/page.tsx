import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import TimelineSection from '@/components/heritage/TimelineSection';
import MissionSection from '@/components/heritage/MissionSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'heritage' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('pageTitle')} — Masjid Rahma`,
    description: t('foundation.desc'),
    alternates: {
      canonical: `${baseUrl}/heritage`,
    },
    openGraph: {
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('foundation.desc'),
      url: `${baseUrl}/heritage`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
    },
  };
}

export default function HeritagePage() {
  const t = useTranslations('heritage');
  return (
    <main className="min-h-screen pt-32 pb-20">
      <Container>
        {/* Header */}
        <header className="text-center mb-20">
          <p className="text-[var(--color-text-muted)] mb-2">{t('subtitle')}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {t('pageTitle')}
          </h1>
        </header>

        {/* Timeline */}
        <TimelineSection />

        {/* Mission */}
        <MissionSection />
      </Container>
    </main>
  );
}
