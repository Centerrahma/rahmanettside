'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { MOCK_PRAYER_TIMES } from '@/lib/constants';

export function usePrayerTimes(initialData?: PrayerSchedule) {
  const [data, setData] = useState<PrayerSchedule | undefined>(initialData);
  const [error, setError] = useState<Error | undefined>();
  const [isLoading, setIsLoading] = useState(!initialData);

  const fetchTimes = useCallback(async () => {
    try {
      const res = await fetch('/api/prayer-times');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimes();

    // Refresh every 30 minutes
    const interval = setInterval(fetchTimes, 1800000);

    // Re-fetch when user returns to tab
    const onFocus = () => fetchTimes();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchTimes]);

  return {
    schedule: data || MOCK_PRAYER_TIMES,
    error,
    isLoading,
  };
}
