import type { Metadata } from 'next';
import Medlem from '@/components/sider/medlem/Medlem';

const URL = 'https://www.centerrahma.no/become-member';
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
    images: [{ url: '/BliMedlem.jpeg', width: 1200, height: 630, alt: 'Bli medlem i Masjid Rahma' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/BliMedlem.jpeg'],
  },
};

export default function BecomeMemberPage() {
  return <Medlem />;
}
