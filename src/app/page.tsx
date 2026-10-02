import type { Metadata } from 'next';
import { fetchPrayerTimes } from '@/lib/mymasjid';
import { osloNow } from '@/lib/prayer-clock';
import FemHimler from '@/components/forside/FemHimler';
import Besok from '@/components/forside/Besok';
import Fellesskapet from '@/components/forside/Fellesskapet';
import StottOss from '@/components/forside/StottOss';

// Rebuilt every five minutes, so the day's times turn over shortly after midnight.
export const revalidate = 300;

const BASE_URL = 'https://www.centerrahma.no';
const TITLE = 'Masjid Rahma – moské i Oslo';
const DESCRIPTION =
  'Masjid Rahma er moskeen i Tvetenveien 154 i Oslo. Se dagens bønnetider, tidene for fredagsbønnen og hvordan du finner fram.';

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
    images: [{ url: '/og-forside.png', width: 1200, height: 630, alt: 'Tegning av moskeens fasade med fem buer' }],
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
      streetAddress: 'Tvetenveien 154',
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

/** "I dag" on a Friday in Oslo, otherwise the date of the coming Friday. */
function nextFridayLabel(now: ReturnType<typeof osloNow>) {
  if (now.friday) return 'I dag';
  const date = new Date(Date.UTC(now.year, now.month - 1, now.day));
  date.setUTCDate(date.getUTCDate() + ((5 - date.getUTCDay() + 7) % 7));
  return 'Neste: ' + new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(date);
}

export default async function HomePage() {
  const schedule = await fetchPrayerTimes();
  const now = osloNow();

  return (
    <>
      <MosqueJsonLd />
      <FemHimler schedule={schedule} friday={now.friday} />
      <Besok jummah={schedule.jummah} nextFriday={nextFridayLabel(now)} />
      <Fellesskapet />
      <StottOss />
    </>
  );
}
