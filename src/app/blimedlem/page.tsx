import type { Metadata } from 'next';
import Medlem from '@/components/sider/medlem/Medlem';

const URL = 'https://www.centerrahma.no/blimedlem';
const TITLE = 'Bli medlem – Masjid Rahma';
const DESCRIPTION = 'Bli medlem i Center Rahma. Som medlem støtter du moskeen og fellesskapet vårt. Innmeldingen skjer i StyreWeb.';

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
    images: [{ url: '/og-bli-medlem.png', width: 1200, height: 630, alt: 'Moskeen i Oslo i skumringen, med «Bli medlem» på himmelen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-bli-medlem.png'],
  },
};

export default function BecomeMemberPage() {
  return <Medlem />;
}
