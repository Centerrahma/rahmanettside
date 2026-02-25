import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import ProjectGridWithDonation from '@/components/donate/ProjectGridWithDonation';
import StatsRow from '@/components/donate/StatsRow';
import { PROJECTS } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: 'no', namespace: 'donate' });
  const baseUrl = 'https://masjidrahma.no';

  return {
    title: `${t('sectionTitle')} — Masjid Rahma`,
    description: t('pageSubtitle'),
    alternates: {
      canonical: `${baseUrl}/new-mosque`,
    },
    openGraph: {
      title: `${t('sectionTitle')} — Masjid Rahma`,
      description: t('pageSubtitle'),
      url: `${baseUrl}/new-mosque`,
      siteName: 'Masjid Rahma',
      locale: 'nb_NO',
      type: 'website',
    },
  };
}

export default function NewMosquePage() {
  const t = useTranslations();

  // Build translations object to pass to client component
  const projectTitles: Record<string, string> = {};
  for (const project of PROJECTS) {
    projectTitles[project.id] = t(project.titleKey);
  }

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Header — mobile: text above image; desktop: text overlaid on image */}
      <header className="mb-8 relative w-full">
        {/* MOBILE: Text in grey area above the image */}
        <div className="md:hidden">
          <div className="bg-[var(--color-bg-secondary,#f3f4f6)] px-4 pt-3 pb-5 text-center">
            <p className="text-xs tracking-[0.3em] uppercase font-[family-name:var(--font-jakarta)] font-semibold text-primary mb-1.5">
              Fremtidens moské
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] font-[family-name:var(--font-display)] text-center text-[var(--color-text)]">
              Nye Masjid Rahma
            </h1>
            <p className="font-[family-name:var(--font-jakarta)] text-[var(--color-text)] text-sm max-w-md text-center mt-2 mx-auto font-normal leading-relaxed">
              {t('donate.pageSubtitle')}
            </p>
          </div>
          <div className="w-full overflow-hidden">
            <Image
              src="/nymoskeoversikt.png"
              alt="3D oversikt over nye Masjid Rahma"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* DESKTOP: Original overlaid layout */}
        <div className="hidden md:block relative w-full overflow-hidden rounded-b-2xl">
          <Image
            src="/nymoskeoversikt.png"
            alt="3D oversikt over nye Masjid Rahma"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/60 via-white/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center pt-14 pb-8">
            <p className="text-xs tracking-[0.3em] uppercase font-[family-name:var(--font-jakarta)] font-medium text-gray-700 mb-3">
              Fremtidens moské
            </p>
            <h1 className="text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] font-[family-name:var(--font-display)] text-center text-gray-900">
              Nye Masjid Rahma
            </h1>
            <p className="font-[family-name:var(--font-jakarta)] text-gray-950 text-lg max-w-md text-center mt-4 px-4 font-light leading-relaxed">
              {t('donate.pageSubtitle')}
            </p>
          </div>
        </div>
      </header>

      <Container>
        <ProjectGridWithDonation
          projects={PROJECTS}
          translations={{
            projectTitles,
            raisedLabel: t('donate.raised'),
            targetLabel: t('donate.target'),
            fundedLabel: t('donate.funded'),
            donorsLabel: t('donate.donors'),
            vsLastMonthLabel: t('donate.vsLastMonth'),
            raisedThisMonthLabel: t('donate.raisedThisMonth'),
            makeADonation: t('donate.makeADonation'),
            donationSubtitle: t('donate.donationSubtitle'),
            oneTimeLabel: t('donate.oneTime'),
            monthlyLabel: t('donate.monthly'),
            customAmountLabel: t('donate.customAmount'),
            confirmLabel: t('donate.confirmDonation'),
            securityNote: t('donate.securityNote'),
            processingLabel: t('donate.processing'),
          }}
        />

        {/* Stats Row */}
        <StatsRow
          transparencyLabel={t('donate.transparency')}
          transparencyDesc={t('donate.transparencyDesc')}
          taxLabel={t('donate.taxDeductible')}
          taxDesc={t('donate.taxDeductibleDesc')}
          accessLabel={t('donate.access')}
          accessDesc={t('donate.accessDesc')}
          secureLabel={t('donate.securePayments')}
          secureDesc={t('donate.securePaymentsDesc')}
        />
      </Container>
    </main>
  );
}
