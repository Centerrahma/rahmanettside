import type { Metadata } from 'next';
import Medlem from '@/components/sider/medlem/Medlem';

const URL = 'https://www.centerrahma.no/blimedlem';
const TITLE = 'Bli medlem – Masjid Rahma';
const DESCRIPTION = 'Bli medlem i Center Rahma. Som medlem støtter du arbeidet vårt og bidrar til vårt religiøse tilbud, aktiviteter og fellesskap.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    // the site's own share picture: a page's openGraph replaces the layout's, so it is named again here
    images: [{ url: '/og-forside.png', width: 1200, height: 630, alt: 'Masjid Rahma — Moske i Oslo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-forside.png'],
  },
};

export default function BecomeMemberPage() {
  return <Medlem />;
}
