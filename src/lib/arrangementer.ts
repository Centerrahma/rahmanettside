// Public events from the mosque's SharePoint events list, read through
// Microsoft Graph. SharePoint holds every event and meeting; only items whose
// Category column says Public reach the website. The column defaults to
// Internal, so nothing is published by accident.
// Setup: docs/sharepoint-arrangementer.md.
import { GRAPH_BASE, REQUEST_TIMEOUT_MS, SHAREPOINT_APP, getGraphToken } from './graph.ts';

/**
 * Internal column names in the SharePoint list, the set tested in Graph Explorer
 * on 2026-10-24. BannerUrl is the event's picture: a link field whose Url points
 * at a file in the site (checked by IT with SharePoint REST, item 6).
 */
const F = {
  title: 'Title',
  category: 'Category',
  start: 'EventDate',
  end: 'EndDate',
  location: 'Location',
  banner: 'BannerUrl',
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
  /** Our own address for the event's picture, never SharePoint's: visitors are not signed in there. */
  image: string | null;
}

type Fields = Record<string, unknown>;
interface GraphItem { id: string; fields?: Fields }
interface GraphPage { value: GraphItem[]; '@odata.nextLink'?: string }

const text = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

/** A link field comes back as { Url, Description }, or as the bare URL. */
export const bannerUrl = (v: unknown) =>
  text(v && typeof v === 'object' ? (v as { Url?: unknown; url?: unknown }).Url ?? (v as { url?: unknown }).url : v);

/** List item IDs are numbers; anything else never reaches a Graph path. */
export const isItemId = (id: string) => /^\d{1,9}$/.test(id);

export const imagePath = (id: string) => `/api/arrangementer/bilde/${id}`;

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
      image: bannerUrl(fields[F.banner]) && isItemId(id) ? imagePath(id) : null,
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

const RASTER = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

const siteBase = (siteId: string) => `${GRAPH_BASE}/sites/${encodeURIComponent(siteId)}`;

async function graphJson<T>(url: string, token: string, what: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: EVENTS_REVALIDATE_SECONDS, tags: ['arrangementer'] },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Microsoft Graph ${what} failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as T;
}

const decodedPath = (u: URL) => decodeURIComponent(u.pathname).replace(/\/+$/, '').toLowerCase();

/**
 * Finds the file a banner URL points at among the site's own document libraries, as a drive ID
 * and a path inside it. Nothing outside the events site matches, so a link to anywhere else is
 * never followed: the site only ever asks Graph for files in that one site.
 */
export function locateInDrives(banner: string, drives: { id: string; webUrl: string }[]) {
  try {
    // a server-relative link («/sites/…») belongs to the site's own host
    const target = new URL(banner, drives[0]?.webUrl);
    if (target.protocol !== 'https:') return null;
    const path = decodedPath(target);
    for (const d of drives) {
      const root = new URL(d.webUrl);
      if (root.host.toLowerCase() !== target.host.toLowerCase()) continue;
      const base = decodedPath(root);
      if (!path.startsWith(`${base}/`)) continue;
      // keep the file's own casing for the path Graph is asked for
      const rest = decodeURIComponent(target.pathname).replace(/\/+$/, '').slice(base.length + 1);
      return { driveId: d.id, path: rest };
    }
    return null;
  } catch {
    // a malformed link or %-escape
    return null;
  }
}

/** Where a link that is not in the events site points, coarsely, for the log and the 404 reason. */
function where(banner: string) {
  try {
    const u = new URL(banner, 'https://x.invalid');
    return `${u.host === 'x.invalid' ? '' : u.host}${u.pathname.split('/').slice(0, 3).join('/')}`.toLowerCase();
  } catch {
    return 'unreadable';
  }
}

const EXT_TYPE: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

/**
 * SharePoint's own stock pictures (the «Stock images» choice for an event banner) live on Microsoft's
 * public CDN, not in the site. They need no sign-in. This one host and path are the only place outside
 * the events site the route will fetch from.
 */
