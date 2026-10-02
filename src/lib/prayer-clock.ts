import type { PrayerName, PrayerSchedule } from '@/types/prayer';

export const PRAYERS: { key: PrayerName; name: string; ar: string }[] = [
  { key: 'fajr', name: 'Fajr', ar: 'الفجر' },
  { key: 'dhuhr', name: 'Dhuhr', ar: 'الظهر' },
  { key: 'asr', name: 'Asr', ar: 'العصر' },
  { key: 'maghrib', name: 'Maghrib', ar: 'المغرب' },
  { key: 'isha', name: 'Isha', ar: 'العشاء' },
];

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** The current time in Oslo, whatever the visitor's or server's own time zone. */
export function osloNow(at = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    min: Number(get('hour')) * 60 + Number(get('minute')),
    friday: get('weekday') === 'Fri',
  };
}

export interface Slot {
  key: PrayerName;
  name: string;
  ar: string;
  time: string;
  /** Minutes after midnight; isha after midnight in summer counts past 24:00. */
  at: number;
  /** The line under the time: iqamah, or the khutbah on Fridays. */
  note: string;
}

/** Today's five slots. On Fridays dhuhr is Jumu'ah: the prayer time, with the khutbah under it. */
export function slotsFor(schedule: PrayerSchedule, friday: boolean): Slot[] {
  let prev = 0;
  return PRAYERS.map((p) => {
    const jumuah = friday && p.key === 'dhuhr';
    const { time, iqamah } = schedule.prayers[p.key];
    const shown = jumuah ? schedule.jummah.prayer : time;
    let at = toMin(shown);
    if (at < prev) at += 24 * 60;
    prev = at;
    return {
      key: p.key,
      name: jumuah ? 'Jumu’ah' : p.name,
      ar: jumuah ? 'الجمعة' : p.ar,
      time: shown,
      at,
      note: jumuah ? `Khutbah ${schedule.jummah.khutbah}` : iqamah ? `Iqamah ${iqamah}` : '',
    };
  });
}

/** Which slot is next, and how many minutes until it; after isha, tomorrow's fajr. */
export function nextSlot(slots: Slot[], nowMin: number, tomorrowFajr?: string) {
  const i = slots.findIndex((s) => s.at > nowMin);
  if (i >= 0) return { index: i, left: slots[i].at - nowMin, tomorrow: false };
  const fajr = tomorrowFajr ? toMin(tomorrowFajr) : slots[0].at;
  return { index: 0, left: fajr + 24 * 60 - nowMin, tomorrow: true };
}

export const until = (left: number) => {
  left = Math.max(0, Math.round(left));
  const h = Math.floor(left / 60);
  const m = left % 60;
  return h ? `${h} t ${m} min` : `${m} min`;
};
