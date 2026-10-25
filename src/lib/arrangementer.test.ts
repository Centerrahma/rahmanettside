import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { bannerUrl, fetchPublicBanner, fetchPublicEvents, isStockImage, locateInDrives, toPublicEvents } from './arrangementer.ts';
import { setTokenProvider } from './graph.ts';

const now = new Date('2026-10-24T12:00:00Z');
const item = (id: string, fields: Record<string, unknown>) => ({ id, fields });
const pub = (id: string, start: string, more: Record<string, unknown> = {}) =>
  item(id, { Title: `Event ${id}`, Category: 'Public', EventDate: start, ...more });

test('keeps only Public items, even if Graph ignored the filter', () => {
  const events = toPublicEvents(
    [
      pub('1', '2026-11-01T17:00:00Z'),
      item('2', { Title: 'Styremøte', Category: 'Internal', EventDate: '2026-11-02T17:00:00Z' }),
      item('3', { Title: 'Uten kategori', EventDate: '2026-11-03T17:00:00Z' }),
      item('5', { Title: 'Tom kategori', Category: '', EventDate: '2026-11-05T17:00:00Z' }),
      item('4', { Title: 'Feil case', Category: 'public', EventDate: '2026-11-04T17:00:00Z' }),
    ],
    now,
  );
  assert.deepEqual(events.map((e) => e.id), ['1']);
});

test('drops finished events, keeps running ones, sorts soonest first', () => {
  const events = toPublicEvents(
    [
      pub('later', '2026-12-01T17:00:00Z'),
      pub('over', '2026-10-20T17:00:00Z', { EndDate: '2026-10-20T19:00:00Z' }),
      pub('running', '2026-10-24T10:00:00Z', { EndDate: '2026-10-24T14:00:00Z' }),
      pub('soon', '2026-10-25T17:00:00Z'),
    ],
    now,
  );
  assert.deepEqual(events.map((e) => e.id), ['running', 'soon', 'later']);
});

test('returns only the fields the site shows', () => {
  const [e] = toPublicEvents(
    [pub('1', '2026-11-01T00:00:00Z', { Author: 'x@centerrahma.no', Description: 'internt notat', Location: ' Salen ' })],
    now,
  );
  assert.deepEqual(e, {
    id: '1',
    title: 'Event 1',
    start: '2026-11-01T00:00:00Z',
    end: null,
    location: 'Salen',
    image: null,
  });
});

test('an empty or blank Location becomes null', () => {
  const events = toPublicEvents(
    [pub('1', '2026-11-01T17:00:00Z', { Location: '   ' }), pub('2', '2026-11-02T17:00:00Z', { Location: null })],
    now,
  );
  assert.deepEqual(events.map((e) => e.location), [null, null]);
});

test('skips items without a title or a readable start', () => {
  const events = toPublicEvents(
    [item('a', { Category: 'Public', EventDate: '2026-11-01T17:00:00Z' }), pub('b', 'snart')],
    now,
  );
  assert.equal(events.length, 0);
});

const realFetch = globalThis.fetch;
const savedEnv = { ...process.env };
let urls: string[];

beforeEach(() => {
  urls = [];
  setTokenProvider(async () => 'tok-abc');
  process.env.SHAREPOINT_SITE_ID = 'site,1,2';
  process.env.SHAREPOINT_LIST_ID = 'list-1';
});

afterEach(() => {
  globalThis.fetch = realFetch;
  setTokenProvider(null);
  process.env = { ...savedEnv };
});

test('returns null until the site and list IDs are set', async () => {
  delete process.env.SHAREPOINT_LIST_ID;
  globalThis.fetch = (async () => assert.fail('no request expected')) as typeof fetch;
  assert.equal(await fetchPublicEvents(now), null);
});

test('asks Graph for Public items and follows nextLink', async () => {
  const pages = [
    { value: [pub('1', '2026-11-01T17:00:00Z')], '@odata.nextLink': 'https://graph.microsoft.com/v1.0/next' },
    { value: [pub('2', '2026-10-30T17:00:00Z')] },
  ];
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    urls.push(String(url));
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer tok-abc');
    return Response.json(pages.shift());
  }) as typeof fetch;

  const events = await fetchPublicEvents(now);
  assert.deepEqual(events?.map((e) => e.id), ['2', '1']);
  assert.equal(urls.length, 2);
  const first = new URL(urls[0]);
  assert.equal(first.pathname, '/v1.0/sites/site%2C1%2C2/lists/list-1/items');
  assert.equal(first.searchParams.get('$filter'), "fields/Category eq 'Public'");
  assert.equal(first.searchParams.get('$expand'), 'fields($select=Title,Category,EventDate,EndDate,Location,BannerUrl)');
  assert.equal(urls[1], 'https://graph.microsoft.com/v1.0/next');
});

test('throws when Graph refuses', async () => {
  globalThis.fetch = (async () => new Response('denied', { status: 403 })) as typeof fetch;
  await assert.rejects(fetchPublicEvents(now), /list items failed \(403\)/);
});

