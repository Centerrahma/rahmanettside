'use client';

import { useEffect, useState } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { nextSlot, osloNow, slotsFor } from '@/lib/prayer-clock';

/** Today's slots, the next one and which have passed, following the Oslo clock in the browser. */
export function useClock(schedule: PrayerSchedule, renderedFriday: boolean) {
  const [clock, setClock] = useState<{ min: number; friday: boolean; at: Date } | null>(null);
  useEffect(() => {
    const tick = () => {
      const n = osloNow();
      setClock({ min: n.min, friday: n.friday, at: new Date() });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const slots = slotsFor(schedule, clock?.friday ?? renderedFriday);
  const nx = clock ? nextSlot(slots, clock.min, schedule.tomorrowFajr) : null;
  const past = slots.map((slot) => !!clock && !nx?.tomorrow && slot.at <= clock.min);
  return { clock, slots, nx, past };
}

const day = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', weekday: 'long', day: 'numeric', month: 'long' });
const hijri = new Intl.DateTimeFormat('nb-NO-u-ca-islamic-umalqura', { timeZone: 'Europe/Oslo', day: 'numeric', month: 'long', year: 'numeric' });

/** «Lørdag 17. oktober» and «6. jumada I 1448 AH», or nothing until the browser knows the date. */
export function dates(at: Date | undefined) {
  if (!at) return { day: '', hijri: '' };
  const d = day.format(at);
  return { day: d.charAt(0).toUpperCase() + d.slice(1), hijri: hijri.format(at) };
}
