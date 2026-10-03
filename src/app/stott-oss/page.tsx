import type { Metadata } from 'next';
import Portaler from '@/components/sider/stott/Portaler';
import EnPort from '@/components/sider/stott/EnPort';
import s from '@/components/sider/stott/stott.module.css';

const URL = 'https://www.centerrahma.no/stott-oss';
const TITLE = 'Støtt moskeen – Masjid Rahma';
const DESCRIPTION = 'Masjid Rahma drives av gaver fra menigheten. Gi med Vipps til 77811, eller bli medlem.';

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
  return (
    <main className={s.page}>
      {/* wide screens get the three portals, phones and tablets the one portal with a switch */}
      <Portaler />
      <div className={s.phone}>
        <EnPort />
      </div>
    </main>
  );
}
