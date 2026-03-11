import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import VideoAndDonate from '@/components/donate/VideoAndDonate';
import GallerySection from '@/components/new-mosque/GallerySection';
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
    <main className="min-h-screen pb-20">
      {/* Header — full screen image with text overlaid in the grey area */}
      <header className="relative w-full h-[45svh] md:h-[100svh] overflow-hidden bg-[var(--color-bg)]">
        <Image
          src="/RahmaGalleri1.jpg"
          alt="3D oversikt over nye Masjid Rahma"
          fill
          className="object-contain md:object-cover"
          priority
        />
        {/* Text placed over the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] md:pt-[15vh] px-4 pointer-events-none">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1] font-[family-name:var(--font-display)] text-[var(--color-text)] drop-shadow-md text-center mb-3">
            Nye Masjid Rahma
          </h1>
          <p className="font-[family-name:var(--font-jakarta)] text-[var(--color-text)] text-sm md:text-base lg:text-lg font-medium tracking-wide drop-shadow-md text-center max-w-md mx-auto">
            Invester i din Akhira.
          </p>
        </div>
      </header>

      {/* Main Content Areas */}
      <Container className="pt-12 relative z-10">

        {/* Video and Donate Side by Side */}
        <VideoAndDonate
          projects={PROJECTS}
          translations={{
            makeADonation: t('donate.makeADonation'),
            donationSubtitle: t('donate.donationSubtitle'),
            oneTimeLabel: t('donate.oneTime'),
            monthlyLabel: t('donate.monthly'),
            customAmountLabel: t('donate.customAmount'),
            confirmLabel: t('donate.confirmDonation'),
            securityNote: t('donate.securityNote'),
            processingLabel: t('donate.processing'),
            projectTitles,
            targetLabel: t('donate.target'),
          }}
          statsRowProps={{
            transparencyLabel: t('donate.transparency'),
            transparencyDesc: t('donate.transparencyDesc'),
            taxLabel: t('donate.taxDeductible'),
            taxDesc: t('donate.taxDeductibleDesc'),
            accessLabel: t('donate.access'),
            accessDesc: t('donate.accessDesc'),
            secureLabel: t('donate.securePayments'),
            secureDesc: t('donate.securePaymentsDesc')
          }}
        />

        {/* Masonry Image Gallery */}
        <GallerySection
          title="Sniktitt av Fremtiden"
          subtitle="Slik vil nye Masjid Rahma se ut, insha'Allah."
        />
      </Container>
    </main>
  );
}