test('signs in with the SharePoint app, not the mail app', async () => {
  setTokenProvider(null);
  process.env.AZURE_TENANT_ID = 'mail-tenant';
  process.env.AZURE_CLIENT_ID = 'mail-client';
  delete process.env.SHAREPOINT_TENANT_ID;
  delete process.env.SHAREPOINT_CLIENT_ID;
  globalThis.fetch = (async () => assert.fail('no request expected')) as typeof fetch;
  await assert.rejects(fetchPublicEvents(now), /SHAREPOINT_TENANT_ID, SHAREPOINT_CLIENT_ID/);
});

test('an event with a picture points at our own route, never at SharePoint', () => {
  const [withPic, withObj, without] = toPublicEvents(
    [
      pub('10', '2026-10-26T09:00:00Z', { BannerUrl: { Url: 'https://centerrahma.sharepoint.com/sites/arr/SiteAssets/q.jpg', Description: 'x' } }),
      pub('11', '2026-10-27T09:00:00Z', { BannerUrl: 'https://centerrahma.sharepoint.com/sites/arr/SiteAssets/f.jpg' }),
      pub('12', '2026-10-28T09:00:00Z', { BannerUrl: { Url: '', Description: '' } }),
    ],
    now,
  );
  assert.equal(withPic.image, '/api/arrangementer/bilde/10');
  assert.equal(withObj.image, '/api/arrangementer/bilde/11');
  assert.equal(without.image, null);
  assert.equal(bannerUrl(null), null);
});

const DRIVES = [
  { id: 'docs', webUrl: 'https://centerrahma.sharepoint.com/sites/arr/Shared%20Documents' },
  { id: 'assets', webUrl: 'https://centerrahma.sharepoint.com/sites/arr/SiteAssets' },
];

test('a picture is found only inside the events site', () => {
  assert.deepEqual(locateInDrives('https://centerrahma.sharepoint.com/sites/arr/SiteAssets/Lists/abc/Quran%20bilde.jpg', DRIVES),
    { driveId: 'assets', path: 'Lists/abc/Quran bilde.jpg' });
  assert.deepEqual(locateInDrives('/sites/arr/siteassets/x.png', DRIVES), { driveId: 'assets', path: 'x.png' });
  assert.equal(locateInDrives('https://centerrahma.sharepoint.com/sites/other/SiteAssets/x.png', DRIVES), null);
  assert.equal(locateInDrives('https://evil.example/sites/arr/SiteAssets/x.png', DRIVES), null);
  assert.equal(locateInDrives('http://centerrahma.sharepoint.com/sites/arr/SiteAssets/x.png', DRIVES), null);
  assert.equal(locateInDrives('https://centerrahma.sharepoint.com/sites/arr/SiteAssetsX/x.png', DRIVES), null);
  assert.equal(locateInDrives('https://centerrahma.sharepoint.com/sites/arr/SiteAssets/%E0%A4%A.png', DRIVES), null);
});

function graph(routes: Record<string, () => Response>) {
  globalThis.fetch = (async (url: string | URL) => {
    urls.push(String(url));
    const key = Object.keys(routes).find((k) => String(url).includes(k));
    if (!key) throw new Error(`unexpected fetch to ${url}`);
    return routes[key]();
  }) as typeof fetch;
}
const itemRes = (category: string, banner: unknown) => () => Response.json({ id: '10', fields: { Category: category, BannerUrl: banner } });
const PIC = { Url: 'https://centerrahma.sharepoint.com/sites/arr/SiteAssets/q.jpg' };

test('serves the picture of a Public event, fetched through the site drive', async () => {
  graph({
    '/items/10': itemRes('Public', PIC),
    '/drives?': () => Response.json({ value: DRIVES }),
    '/drives/assets/root:/q.jpg:/content': () => new Response('JPEGDATA', { headers: { 'content-type': 'image/jpeg' } }),
  });
  const pic = await fetchPublicBanner('10');
  assert.ok(pic.ok);
  assert.equal(pic.type, 'image/jpeg');
  assert.equal(await new Response(pic.body).text(), 'JPEGDATA');
});

test('finds uploaded event photos in the root site hidden Site Assets library', async () => {
  const banner = 'https://centerrahma.sharepoint.com/SiteAssets/SitePages/Events/Uploaded%20photo.jpg';
  globalThis.fetch = (async (url: string | URL) => {
    const address = String(url);
    urls.push(address);
    if (address.includes('/items/14')) return itemRes('Public', { Url: banner })();
    if (address.includes('/drives?')) {
      const selected = new URL(address).searchParams.get('$select')?.split(',') ?? [];
      // Graph hides system libraries unless explicitly requested, even from a read-authorized app.
      const value = [{ id: 'docs', webUrl: 'https://centerrahma.sharepoint.com/Shared%20Documents' }];
      if (selected.includes('system')) value.push({ id: 'assets', webUrl: 'https://centerrahma.sharepoint.com/SiteAssets' });
      return Response.json({ value });
    }
    if (address.includes('/drives/assets/root:/SitePages/Events/Uploaded%20photo.jpg:/content')) {
      return new Response('UPLOADED-JPEG', { headers: { 'content-type': 'image/jpeg' } });
    }
    throw new Error(`unexpected fetch to ${address}`);
  }) as typeof fetch;
  const pic = await fetchPublicBanner('14');
  assert.ok(pic.ok, JSON.stringify(pic));
  assert.equal(pic.type, 'image/jpeg');
  assert.equal(await new Response(pic.body).text(), 'UPLOADED-JPEG');
});

