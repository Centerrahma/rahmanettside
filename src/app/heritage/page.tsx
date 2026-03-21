import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import AboutIntro from '@/components/heritage/AboutIntro';
import ServicesGrid from '@/components/heritage/ServicesGrid';
import TimelineSection from '@/components/heritage/TimelineSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'heritage' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('pageTitle')} — Masjid Rahma`,
    description: t('intro.desc'),
    alternates: {
      canonical: `${baseUrl}/heritage`,
    },
    openGraph: {
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('intro.desc'),
      url: `${baseUrl}/heritage`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
      images: [{ url: '/nymoskeoversikt_opt.jpg', width: 1200, height: 630, alt: 'Om Masjid Rahma' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('intro.desc'),
      images: ['/nymoskeoversikt_opt.jpg'],
    },
  };
}

export default function HeritagePage() {
  const t = useTranslations('heritage');
  return (
    <main className="min-h-screen pt-32 pb-20">
      <Container>
        {/* Page Header */}
        <header className="text-center mb-20">
          <p className="text-[var(--color-text-muted)] mb-2">{t('subtitle')}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {t('pageTitle')}
          </h1>
        </header>

        {/* About Intro */}
        <AboutIntro />

        {/* Services Grid */}
        <ServicesGrid />

        {/* History Timeline */}
        <TimelineSection />
      </Container>
    </main>
  );
}
