import type { Metadata } from 'next';
import { fetchPrayerTimes } from '@/lib/mymasjid';
import { osloNow } from '@/lib/prayer-clock';
import { fetchPublicEvents, type PublicEvent } from '@/lib/arrangementer';
import { osloDay } from '@/lib/kalender';
import Hero from '@/components/forside/Hero';
import ForsideSeksjoner from '@/components/forside/gips/Seksjoner';
import ForsideMobil from '@/components/forside/mobil/ForsideMobil';
import m from '@/components/forside/mobil/mobil.module.css';

// Rebuilt every minute: the day's times turn over just after midnight, and an event taken off
// SharePoint leaves the front page as quickly as it leaves /arrangementer.
export const revalidate = 60;

const BASE_URL = 'https://www.centerrahma.no';
const TITLE = 'Masjid Rahma – moské i Oslo';
const DESCRIPTION =
  'Masjid Rahma er moskeen i Tvetenveien 152A i Oslo. Se dagens bønnetider, tidene for fredagsbønnen og hvordan du finner fram.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    images: [{ url: '/og-forside.png', width: 1200, height: 630, alt: 'Tegning av moskeen med fem buer under nattehimmelen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-forside.png'],
  },
};

function MosqueJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Mosque',
    name: 'Masjid Rahma',
    alternateName: 'Masjid Rahma Oslo',
    url: 'https://www.centerrahma.no',
    email: 'post@centerrahma.no',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tvetenveien 152A',
      addressLocality: 'Oslo',
      postalCode: '0671',
      addressCountry: 'NO',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '05:00',
      closes: '23:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** The front page never fails over events: without them the calendar section is left out. */
async function upcomingEvents(): Promise<PublicEvent[]> {
  try {
    return (await fetchPublicEvents()) ?? [];
  } catch (err) {
    console.error('[forside] Could not read SharePoint events:', err);
    return [];
  }
}

export default async function HomePage() {
  const [schedule, events] = await Promise.all([fetchPrayerTimes(), upcomingEvents()]);
  const now = osloNow();
  const today = osloDay(new Date());

  return (
    <>
      <MosqueJsonLd />
      <Hero schedule={schedule} friday={now.friday} />
      {/* under the hero, phones get their own layout (ForsideMobil); wider screens get the carved sections (gips/Seksjoner) */}
      <div className={m.desktop}>
        <ForsideSeksjoner jummah={schedule.jummah} events={events} today={today} />
      </div>
      <ForsideMobil jummah={schedule.jummah} events={events} today={today} />
    </>
  );
}
