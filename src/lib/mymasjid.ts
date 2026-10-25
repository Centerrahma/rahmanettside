import type { PrayerSchedule } from '@/types/prayer';
import { addDays, osloDay } from './kalender.ts';

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
 * Fetches prayer times from MyMasjid. Failures must never become published sample times.
 * The API returns prayer times for an entire year (366 entries), one per day.
 * We find today's entry by matching day + month.
 */
export async function fetchPrayerTimes(): Promise<PrayerSchedule> {
  const MYMASJID_API_URL = process.env.MYMASJID_API_URL || '';
  const MYMASJID_MOSQUE_ID = process.env.MYMASJID_MOSQUE_ID || '';
  if (!MYMASJID_API_URL || !MYMASJID_MOSQUE_ID) {
    throw new Error('[PrayerTimes] MyMasjid not configured');
  }

  const url = `${MYMASJID_API_URL}/GetMasjidTimings?GuidId=${MYMASJID_MOSQUE_ID}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`[PrayerTimes] MyMasjid API returned status ${res.status}`);
  }

  const data: MyMasjidResponse = await res.json();

  if (data.hasError) {
    throw new Error('[PrayerTimes] MyMasjid API returned hasError=true');
  }

  const result = normalizePrayerData(data);
  return result;
}

/** Day, month and ISO date in Oslo — the server runs in UTC, which is a day behind after midnight here. */
function osloDate(at: Date) {
  const [year, month, day] = osloDay(at).split('-');
  return { iso: `${year}-${month}-${day}`, day: Number(day), month: Number(month) };
}

/**
 * Find today's prayer times from the yearly salahTimings array
 * and normalize to our PrayerSchedule type.
 * Trims whitespace/newlines from all time strings.
 */
function normalizePrayerData(data: MyMasjidResponse): PrayerSchedule {
  const now = osloDate(new Date());
  const tomorrow = osloDate(new Date(`${addDays(now.iso, 1)}T12:00:00Z`));

  const timings = data.model.salahTimings;
  const todayTiming = timings.find(
    (t) => t.day === now.day && t.month === now.month
  );
  const tomorrowTiming = timings.find(
    (t) => t.day === tomorrow.day && t.month === tomorrow.month
  );

  if (!todayTiming) {
    throw new Error(`[PrayerTimes] No schedule for ${now.iso}`);
  }
  const timing = todayTiming;

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
