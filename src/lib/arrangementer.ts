// Public events from the mosque's SharePoint events list, read through
// Microsoft Graph. SharePoint holds every event and meeting; only items whose
// Visibility column says Public reach the website. The column defaults to
// Internal, so nothing is published by accident.
// Setup: docs/sharepoint-arrangementer.md.
import { GRAPH_BASE, REQUEST_TIMEOUT_MS, getGraphToken } from './graph.ts';

/** Internal column names in the SharePoint list. Change here if the list uses others. */
const F = {
  title: 'Title',
  visibility: 'Visibility',
  start: 'EventDate',
  end: 'EndDate',
  allDay: 'fAllDayEvent',
  location: 'Location',
  description: 'Description',
} as const;

const PUBLIC = 'Public';
export const EVENTS_REVALIDATE_SECONDS = 300;

export interface PublicEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  allDay: boolean;
  location: string | null;
  description: string | null;
}

type Fields = Record<string, unknown>;
interface GraphItem { id: string; fields?: Fields }
interface GraphPage { value: GraphItem[]; '@odata.nextLink'?: string }

const text = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** SharePoint descriptions are HTML. The site shows them as plain text, never as markup. */
export function toPlainText(html: string): string {
  return html
    .replace(/<\s*(br|\/p|\/div|\/li)\b[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] !== '#') return ENTITIES[e.toLowerCase()] ?? m;
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    })
    .replace(/​/g, '')
    .replace(/[ \t\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Turns Graph list items into public events: Public only (checked again here,
 * so an ignored filter can never leak an internal meeting), not yet over,
 * soonest first. Only the fields the site shows leave this function.
 */
export function toPublicEvents(items: GraphItem[], now: Date): PublicEvent[] {
  const events: PublicEvent[] = [];
  for (const { id, fields = {} } of items) {
    if (fields[F.visibility] !== PUBLIC) continue;
    const title = text(fields[F.title]);
    const start = text(fields[F.start]);
    if (!title || !start || Number.isNaN(Date.parse(start))) continue;
    const end = text(fields[F.end]);
    const description = text(fields[F.description]);
    events.push({
      id,
      title,
      start,
      end: end && !Number.isNaN(Date.parse(end)) ? end : null,
      allDay: fields[F.allDay] === true,
      location: text(fields[F.location]),
      description: description ? toPlainText(description) || null : null,
    });
  }
  return events
    .filter((e) => Date.parse(e.end ?? e.start) >= now.getTime())
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/** Null when the list is not configured yet (no site or list ID). Throws when Graph fails. */
export async function fetchPublicEvents(now = new Date()): Promise<PublicEvent[] | null> {
  const { SHAREPOINT_SITE_ID, SHAREPOINT_LIST_ID } = process.env;
  if (!SHAREPOINT_SITE_ID || !SHAREPOINT_LIST_ID) return null;

  const token = await getGraphToken();
  const select = Object.values(F).join(',');
  const query = new URLSearchParams({
    $expand: `fields($select=${select})`,
    $filter: `fields/${F.visibility} eq '${PUBLIC}'`,
    $top: '200',
  });
  let url: string | undefined =
    `${GRAPH_BASE}/sites/${encodeURIComponent(SHAREPOINT_SITE_ID)}` +
    `/lists/${encodeURIComponent(SHAREPOINT_LIST_ID)}/items?${query}`;

  const items: GraphItem[] = [];
  // A handful of pages at most; the cap keeps a bad nextLink from looping.
  for (let page = 0; url && page < 10; page++) {
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Lets the filter run while the Visibility column is not indexed yet.
        Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly',
      },
      next: { revalidate: EVENTS_REVALIDATE_SECONDS, tags: ['arrangementer'] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`Microsoft Graph list items failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as GraphPage;
    items.push(...data.value);
    url = data['@odata.nextLink'];
  }
  return toPublicEvents(items, now);
}
