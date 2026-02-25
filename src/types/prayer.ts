export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  time: string;
  iqamah?: string;
}

export interface PrayerSchedule {
  date: string;
  prayers: Record<PrayerName, PrayerTime>;
  jummah: {
    khutbah: string;
    prayer: string;
  };
}
