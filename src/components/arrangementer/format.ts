// How the events read on the site: Norwegian, in Oslo time. Shared by the calendar and the
// /arrangementer page.
import type { PublicEvent } from '@/lib/arrangementer';
import { noonUtc, osloDay } from '@/lib/kalender';

const OSLO = 'Europe/Oslo';
const fLong = new Intl.DateTimeFormat('nb-NO', { timeZone: OSLO, weekday: 'long', day: 'numeric', month: 'long' });
const fTime = new Intl.DateTimeFormat('nb-NO', { timeZone: OSLO, hour: '2-digit', minute: '2-digit' });

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** «24» for '2026-10-24' */
export const dayNum = (key: string) => String(Number(key.slice(8)));

/** «Lørdag 24. oktober» */
export const longDay = (key: string) => cap(fLong.format(noonUtc(key)));

/** «10:30–14:30», or just the start when the event runs past midnight or has no end. */
export const time = (e: PublicEvent) => (e.end && osloDay(e.end) === osloDay(e.start)
  ? `${fTime.format(new Date(e.start))}–${fTime.format(new Date(e.end))}`
  : fTime.format(new Date(e.start)));

/** «i dag», «i morgen», «om 3 dager» */
export function until(day: string, today: string) {
  const n = Math.round((noonUtc(day).getTime() - noonUtc(today).getTime()) / 86_400_000);
  return n <= 0 ? 'i dag' : n === 1 ? 'i morgen' : `om ${n} dager`;
}
