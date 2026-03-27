import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { UserPlus } from 'lucide-react';
import MembershipForm from '@/components/membership/MembershipForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'membership' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('pageTitle')} — Masjid Rahma`,
    description: t('pageDescription'),
    alternates: {
      canonical: `${baseUrl}/become-member`,
    },
    openGraph: {
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('pageDescription'),
      url: `${baseUrl}/become-member`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
      images: [{ url: '/BliMedlem.jpeg', width: 1200, height: 630, alt: 'Bli medlem i Masjid Rahma' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('pageDescription'),
      images: ['/BliMedlem.jpeg'],
    },
  };
}

export default async function BecomeMemberPage() {
  const t = await getTranslations({ locale: 'no', namespace: 'membership' });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-val)]/10 text-[var(--color-primary-val)] text-sm font-medium mb-6">
            <UserPlus className="w-5 h-5" />
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            {t('pageDescription')}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <MembershipForm />
      </section>
    </main>
  );
}
