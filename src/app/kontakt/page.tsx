import type { Metadata } from 'next';
import { fetchPrayerTimes } from '@/lib/mymasjid';
import Brevet from '@/components/sider/kontakt/Brevet';
import BrevetMobil from '@/components/sider/kontakt/BrevetMobil';
import { RoundMap, ways } from '@/components/sider/kontakt/ways';
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
  const list = ways(jummah);
  return (
    <main className={k.page}>
      {/* wide screens get the illuminated page with the letter on it, phones and tablets a page drawn for them */}
      <div className={k.desk}>
        <Brevet list={list} />
        <section className={k.mapSec} aria-label="Kart">
          <RoundMap />
        </section>
      </div>
      <div className={k.phone}>
        <BrevetMobil list={list} />
      </div>
    </main>
  );
}
