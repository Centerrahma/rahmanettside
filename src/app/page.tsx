import type { Metadata } from 'next';
import { Suspense, lazy } from 'react';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import ShowcaseCardStack from '@/components/home/ShowcaseCardStack';

const FacebookFeed = lazy(() => import('@/components/home/FacebookFeed'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'hero' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `Masjid Rahma Oslo — ${t('subtitle')}`,
    description: t('subtitle'),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: 'Masjid Rahma Oslo',
      description: t('subtitle'),
      url: baseUrl,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
      images: [{ url: '/nymoskeoversikt_opt.jpg', width: 1200, height: 630, alt: 'Masjid Rahma Oslo' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Masjid Rahma Oslo',
      description: t('subtitle'),
      images: ['/nymoskeoversikt_opt.jpg'],
    },
  };
}

function MosqueJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Mosque',
    name: 'Masjid Rahma',
    alternateName: 'Masjid Rahma Oslo',
    url: 'https://masjidrahma.no',
    telephone: '+47 22 12 34 56',
    email: 'contact@masjidrahma.no',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tvetenveien 154',
      addressLocality: 'Oslo',
      postalCode: '0671',
      addressCountry: 'NO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 59.9127,
      longitude: 10.7601,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '05:00',
      closes: '23:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <MosqueJsonLd />
      <HeroSection />
      <ShowcaseCardStack />
      <Suspense>
        <FacebookFeed />
      </Suspense>
    </>
  );
}