test('root-site uploaded photos still cannot resolve to a different site or host', () => {
  const drives = [{ id: 'assets', webUrl: 'https://centerrahma.sharepoint.com/SiteAssets' }];
  assert.deepEqual(locateInDrives('/SiteAssets/SitePages/Events/photo.jpg', drives), { driveId: 'assets', path: 'SitePages/Events/photo.jpg' });
  assert.equal(locateInDrives('https://centerrahma.sharepoint.com/sites/private/SiteAssets/photo.jpg', drives), null);
  assert.equal(locateInDrives('https://other.sharepoint.com/SiteAssets/photo.jpg', drives), null);
});

test('an Internal event gives no picture and its file is never fetched', async () => {
  graph({ '/items/10': itemRes('Internal', PIC) });
  assert.deepEqual(await fetchPublicBanner('10'), { ok: false, reason: 'not-public' });
  assert.equal(urls.length, 1);
});

test('no picture for links outside the site, non-raster files, or odd IDs', async () => {
  graph({ '/items/10': itemRes('Public', { Url: 'https://evil.example/x.jpg' }), '/drives?': () => Response.json({ value: DRIVES }) });
  assert.deepEqual(await fetchPublicBanner('10'), { ok: false, reason: 'outside-site:evil.example/x.jpg' });
  assert.ok(!urls.some((u) => u.includes('evil.example')));

  urls = [];
  graph({
    '/items/10': itemRes('Public', PIC),
    '/drives?': () => Response.json({ value: DRIVES }),
    ':/content': () => new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } }),
  });
  assert.deepEqual(await fetchPublicBanner('10'), { ok: false, reason: 'not-image:image/svg+xml' });

  urls = [];
  assert.deepEqual(await fetchPublicBanner('10/../../x'), { ok: false, reason: 'bad-id' });
  assert.equal(urls.length, 0);
});

test('a picture sent as a generic download is served by its extension; a missing item is not an error', async () => {
  graph({
    '/items/10': itemRes('Public', PIC),
    '/drives?': () => Response.json({ value: DRIVES }),
    ':/content': () => new Response('JPEGDATA', { headers: { 'content-type': 'application/octet-stream' } }),
  });
  const pic = await fetchPublicBanner('10');
  assert.ok(pic.ok && pic.type === 'image/jpeg');

  graph({ '/items/99': () => new Response('{"error":{"code":"itemNotFound"}}', { status: 404 }) });
  assert.deepEqual(await fetchPublicBanner('99'), { ok: false, reason: 'no-item' });
});

const STOCK = 'https://cdn.hubblecontent.osi.office.net/m365content/publish/0a1b/abc.jpg';

test('only Microsoft\'s stock-picture path counts as a stock image', () => {
  assert.ok(isStockImage(STOCK));
  assert.ok(!isStockImage('http://cdn.hubblecontent.osi.office.net/m365content/publish/a.jpg'));
  assert.ok(!isStockImage('https://cdn.hubblecontent.osi.office.net/other/a.jpg'));
  assert.ok(!isStockImage('https://cdn.hubblecontent.osi.office.net.evil.example/m365content/publish/a.jpg'));
  assert.ok(!isStockImage('https://user:pw@cdn.hubblecontent.osi.office.net/m365content/publish/a.jpg'));
  assert.ok(!isStockImage('not a url'));
});

test('a Public event with a stock picture gets it, fetched without our token or redirects', async () => {
  let init: RequestInit | undefined;
  globalThis.fetch = (async (url: string | URL, i?: RequestInit) => {
    urls.push(String(url));
    if (String(url).includes('/items/12')) return Response.json({ id: '12', fields: { Category: 'Public', BannerUrl: { Url: STOCK } } });
    if (String(url) === STOCK) { init = i; return new Response('JPEG', { headers: { 'content-type': 'image/jpeg' } }); }
    throw new Error(`unexpected fetch to ${url}`);
  }) as typeof fetch;
  const pic = await fetchPublicBanner('12');
  assert.ok(pic.ok && pic.type === 'image/jpeg');
  assert.equal(new Headers(init?.headers).get('authorization'), null);
  assert.equal(init?.redirect, 'error');
  assert.ok(!urls.some((u) => u.includes('/drives')));
});

test('an Internal event with a stock picture still gets nothing', async () => {
  graph({ '/items/12': () => Response.json({ id: '12', fields: { Category: 'Internal', BannerUrl: { Url: STOCK } } }) });
  assert.deepEqual(await fetchPublicBanner('12'), { ok: false, reason: 'not-public' });
  assert.equal(urls.length, 1);
});
