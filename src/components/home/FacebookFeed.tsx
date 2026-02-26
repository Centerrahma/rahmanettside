'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';

const FB_PAGE_URL = 'https://www.facebook.com/masjidrahma';

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FeedSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Loading feed">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-border)]" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-32 rounded bg-[var(--color-border)]" />
          <div className="h-2 w-20 rounded bg-[var(--color-border)]" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-[var(--color-border)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-border)]" />
        <div className="h-3 w-3/5 rounded bg-[var(--color-border)]" />
      </div>
      <div className="h-48 w-full rounded-lg bg-[var(--color-border)]" />
      <div className="flex gap-6 pt-2">
        <div className="h-3 w-12 rounded bg-[var(--color-border)]" />
        <div className="h-3 w-16 rounded bg-[var(--color-border)]" />
        <div className="h-3 w-10 rounded bg-[var(--color-border)]" />
      </div>
    </div>
  );
}

export default function FacebookFeed() {
  const t = useTranslations('facebook');
  const [loaded, setLoaded] = useState(false);

  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FB_PAGE_URL)}&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <section className="pt-[100px] pb-24 md:py-24 bg-[var(--color-surface)] relative">
      <Container>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          centered
        />

        <div className="mt-12 flex flex-col items-center gap-8">
          {/* Glass card wrapper */}
          <div
            className="w-full max-w-xl rounded-2xl overflow-hidden
                        bg-[var(--glass-card-bg)] backdrop-blur-[12px]
                        border border-[var(--glass-card-border)]
                        p-4 sm:p-6"
          >
            {/* Skeleton while iframe loads */}
            {!loaded && <FeedSkeleton />}

            {/* Facebook Page Plugin via iframe */}
            <iframe
              src={iframeSrc}
              width="500"
              height="500"
              className={`w-full border-none overflow-hidden rounded-lg ${loaded ? '' : 'h-0'}`}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Masjid Rahma Facebook"
              onLoad={() => setLoaded(true)}
            />
          </div>

          {/* Follow CTA */}
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2
                       px-6 py-3 rounded-full
                       bg-transparent border border-[var(--color-border)]
                       text-[var(--color-text)] font-medium
                       hover:border-[var(--color-text)] hover:bg-[var(--color-text)]/5
                       backdrop-blur-sm transition-all duration-300 cursor-pointer"
          >
            <FacebookIcon />
            {t('followUs')}
          </a>
        </div>
      </Container>
    </section>
  );
}
