import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import MapHero from '@/components/contact/MapHero';
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
      images: [{ url: '/nymoskeoversikt_opt.jpg', width: 1200, height: 630, alt: 'Kontakt Masjid Rahma' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('directInquiry')} — Masjid Rahma`,
      description: t('visitDesc'),
      images: ['/nymoskeoversikt_opt.jpg'],
    },
  };
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Map Hero with ContactInfoCard overlaid */}
      <MapHero />

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <ContactForm />
      </section>
    </main>
  );
}
