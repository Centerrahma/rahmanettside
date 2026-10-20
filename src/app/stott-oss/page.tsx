import type { Metadata } from 'next';
import Portalen from '@/components/sider/stott/Portalen';

const URL = 'https://www.centerrahma.no/stott-oss';
const TITLE = 'Støtt moskeen vår – Masjid Rahma';
const DESCRIPTION = 'Støtt fellesskapet i Masjid Rahma. Gi en gave med Vipps 77811, bli fast giver med Vipps 43392, eller kontakt oss om bankoverføring.';

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
    images: [{ url: '/og-forside.png', width: 1200, height: 630, alt: 'Tegning av moskeens fasade med fem buer' }],
  },
};

export default function StottOssPage() {
  return <Portalen />;
}
