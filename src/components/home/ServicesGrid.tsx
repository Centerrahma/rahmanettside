import { useTranslations } from 'next-intl';
import { BookOpen, HeartHandshake, CalendarDays, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
import ServiceCard from './ServiceCard';

export default function ServicesGrid() {
  const t = useTranslations();

  return (
    <section className="py-24 bg-[var(--color-bg)] relative" id="services">
      <Container>
        {/* Header: left-aligned with "View all services" link on right */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <SectionHeader
            eyebrow={t('services.sectionLabel')}
            title={t('services.sectionTitle')}
          />
          <a
            href="#services"
            className="text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors flex items-center gap-2 border-b border-[var(--color-border)] hover:border-[var(--color-text)] pb-1"
          >
            {t('services.viewAll')}{' '}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard
            title={t('services.quranTitle')}
            description={t('services.quranDesc')}
            icon={<BookOpen className="w-6 h-6" />}
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDP2pntd4JG-2gAC8eUouVILWUtzBdAxQ70mv3azQDlOwNJs4Sa3FjrrsPNajjRuHxtj3u7edgj8d7y-EyDN_HfQoDDUPyJ-grP8RLtn5NhhAsHzfrtN2lmx4LoBBvRXTjg6y00y0RAGyRUF_buRiDgx7ywhdD9nZ8kKG3k0X_WOM0wFxuuoEN7dvG6TofLni2Y63qQ3Znz46TPwDOiQrqCybYV5cAF2uxY7NoeVGS4z_PyxiW-AYkoZwKPHjHMqC-OlQBJWUq3654"
            ctaText={t('common.learnMore')}
          />
          <ServiceCard
            title={t('services.charityTitle')}
            description={t('services.charityDesc')}
            icon={<HeartHandshake className="w-6 h-6" />}
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAqXqsKiQZy_QOqx53JedZ9_IFbJK_N8ghcxFOPUa3d_i_ON5I-OO7Y5JPirPK2z1oo3d3onAs7TnPhqmva0jrjLukzkIDpHcnok700bYOfLJQ6M3dgNzNbd5E42tzR0xx90KDWjAoWm873_CtiOk_WPtc7RtlPOq1HunzfBWj48HAAzzEN0HHR2MroaaZACeA--9zEFtNfbtBdbTJ7sgZ1O97mtS8pY4b3SdVGmPkrWbMFT1jkbEDiRfkiWyaqYzoqBfvZkPRL_aE"
            ctaText={t('common.donate')}
          />
          <ServiceCard
            title={t('services.eventsTitle')}
            description={t('services.eventsDesc')}
            icon={<CalendarDays className="w-6 h-6" />}
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_YRz4aPgkhZsbC3tb6V0DNTounckoQbrR59VwCIDbsLvS7ZSC5EO8P86JeI4bDDRNcwHMSW4qtDByamjZhUiplwvKc2sYQqQ4oA-TOS8hitFS5cDWRIsa1isx1CFDUgWKX0oQ-VB67uq-Ap3GILTEmM6SvKLM7M6NKG2ENi1SAFDBeIRhePXdBHZ2VsNkruJnlBEz3KzSkntUWVuOUpDfPFHE5cHc6ooFkC_UKvEHtVYVgHsnPgInzPIjQJVhNPnWFiCCI8CvEk"
            ctaText={t('common.viewAll')}
          />
        </div>
      </Container>
    </section>
  );
}
