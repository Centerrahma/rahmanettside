'use client';

import useSWR from 'swr';
import type { PrayerSchedule } from '@/types/prayer';
import { MOCK_PRAYER_TIMES } from '@/lib/constants';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePrayerTimes(initialData?: PrayerSchedule) {
  const { data, error, isLoading } = useSWR<PrayerSchedule>(
    '/api/prayer-times',
    fetcher,
    {
      fallbackData: initialData || MOCK_PRAYER_TIMES,
      refreshInterval: 3600000, // Refresh every hour
      revalidateOnFocus: false,
    }
  );

  return {
    schedule: data || MOCK_PRAYER_TIMES,
    error,
    isLoading,
  };
}
