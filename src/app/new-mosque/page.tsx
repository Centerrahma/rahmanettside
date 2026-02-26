import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import VideoAndDonate from '@/components/donate/VideoAndDonate';
import ProjectCarousel from '@/components/donate/ProjectCarousel';
import GallerySection from '@/components/new-mosque/GallerySection';
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
    twitter: {
      card: 'summary_large_image',
      title: `${t('sectionTitle')} — Masjid Rahma`,
      description: t('pageSubtitle'),
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
      <header className="mb-0 md:mb-8 relative w-full">
        {/* MOBILE: Text in grey area above the image */}
        <div className="md:hidden">
          <div className="bg-[var(--color-bg)] px-4 pt-3 pb-5 text-center">
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
          <div className="w-full relative h-[40vh] min-h-[300px] overflow-hidden">
            <Image
              src="/nymoskeoversikt.png"
              alt="3D oversikt over nye Masjid Rahma"
              fill
              className="object-cover"
              priority
            />
            {/* Elegant fade to content */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
          </div>
        </div>

        {/* DESKTOP: Original overlaid layout but taking slightly less height */}
        <div className="hidden md:block relative w-full h-[60vh] min-h-[500px] overflow-hidden rounded-b-[2.5rem]">
          <Image
            src="/nymoskeoversikt.png"
            alt="3D oversikt over nye Masjid Rahma"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />

          <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center pt-20 pb-8 drop-shadow-md">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--color-border)] backdrop-blur-md mb-6 shadow-glow-lg">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs tracking-[0.2em] font-bold text-[var(--color-text)] uppercase font-[family-name:var(--font-jakarta)]">
                Fremtidens moské
              </p>
            </span>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[1] font-[family-name:var(--font-display)] text-center text-[var(--color-text)] mb-6">
              Nye Masjid<br />Rahma
            </h1>
            <p className="font-[family-name:var(--font-jakarta)] text-[var(--color-text)] text-lg lg:text-xl max-w-xl text-center px-4 font-medium leading-relaxed bg-[var(--glass-bg)] backdrop-blur-md rounded-2xl py-4 border border-[var(--color-border)] shadow-lg">
              {t('donate.pageSubtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <Container className="mt-8 md:-mt-12 relative z-10">

        {/* Video and Donate Side by Side */}
        <VideoAndDonate
          translations={{
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

        {/* Project Carousel (Horizontal Scroll) */}
        <ProjectCarousel
          projects={PROJECTS}
          translations={{
            projectTitles,
            raisedLabel: t('donate.raised'),
            targetLabel: t('donate.target'),
            fundedLabel: t('donate.funded'),
            donorsLabel: t('donate.donors'),
            vsLastMonthLabel: t('donate.vsLastMonth'),
            raisedThisMonthLabel: t('donate.raisedThisMonth'),
          }}
        />

        {/* Masonry Image Gallery */}
        <GallerySection
          title="Sniktitt av Fremtiden"
          subtitle="Slik vil nye Masjid Rahma se ut, insha'Allah."
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
