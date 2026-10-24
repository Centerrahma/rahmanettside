import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchPublicEvents, toPlainText, toPublicEvents } from './arrangementer.ts';
import { setTokenProvider } from './graph.ts';

const now = new Date('2026-10-24T12:00:00Z');
const item = (id: string, fields: Record<string, unknown>) => ({ id, fields });
const pub = (id: string, start: string, more: Record<string, unknown> = {}) =>
  item(id, { Title: `Event ${id}`, Visibility: 'Public', EventDate: start, ...more });

test('keeps only Public items, even if Graph ignored the filter', () => {
  const events = toPublicEvents(
    [
      pub('1', '2026-11-01T17:00:00Z'),
      item('2', { Title: 'Styremøte', Visibility: 'Internal', EventDate: '2026-11-02T17:00:00Z' }),
      item('3', { Title: 'Uten synlighet', EventDate: '2026-11-03T17:00:00Z' }),
      item('4', { Title: 'Feil case', Visibility: 'public', EventDate: '2026-11-04T17:00:00Z' }),
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
    [pub('1', '2026-11-01T00:00:00Z', { Author: 'x@centerrahma.no', fAllDayEvent: true, Location: ' Salen ' })],
    now,
  );
  assert.deepEqual(e, {
    id: '1',
    title: 'Event 1',
    start: '2026-11-01T00:00:00Z',
    end: null,
    allDay: true,
    location: 'Salen',
    description: null,
  });
});

test('skips items without a title or a readable start', () => {
  const events = toPublicEvents(
    [item('a', { Visibility: 'Public', EventDate: '2026-11-01T17:00:00Z' }), pub('b', 'snart')],
    now,
  );
  assert.equal(events.length, 0);
});

test('turns description HTML into plain text', () => {
  assert.equal(
    toPlainText('<div class="x"><p>Halaqa &amp; te</p><p>Alle er <b>velkommen</b>&#33;<br>Ta med venner</p></div>'),
    'Halaqa & te\nAlle er velkommen!\nTa med venner',
  );
  assert.equal(toPlainText('<script>alert(1)</script>&lt;img&gt;'), 'alert(1)<img>');
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
  assert.equal(first.searchParams.get('$filter'), "fields/Visibility eq 'Public'");
  assert.equal(urls[1], 'https://graph.microsoft.com/v1.0/next');
});

test('throws when Graph refuses', async () => {
  globalThis.fetch = (async () => new Response('denied', { status: 403 })) as typeof fetch;
  await assert.rejects(fetchPublicEvents(now), /list items failed \(403\)/);
});
