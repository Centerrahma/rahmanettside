import { NextResponse } from 'next/server';
import { fetchPrayerTimes } from '@/lib/mymasjid';

export const dynamic = 'force-dynamic'; // Always run server-side, never static

export async function GET() {
  try {
    const schedule = await fetchPrayerTimes();
    return NextResponse.json(schedule, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[PrayerTimes] API route error:', error);
    return NextResponse.json({ error: 'Bønnetidene er midlertidig utilgjengelige.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
