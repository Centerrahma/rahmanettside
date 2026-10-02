import type { Metadata } from 'next';
import { fetchPrayerTimes } from '@/lib/mymasjid';
import Dora from '@/components/sider/Dora';
import FemDorer from '@/components/sider/FemDorer';
import BesokForm from '@/components/forside/BesokForm';
import MapDoor from '@/components/forside/MapDoor';
import { ADDRESS } from '@/components/forside/links';
import f from '@/components/forside/forside.module.css';
import s from '@/components/sider/sider.module.css';

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
    <main className={s.page}>
      <div className={f.wrap}>
        <div className={s.hg}>
          <h1 className={s.h1}>Kontakt oss</h1>
          <p className={s.lede}>Døra står åpen. Kom innom, eller skriv til oss, så svarer vi så snart vi kan.</p>
        </div>
        <div className={`${s.drawing} ${s.dora}`}>
          <Dora />
        </div>
        <p className={s.gloss}>
          <q>Gå inn i fred og trygghet.</q>
          <span>Koranen 15:46</span>
        </p>

        <FemDorer jummah={jummah} />

        <section className={s.sec} id="skjema" aria-labelledby="skjema-h2">
          <div className={s.write}>
            <div>
              <h2 id="skjema-h2">Send oss en melding</h2>
              <BesokForm />
            </div>
            <MapDoor />
          </div>
        </section>
      </div>
    </main>
  );
}
