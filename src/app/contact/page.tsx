import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import MapHero from '@/components/contact/MapHero';
import VirtualTourPreview from '@/components/contact/VirtualTourPreview';
import ContactForm from '@/components/contact/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'contact' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('directInquiry')} — Masjid Rahma`,
    description: t('visitDesc'),
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      title: `${t('directInquiry')} — Masjid Rahma`,
      description: t('visitDesc'),
      url: `${baseUrl}/contact`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
    },
  };
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Map Hero with ContactInfoCard overlaid */}
      <MapHero />

      {/* Content Grid: Virtual Tour & Form */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <VirtualTourPreview />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
