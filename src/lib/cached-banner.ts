import { unstable_cache } from 'next/cache.js';
import { downloadBanner, type Banner } from './arrangementer.ts';
import { shrinkPicture } from './bilde.ts';

class UnavailablePicture extends Error {
  reason: string;
  constructor(reason: string) {
    super(reason);
    this.reason = reason;
  }
}

// Cache only the processed bytes, never the decision that an event is public.
// The source URL is part of the key, so changing BannerUrl selects a new entry.
const processedPicture = unstable_cache(async (url: string) => {
  const picture = await downloadBanner(url);
  if (!picture.ok) throw new UnavailablePicture(picture.reason);
  const small = await shrinkPicture(picture.body);
  if (!small) throw new UnavailablePicture('too-large');
  // Next's data cache serializes JSON; encode bytes explicitly for a lossless round trip.
  return small.toString('base64');
}, ['event-webp-v1'], { revalidate: 300, tags: ['arrangementer'] });

export async function loadCachedBanner(url: string): Promise<Banner> {
  try {
    const bytes = Buffer.from(await processedPicture(url), 'base64');
    return { ok: true, body: new Response(new Uint8Array(bytes)).body!, type: 'image/webp' };
  } catch (error) {
    // Throw inside the cache so missing or oversized files never become cached successes.
    if (error instanceof UnavailablePicture) return { ok: false, reason: error.reason };
    throw error;
  }
}
