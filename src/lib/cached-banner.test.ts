import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { AsyncLocalStorage } from 'node:async_hooks';
import { fetchPublicBanner } from './arrangementer.ts';
import { setTokenProvider } from './graph.ts';

test('processed bytes are reused, but privacy and changed sources are checked before cache access', async () => {
  const originalFetch = globalThis.fetch;
  const globals = globalThis as unknown as Record<string, unknown>;
  // Next's server bootstrap installs this global before loading its cache modules.
  globals.AsyncLocalStorage = AsyncLocalStorage;
  const { loadCachedBanner } = await import('./cached-banner.ts');
  const originalCache = globals.__incrementalCache;
  const originalSite = process.env.SHAREPOINT_SITE_ID;
  const originalList = process.env.SHAREPOINT_LIST_ID;
  const entries = new Map<string, unknown>();
  // Exercise Next's actual cache wrapper and JSON serialization with a memory storage adapter.
  globals.__incrementalCache = {
    generateCacheKey: async (key: string) => key,
    get: async (key: string) => entries.has(key) ? { value: entries.get(key), isStale: false } : null,
    set: async (key: string, value: unknown) => { entries.set(key, value); },
  };
  process.env.SHAREPOINT_SITE_ID = 'site';
  process.env.SHAREPOINT_LIST_ID = 'list';
  setTokenProvider(async () => 'test-token');
  const jpeg = await sharp({ create: { width: 200, height: 300, channels: 3, background: 'red' } }).jpeg().toBuffer();
  let category = 'Public';
  let filename = 'one.jpg';
  let downloads = 0;
  let itemChecks = 0;
  let missing = false;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('/items/10?')) {
      itemChecks++;
      return Response.json({ fields: { Category: category, BannerUrl: `https://centerrahma.sharepoint.com/SiteAssets/${filename}` } });
    }
    if (url.includes('/drives?')) return Response.json({ value: [{ id: 'assets', webUrl: 'https://centerrahma.sharepoint.com/SiteAssets' }] });
    if (url.endsWith(':/content')) {
      downloads++;
      return missing ? new Response(null, { status: 404 }) : new Response(new Uint8Array(jpeg), { headers: { 'content-type': 'image/jpeg' } });
    }
    throw new Error(`Unexpected request: ${url}`);
  };
  try {
    const read = async () => {
      const result = await fetchPublicBanner('10', loadCachedBanner);
      assert.ok(result.ok);
      return Buffer.from(await new Response(result.body).arrayBuffer());
    };
    const first = await read();
    assert.equal((await sharp(first).metadata()).format, 'webp');
    assert.deepEqual(await read(), first);
    assert.equal(downloads, 1, 'repeat request must skip the original download and conversion');
    category = 'Internal';
    assert.deepEqual(await fetchPublicBanner('10', loadCachedBanner), { ok: false, reason: 'not-public' });
    assert.equal(downloads, 1);
    category = 'Public';
    filename = 'two.jpg';
    await read();
    assert.equal(downloads, 2, 'changed BannerUrl must select another cache entry');
    assert.equal(itemChecks, 4, 'each request must check event visibility');
    filename = 'missing.jpg';
    missing = true;
    assert.deepEqual(await fetchPublicBanner('10', loadCachedBanner), { ok: false, reason: 'file-missing' });
    missing = false;
    await read();
    assert.equal(downloads, 4, 'a failure must not prevent a subsequent successful download');
  } finally {
    globalThis.fetch = originalFetch;
    globals.__incrementalCache = originalCache;
    setTokenProvider(null);
    if (originalSite === undefined) delete process.env.SHAREPOINT_SITE_ID;
    else process.env.SHAREPOINT_SITE_ID = originalSite;
    if (originalList === undefined) delete process.env.SHAREPOINT_LIST_ID;
    else process.env.SHAREPOINT_LIST_ID = originalList;
  }
});
