import type { Metadata } from 'next';
import { fetchPublicEvents, type PublicEvent } from '@/lib/arrangementer';
import { osloDay } from '@/lib/kalender';
import { KalenderSide } from '@/components/arrangementer/Kalender';
import fs from '@/components/forside/gips/seksjoner.module.css';
import k from '@/components/arrangementer/kalender.module.css';

// Matches the Graph fetch's cache; Power Automate can refresh sooner through /api/revalidate-events.
export const revalidate = 60;

const URL = 'https://www.centerrahma.no/arrangementer';
const TITLE = 'Arrangementer – Masjid Rahma';
const DESCRIPTION = 'Kommende arrangementer i Masjid Rahma, Tvetenveien 152A i Oslo.';

export async function generateMetadata(): Promise<Metadata> {
  const configured = Boolean(process.env.SHAREPOINT_SITE_ID && process.env.SHAREPOINT_LIST_ID);
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: URL },
    // Stays out of search until the SharePoint list is connected.
    robots: configured ? undefined : { index: false, follow: true },
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
}

async function loadEvents(): Promise<PublicEvent[] | null> {
  try {
    return await fetchPublicEvents();
  } catch (err) {
    // Graph signs in through Vercel's production OIDC token. A build that cannot reach it
    // still ships the page; at runtime the error propagates so Next keeps the last good copy.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.error('[arrangementer] Could not read SharePoint during build:', err);
      return null;
    }
    throw err;
  }
}

export default async function ArrangementerPage() {
  const events = (await loadEvents()) ?? [];
  const today = osloDay(new Date());

  return (
    <main className={k.page}>
      <div className={k.pWrap}>
        <header className={k.pHead}>
          <h1 className={fs.h2}>Arrangementer</h1>
          <p className={k.lead}>
            {events.length > 0
              ? 'Det som skjer i Masjid Rahma fremover. Velg en grønn dag for å se hva som skjer.'
              : 'Ingen kommende arrangementer akkurat nå. Følg med her eller på Facebook.'}
          </p>
        </header>
        <KalenderSide events={events} today={today} />
      </div>
    </main>
  );
}
