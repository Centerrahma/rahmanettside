import { NextResponse } from 'next/server';
import { fetchPublicBanner } from '@/lib/arrangementer';
import { shrinkPicture } from '@/lib/bilde';

// An event's picture, served from our own address. SharePoint files need a Microsoft sign-in, so the
// server fetches the file with the read-only app and passes it on, and only while the event is Public:
// an event set back to Internal stops serving its picture within the cache time below. The picture
// is shrunk to the size the page shows it at (lib/bilde.ts) and sent as WebP.
// Setup: docs/sharepoint-arrangementer.md.

export const dynamic = 'force-dynamic';

const CACHE = 'public, max-age=300, s-maxage=300';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const pic = await fetchPublicBanner(id);
    if (!pic.ok) {
      return NextResponse.json({ error: 'Not found', reason: pic.reason }, { status: 404, headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } });
    }
    const small = await shrinkPicture(pic.body);
    if (!small) {
      return NextResponse.json({ error: 'Not found', reason: 'too-large' }, { status: 404, headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } });
    }
    return new Response(new Uint8Array(small), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': CACHE,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'",
      },
    });
  } catch (err) {
    console.error(`[arrangementer] Could not serve the picture for item ${id}:`, err);
    return NextResponse.json({ error: 'Unavailable' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
