// Calendar arithmetic for the events calendar, in Oslo days. A day is a 'yyyy-mm-dd' key. Keys are
// stepped through noon UTC, which is the same calendar day in Oslo summer and winter, so no step
// ever lands on the wrong side of a midnight or a clock change.

const OSLO = 'Europe/Oslo';
const fKey = new Intl.DateTimeFormat('en-CA', { timeZone: OSLO, year: 'numeric', month: '2-digit', day: '2-digit' });
const DAY = 86_400_000;

/** The Oslo day an instant falls on. */
export const osloDay = (d: Date | string) => fKey.format(new Date(d));

/** Noon UTC on a day: an instant that is that same day in Oslo, for formatting it. */
export const noonUtc = (key: string) => new Date(`${key}T12:00:00Z`);

export const addDays = (key: string, n: number) => new Date(noonUtc(key).getTime() + n * DAY).toISOString().slice(0, 10);

/** 0 for Monday … 6 for Sunday. */
export const weekday = (key: string) => (noonUtc(key).getUTCDay() + 6) % 7;

export const mondayOf = (key: string) => addDays(key, -weekday(key));

/** The two weeks from the Monday of `today`'s week. */
export const twoWeeks = (today: string) => Array.from({ length: 14 }, (_, i) => addDays(mondayOf(today), i));

/** 'yyyy-mm' of a day key. */
export const monthOf = (key: string) => key.slice(0, 7);

/** Events keyed by the Oslo day they start on, in the order given. */
export function byDay<T extends { start: string }>(events: T[]): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const e of events) (out[osloDay(e.start)] ??= []).push(e);
  return out;
}
