import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Power Automate calls this when an item in the SharePoint events list is created
// or changed, so /arrangementer refreshes now instead of within five minutes.
// Setup: docs/sharepoint-arrangementer.md.

const digest = (s: string) => createHash('sha256').update(s).digest();

function authorized(given: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !given) return false;
  // Hashing first makes the comparison constant-time whatever the lengths.
  return timingSafeEqual(digest(given), digest(secret));
}

export async function POST(request: NextRequest) {
  if (!authorized(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Also drops the cached Graph response, which is tagged to this page.
  revalidatePath('/arrangementer');
  revalidateTag('arrangementer', { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
