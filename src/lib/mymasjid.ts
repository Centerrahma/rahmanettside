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
 * Fetches prayer times from MyMasjid public API or returns mock data if not configured.
 * The API returns prayer times for an entire year (366 entries), one per day.
 * We find today's entry by matching day + month.
 */
export async function fetchPrayerTimes(): Promise<PrayerSchedule> {
  if (!MYMASJID_API_URL || !MYMASJID_MOSQUE_ID) {
    console.warn('[PrayerTimes] MYMASJID env vars not configured, using mock data');
    const { MOCK_PRAYER_TIMES } = await import('./constants');
    return MOCK_PRAYER_TIMES;
  }

  const url = `${MYMASJID_API_URL}/GetMasjidTimings?GuidId=${MYMASJID_MOSQUE_ID}`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      // The response is the whole year, so an hour-old copy is as good as a fresh one.
      // Today's entry is picked out of it on every render.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[PrayerTimes] MyMasjid API returned status ${res.status}`);
      const { MOCK_PRAYER_TIMES } = await import('./constants');
      return MOCK_PRAYER_TIMES;
    }

    const data: MyMasjidResponse = await res.json();

    if (data.hasError) {
      console.error('[PrayerTimes] MyMasjid API returned hasError=true');
      const { MOCK_PRAYER_TIMES } = await import('./constants');
      return MOCK_PRAYER_TIMES;
    }

    const result = normalizePrayerData(data);
    console.log(`[PrayerTimes] Fetched live data for ${result.date}`);
    return result;
  } catch (error) {
    console.error('[PrayerTimes] MyMasjid API fetch error:', error);
    const { MOCK_PRAYER_TIMES } = await import('./constants');
    return MOCK_PRAYER_TIMES;
  }
}

/** Day, month and ISO date in Oslo — the server runs in UTC, which is a day behind after midnight here. */
function osloDate(at: Date) {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(at)
    .split('-');
  return { iso: `${year}-${month}-${day}`, day: Number(day), month: Number(month) };
}

/**
 * Find today's prayer times from the yearly salahTimings array
 * and normalize to our PrayerSchedule type.
 * Trims whitespace/newlines from all time strings.
 */
function normalizePrayerData(data: MyMasjidResponse): PrayerSchedule {
  const now = osloDate(new Date());
  const tomorrow = osloDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

  const timings = data.model.salahTimings;
  const todayTiming = timings.find(
    (t) => t.day === now.day && t.month === now.month
  );
  const tomorrowTiming = timings.find(
    (t) => t.day === tomorrow.day && t.month === tomorrow.month
  );

  // Fall back to first entry if today not found
  const timing = todayTiming || timings[0];

  if (!todayTiming) {
    console.warn(
      `[PrayerTimes] Could not find entry for day=${now.day} month=${now.month}, using first entry (day=${timing.day}, month=${timing.month})`
    );
  }

  // Get primary Jummah timing
  const jummahTimings = data.model.jumahSalahIqamahTimings;
  const primaryJummah = jummahTimings?.find((j) => j.isPrimary) || jummahTimings?.[0];

  return {
    date: now.iso,
    prayers: {
      fajr: {
        time: timing.fajr.trim(),
        iqamah: timing.iqamah_Fajr.trim(),
      },
      dhuhr: {
        time: timing.zuhr.trim(),
        iqamah: timing.iqamah_Zuhr.trim(),
      },
      asr: {
        time: timing.asr.trim(),
        iqamah: timing.iqamah_Asr.trim(),
      },
      maghrib: {
        time: timing.maghrib.trim(),
        iqamah: timing.iqamah_Maghrib.trim(),
      },
      isha: {
        time: timing.isha.trim(),
        iqamah: timing.iqamah_Isha.trim(),
      },
    },
    jummah: {
      khutbah: primaryJummah?.time?.trim() || '13:30',
      prayer: primaryJummah?.iqamahTime?.trim() || '14:00',
    },
    tomorrowFajr: tomorrowTiming?.fajr.trim(),
  };
}
