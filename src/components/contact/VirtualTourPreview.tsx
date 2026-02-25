import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function VirtualTourPreview() {
  const t = useTranslations('contact');
  const mosqueImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1b_tDpb3a3yAAvyQ_a9Ejrd6WJ3zdfXunDeyTZ2kCx2oU51MWNZdz2qTO1_NCS7R1z_u7tV-XfDRakSAanrEcmzspwqaSmHG4a5i6kchBUS3Qkd2Qe6E1wfYd72lnZbrxCf36E8OaY7AW79MYe0CvSTUXkcodlIOfSxxfHUOLZiVkg_o3WHgnqJj7vFiEtIfyFEkmqrzV61PV-q3_uCvhJpqaEcqC41QWI1LrmLq_mJmseZiI8Zbb6gq7Vg5Wr5a5JOyiDUmNa8';

  return (
    <div>
      {/* Title Section */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
          {t('experienceTitle')}{' '}
          <span className="text-[var(--color-primary-val)]">
            {t('experienceHighlight')}
          </span>
        </h2>
        <p className="text-[var(--color-text-muted)] leading-relaxed">
          {t('experienceDesc')}
        </p>
      </div>

      {/* Video Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-6 group cursor-pointer">
        <img
          src={mosqueImageUrl}
          alt="Mosque Interior"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer glow circle */}
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-[var(--color-primary-val)]/20 blur-xl" />

            {/* Outer circle */}
            <div className="relative w-20 h-20 rounded-full bg-[var(--color-bg)]/90 backdrop-blur-sm border border-[var(--color-primary-val)]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {/* Inner circle with play icon */}
              <div className="w-14 h-14 rounded-full bg-[var(--color-primary-val)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--color-bg)] text-2xl ml-1">
                  play_arrow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-4 left-4 bg-[var(--color-bg)]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--color-border)]">
          <span className="text-sm font-medium text-[var(--color-text)]">
            {t('walkthrough')}
          </span>
        </div>
      </div>

      {/* View Gallery Button */}
      <Button variant="secondary" className="w-full sm:w-auto">
        <span className="material-symbols-outlined">collections</span>
        {t('viewGallery')}
      </Button>
    </div>
  );
}
