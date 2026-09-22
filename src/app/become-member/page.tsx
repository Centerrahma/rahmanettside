import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { UserPlus, Info, ArrowUpRight } from 'lucide-react';
import { MEMBERSHIP_SIGNUP_URL } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'membership' });
  const baseUrl = 'https://www.centerrahma.no';

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
      <section className="pt-12 pb-16 px-6">
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

      {/* Sign-up Section */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        {/* Important notice about checking existing membership */}
        <div className="mb-8 p-5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-[var(--color-text)] leading-relaxed">
              Før du registrerer deg, ber vi deg logge inn på &quot;Min side&quot; hos Brønnøysundregistrene (
              <a
                href="https://person.brreg.no/nb/minside"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary-val)] underline hover:no-underline"
              >
                person.brreg.no/nb/minside
              </a>
              ) for å sjekke om du allerede står oppført som medlem av et annet tros- eller livssynssamfunn. Hvis du er registrert et annet sted, må du melde deg ut der før du kan melde deg inn hos oss.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-lg border border-[var(--color-border)] text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-3">
            {t('signupTitle')}
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
            {t('signupDescription')}
          </p>

          <a
            href={MEMBERSHIP_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full bg-[var(--color-primary-val)] text-[var(--color-bg)] font-bold shadow-glow-lg transition-all duration-300 hover:opacity-90 transform hover:-translate-y-1"
          >
            <UserPlus className="w-5 h-5" />
            {t('signupButton')}
            <ArrowUpRight className="w-5 h-5" />
          </a>

          <p className="text-xs text-[var(--color-text-muted)] mt-4">{t('signupNote')}</p>
        </div>
      </section>
    </main>
  );
}
