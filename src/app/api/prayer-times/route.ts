import { NextResponse } from 'next/server';
import { fetchPrayerTimes } from '@/lib/mymasjid';

export async function GET() {
  try {
    const schedule = await fetchPrayerTimes();
    return NextResponse.json(schedule, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Prayer times API error:', error);
    const { MOCK_PRAYER_TIMES } = await import('@/lib/constants');
    return NextResponse.json(MOCK_PRAYER_TIMES);
  }
}
