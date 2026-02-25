'use client';

import { useMemo } from 'react';
import type { PrayerName, PrayerSchedule } from '@/types/prayer';

interface NextPrayerResult {
  name: PrayerName;
  time: string;
}

const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function useNextPrayer(schedule: PrayerSchedule | null): NextPrayerResult | null {
  return useMemo(() => {
    if (!schedule) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const name of PRAYER_ORDER) {
      const prayer = schedule.prayers[name];
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        return { name, time: prayer.time };
      }
    }

    return { name: 'fajr', time: schedule.prayers.fajr.time };
  }, [schedule]);
}
