'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/* The coming Friday prayer, counted in the browser in Oslo time. */

const parts = (at: Date) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(at);
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return { wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: Number(g('hour')) * 60 + Number(g('minute')) };
};
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const noop = () => () => {};

/** The coming Friday («fredag 24. oktober», «24», «okt») and how long until its khutbah, counted in the
    browser in Oslo time. `left` stays null until the browser knows the clock. */
export function useFriday(khutbah: string, prayer: string) {
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30_000); return () => clearInterval(id); }, []);
  const { wd, min } = parts(now);
  const k = toMin(khutbah), end = toMin(prayer) + 20;
  // days until Friday; on a Friday after the prayer, next week's
  let days = (5 - wd + 7) % 7;
  if (days === 0 && min > end) days = 7;
  const date = new Date(now.getTime() + days * 86_400_000);
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', ...o }).format(date).replace('.', '');
  let left: string | null = null;
  if (ready) {
    if (days === 0 && min >= k) left = 'Pågår nå';
    else if (days === 0) { const m = k - min; left = `I dag, om ${m >= 60 ? `${Math.floor(m / 60)} t ` : ''}${m % 60} min`; }
    else if (days === 1) left = 'I morgen';
    else left = `Om ${days} dager`;
  }
  return { days, day: fmt({ day: 'numeric' }), month: fmt({ month: 'long' }), monthShort: fmt({ month: 'short' }), left };
}