const STOCK_HOST = 'cdn.hubblecontent.osi.office.net';
const STOCK_PATH = '/m365content/publish/';

export function isStockImage(banner: string) {
  try {
    const u = new URL(banner);
    return u.protocol === 'https:' && u.host === STOCK_HOST && u.pathname.startsWith(STOCK_PATH) && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** The content type to serve, or null for anything but a raster picture (an SVG can carry script). */
function rasterType(header: string | null, path: string) {
  let type = (header ?? '').split(';')[0].trim().toLowerCase();
  // SharePoint sometimes sends pictures as a generic download; go by the file's extension then
  if (type === 'application/octet-stream' || type === '') type = EXT_TYPE[path.split('.').pop()?.toLowerCase() ?? ''] ?? type;
  return RASTER.has(type) ? type : null;
}

export type Banner = { ok: true; body: ReadableStream<Uint8Array>; type: string } | { ok: false; reason: string };

/**
 * The picture of one event, fetched by the server with the read-only app. Only when the item is
 * Public right now, has a picture, and the picture lives in the events site; otherwise a short
 * reason, which the route passes on so a missing picture can be explained without the logs.
 * Throws when Graph fails.
 */
export async function fetchPublicBanner(id: string): Promise<Banner> {
  const { SHAREPOINT_SITE_ID, SHAREPOINT_LIST_ID } = process.env;
  if (!SHAREPOINT_SITE_ID || !SHAREPOINT_LIST_ID) return { ok: false, reason: 'not-configured' };
  if (!isItemId(id)) return { ok: false, reason: 'bad-id' };
  const token = await getGraphToken(SHAREPOINT_APP);
  const base = siteBase(SHAREPOINT_SITE_ID);

  let item: GraphItem;
  try {
    item = await graphJson<GraphItem>(
      `${base}/lists/${encodeURIComponent(SHAREPOINT_LIST_ID)}/items/${id}?$expand=fields($select=${F.category},${F.banner})`,
      token, 'list item',
    );
  } catch (err) {
    if (String(err).includes('(404)')) return { ok: false, reason: 'no-item' };
    throw err;
  }
  if (item.fields?.[F.category] !== PUBLIC) return { ok: false, reason: 'not-public' };
  const banner = bannerUrl(item.fields?.[F.banner]);
  if (!banner) return { ok: false, reason: 'no-picture' };

  if (isStockImage(banner)) {
    // public, so no token; and no redirects, so it cannot be bounced anywhere else
    const res = await fetch(banner, { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (res.status === 404) return { ok: false, reason: 'file-missing' };
    if (!res.ok || !res.body) throw new Error(`Stock picture failed (${res.status})`);
    const type = rasterType(res.headers.get('content-type'), new URL(banner).pathname);
    if (!type) return { ok: false, reason: `not-image:${res.headers.get('content-type') ?? 'unknown'}` };
    return { ok: true, body: res.body, type };
  }

  const { value: drives } = await graphJson<{ value: { id: string; webUrl: string }[] }>(`${base}/drives?$select=id,webUrl`, token, 'drives');
  const found = locateInDrives(banner, drives);
  if (!found) {
    console.warn(`[arrangementer] Picture for item ${id} is not in the events site: ${banner}`);
    return { ok: false, reason: `outside-site:${where(banner)}` };
  }

  const path = found.path.split('/').map(encodeURIComponent).join('/');
  // Graph answers with a redirect to a short-lived download address; fetch follows it.
  const res = await fetch(`${GRAPH_BASE}/drives/${encodeURIComponent(found.driveId)}/root:/${path}:/content`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (res.status === 404) return { ok: false, reason: 'file-missing' };
  if (!res.ok || !res.body) throw new Error(`Microsoft Graph file content failed (${res.status})`);
  const type = rasterType(res.headers.get('content-type'), found.path);
  if (!type) {
    const sent = res.headers.get('content-type') ?? 'unknown';
    console.warn(`[arrangementer] Picture for item ${id} is not an image (${sent})`);
    return { ok: false, reason: `not-image:${sent}` };
  }
  return { ok: true, body: res.body, type };
}
