import type { Metadata } from 'next';
import { fetchPrayerTimes } from '@/lib/mymasjid';
import KonvoluttSide from '@/components/sider/kontakt/KonvoluttSide';
import Nisjene from '@/components/sider/kontakt/Nisjene';
import { ADDRESS } from '@/components/forside/links';
import k from '@/components/sider/kontakt/kontakt.module.css';

// the Friday times come from MyMasjid, like the front page's
export const revalidate = 300;

const URL = 'https://www.centerrahma.no/kontakt';
const TITLE = 'Kontakt oss – Masjid Rahma';
const DESCRIPTION = `Besøk Masjid Rahma i ${ADDRESS.street}, ${ADDRESS.city}, eller send oss en melding.`;

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

export default async function KontaktPage() {
  const { jummah } = await fetchPrayerTimes();
  return (
    <main className={k.page} data-contact-page>
      {/* wide screens get the wall with three cuts in it, phones and tablets the envelope page */}
      <div className={k.desk}>
        <Nisjene jummah={jummah} />
      </div>
      <div className={k.phone}>
        <KonvoluttSide jummah={jummah} />
      </div>
    </main>
  );
}
