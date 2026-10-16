import { NextResponse, type NextRequest } from 'next/server';
import { SKJERM_SUBDOMAIN } from '@/lib/skjerm';

/** skjerm.centerrahma.no opens on the touch screen page; every other host gets the normal front page. */
export function proxy(request: NextRequest) {
  // the Host header, since nextUrl carries the server's own name under `next start`
  const host = request.headers.get('host') ?? '';
  if (host.startsWith(`${SKJERM_SUBDOMAIN}.`)) {
    return NextResponse.rewrite(new URL('/skjerm', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: '/' };
