'use client';

import { useEffect, useState } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { nextSlot, osloNow, slotsFor } from '@/lib/prayer-clock';
import { osloDay } from '@/lib/kalender';

/** Today's slots, the next one and which have passed, following the Oslo clock in the browser. */
export function useClock(schedule: PrayerSchedule | null, renderedFriday: boolean) {
  const [clock, setClock] = useState<{ min: number; friday: boolean; at: Date } | null>(null);
  const [live, setLive] = useState<PrayerSchedule | null>(schedule);
  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const res = await fetch('/api/prayer-times', {
          cache: 'no-store',
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
        });
        if (!res.ok) return;
        const data: PrayerSchedule = await res.json();
        if (data.date === osloDay(new Date())) setLive(data);
      } catch {
        // Keep today's last successful schedule; retry on the next tick or focus.
      } finally {
        pending = false;
      }
    };
    void refresh();
    const id = setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      clearInterval(id);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  useEffect(() => {
    const tick = () => {
      const n = osloNow();
      setClock({ min: n.min, friday: n.friday, at: new Date() });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const current = live && (!clock || live.date === osloDay(clock.at)) ? live : null;
  const slots = current ? slotsFor(current, clock?.friday ?? renderedFriday) : [];
  const nx = clock && current ? nextSlot(slots, clock.min, current.tomorrowFajr) : null;
  const past = slots.map((slot) => !!clock && !nx?.tomorrow && slot.at <= clock.min);
  return { clock, slots, nx, past };
}

const day = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', weekday: 'long', day: 'numeric', month: 'long' });
const hijri = new Intl.DateTimeFormat('nb-NO-u-ca-islamic-umalqura', { timeZone: 'Europe/Oslo', day: 'numeric', month: 'long', year: 'numeric' });

/** «Lørdag 17. oktober» and «6. jumada I 1448 AH», or nothing until the browser knows the date. */
export function dates(at: Date | undefined) {
  if (!at) return { day: '', hijri: '' };
  const d = day.format(at);
  // a browser without the Umm al-Qura calendar would print a second Gregorian date; leave the line out there
  const hasHijri = hijri.resolvedOptions().calendar.startsWith('islamic');
  return { day: d.charAt(0).toUpperCase() + d.slice(1), hijri: hasHijri ? hijri.format(at) : '' };
}
