import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { fetchPublicEvents, type PublicEvent } from '@/lib/arrangementer';

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

const OSLO = 'Europe/Oslo';
const day = (iso: string) =>
  new Date(iso).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: OSLO });
const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', timeZone: OSLO });

/** «lørdag 1. november kl. 17:00–19:00», in Oslo time. */
function when(e: PublicEvent): string {
  const startDay = day(e.start);
  if (!e.end) return `${startDay} kl. ${clock(e.start)}`;
  const endDay = day(e.end);
  return endDay === startDay
    ? `${startDay} kl. ${clock(e.start)}–${clock(e.end)}`
    : `${startDay} kl. ${clock(e.start)} – ${endDay} kl. ${clock(e.end)}`;
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

  return (
    <main className="min-h-screen pt-12 pb-20">
      <Container>
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl text-[var(--ink)] font-[family-name:var(--font-display)]">
            Arrangementer
          </h1>
          <p className="mt-3 text-[var(--muted)]">Det som skjer i moskeen fremover. Alle er velkomne.</p>
        </header>

        {events.length === 0 ? (
          <p className="text-center text-[var(--muted)]">
            Ingen kommende arrangementer akkurat nå. Følg med her eller på Facebook.
          </p>
        ) : (
          <ol className="mx-auto max-w-2xl flex flex-col gap-4">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-[var(--hair)] bg-[var(--card)] px-5 py-5 md:px-7 md:py-6"
              >
                <p className="text-sm font-medium text-[var(--emerald)] first-letter:uppercase">
                  <time dateTime={e.start}>{when(e)}</time>
                  {e.location && <span className="text-[var(--muted)]"> · {e.location}</span>}
                </p>
                <h2 className="mt-1 text-2xl md:text-3xl text-[var(--ink)] font-[family-name:var(--font-display)]">
                  {e.title}
                </h2>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </main>
  );
}
