// Public events from the mosque's SharePoint events list, read through
// Microsoft Graph. SharePoint holds every event and meeting; only items whose
// Category column says Public reach the website. The column defaults to
// Internal, so nothing is published by accident.
// Setup: docs/sharepoint-arrangementer.md.
import { GRAPH_BASE, REQUEST_TIMEOUT_MS, SHAREPOINT_APP, getGraphToken } from './graph.ts';

/**
 * Internal column names in the SharePoint list, the set tested in Graph Explorer
 * on 2026-10-24.
 */
const F = {
  title: 'Title',
  category: 'Category',
  start: 'EventDate',
  end: 'EndDate',
  location: 'Location',
} as const;

const PUBLIC = 'Public';
// Short, so an event switched back to Internal leaves the site within a minute or two.
export const EVENTS_REVALIDATE_SECONDS = 60;

export interface PublicEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  location: string | null;
}

type Fields = Record<string, unknown>;
interface GraphItem { id: string; fields?: Fields }
interface GraphPage { value: GraphItem[]; '@odata.nextLink'?: string }

const text = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

/**
 * Turns Graph list items into public events: Public only (checked again here,
 * so an ignored filter can never leak an internal meeting), not yet over,
 * soonest first. Only the fields the site shows leave this function.
 */
export function toPublicEvents(items: GraphItem[], now: Date): PublicEvent[] {
  const events: PublicEvent[] = [];
  for (const { id, fields = {} } of items) {
    if (fields[F.category] !== PUBLIC) continue;
    const title = text(fields[F.title]);
    const start = text(fields[F.start]);
    if (!title || !start || Number.isNaN(Date.parse(start))) continue;
    const end = text(fields[F.end]);
    events.push({
      id,
      title,
      start,
      end: end && !Number.isNaN(Date.parse(end)) ? end : null,
      location: text(fields[F.location]),
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

  const token = await getGraphToken(SHAREPOINT_APP);
  const select = Object.values(F).join(',');
  const query = new URLSearchParams({
    $expand: `fields($select=${select})`,
    $filter: `fields/${F.category} eq '${PUBLIC}'`,
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
        // Lets the filter run even if the Category index is ever dropped.
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
