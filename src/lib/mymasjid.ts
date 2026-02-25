import type { PrayerSchedule } from '@/types/prayer';

const MYMASJID_API_URL = process.env.MYMASJID_API_URL || '';
const MYMASJID_MOSQUE_ID = process.env.MYMASJID_MOSQUE_ID || '';

interface SalahTiming {
  fajr: string;
  shouruq: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  day: number;
  month: number;
  iqamah_Fajr: string;
  iqamah_Zuhr: string;
  iqamah_Asr: string;
  iqamah_Maghrib: string;
  iqamah_Isha: string;
}

interface JumahTiming {
  time: string;
  iqamahTime: string;
  isPrimary: boolean;
}

interface MyMasjidResponse {
  model: {
    salahTimings: SalahTiming[];
    jumahSalahIqamahTimings: JumahTiming[];
  };
  hasError: boolean;
  statusCode: number;
}

/**
 * Fetches prayer times from MyMasjid public API or returns mock data if not configured
 */
export async function fetchPrayerTimes(): Promise<PrayerSchedule> {
  if (!MYMASJID_API_URL || !MYMASJID_MOSQUE_ID) {
    const { MOCK_PRAYER_TIMES } = await import('./constants');
    return MOCK_PRAYER_TIMES;
  }

  try {
    const res = await fetch(
      `${MYMASJID_API_URL}/GetMasjidTimings?GuidId=${MYMASJID_MOSQUE_ID}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error('MyMasjid API error:', res.status);
      const { MOCK_PRAYER_TIMES } = await import('./constants');
      return MOCK_PRAYER_TIMES;
    }

    const data: MyMasjidResponse = await res.json();

    if (data.hasError) {
      console.error('MyMasjid API returned error');
      const { MOCK_PRAYER_TIMES } = await import('./constants');
      return MOCK_PRAYER_TIMES;
    }

    return normalizePrayerData(data);
  } catch (error) {
    console.error('MyMasjid API fetch error:', error);
    const { MOCK_PRAYER_TIMES } = await import('./constants');
    return MOCK_PRAYER_TIMES;
  }
}

/**
 * Find today's prayer times from the yearly salahTimings array
 * and normalize to our PrayerSchedule type
 */
function normalizePrayerData(data: MyMasjidResponse): PrayerSchedule {
  const now = new Date();
  const today = now.getDate();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

  const timings = data.model.salahTimings;
  const todayTiming = timings.find(
    (t) => t.day === today && t.month === currentMonth
  );

  // Fall back to first entry if today not found
  const timing = todayTiming || timings[0];

  // Get primary Jummah timing
  const jummahTimings = data.model.jumahSalahIqamahTimings;
  const primaryJummah = jummahTimings?.find((j) => j.isPrimary) || jummahTimings?.[0];

  return {
    date: now.toISOString().split('T')[0],
    prayers: {
      fajr: {
        time: timing.fajr,
        iqamah: timing.iqamah_Fajr,
      },
      dhuhr: {
        time: timing.zuhr,
        iqamah: timing.iqamah_Zuhr,
      },
      asr: {
        time: timing.asr,
        iqamah: timing.iqamah_Asr,
      },
      maghrib: {
        time: timing.maghrib,
        iqamah: timing.iqamah_Maghrib,
      },
      isha: {
        time: timing.isha,
        iqamah: timing.iqamah_Isha,
      },
    },
    jummah: {
      khutbah: primaryJummah?.time || '13:30',
      prayer: primaryJummah?.iqamahTime || '14:00',
    },
  };
}
