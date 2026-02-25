import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'servicesPage' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('pageTitle')} — Masjid Rahma`,
    description: t('pageDescription'),
    alternates: {
      canonical: `${baseUrl}/services`,
    },
    openGraph: {
      title: `${t('pageTitle')} — Masjid Rahma`,
      description: t('pageDescription'),
      url: `${baseUrl}/services`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
    },
  };
}

export default async function ServicesPage() {
  const t = await getTranslations({ locale: 'no', namespace: 'servicesPage' });

  const services = [
    {
      titleKey: 'rahmaSchoolTitle' as const,
      descKey: 'rahmaSchoolDesc' as const,
      icon: 'school',
      accent: 'from-amber-400 to-orange-400',
    },
    {
      titleKey: 'darsTitle' as const,
      descKey: 'darsDesc' as const,
      icon: 'menu_book',
      accent: 'from-emerald-400 to-teal-400',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-val)]/10 text-[var(--color-primary-val)] text-sm font-medium mb-6">
            <span className="material-symbols-outlined text-lg">school</span>
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

      {/* Services Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.titleKey}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 hover:border-[var(--color-primary-val)] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.accent} flex items-center justify-center mb-6`}>
                <span className="material-symbols-outlined text-white text-2xl">
                  {service.icon}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
                {t(service.titleKey)}
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {t(service.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
