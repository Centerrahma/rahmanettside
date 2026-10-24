'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { addDays, byDay, monthGrid, monthOf, monthsBetween, noonUtc, osloDay, twoWeeks, weekday } from '@/lib/kalender';
import { Recess } from '@/components/forside/gips/Gips';
import { Reveal, r } from '@/components/forside/gips/Reveal';
import fs from '@/components/forside/gips/seksjoner.module.css';
import s from './kalender.module.css';

/* The events calendar: days carved into the plaster as small square cuts, the days with something on
   filled with the green tadelakt. Choose one and its events stand on a green plate.
   Front page (wide screens): this week and next. Phones: a strip of the next fourteen days.
   /arrangementer: a month at a time, with the month's events listed beside it.
   `today` comes from the server, so server and browser agree on it. */

const WD = ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'];
const OSLO = 'Europe/Oslo';
const fLong = new Intl.DateTimeFormat('nb-NO', { timeZone: OSLO, weekday: 'long', day: 'numeric', month: 'long' });
const fMonth = new Intl.DateTimeFormat('nb-NO', { timeZone: OSLO, month: 'long' });
const fTime = new Intl.DateTimeFormat('nb-NO', { timeZone: OSLO, hour: '2-digit', minute: '2-digit' });

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const dayNum = (key: string) => String(Number(key.slice(8)));
/** «Lørdag 24. oktober» */
const longDay = (key: string) => cap(fLong.format(noonUtc(key)));
const monthName = (month: string) => cap(fMonth.format(noonUtc(`${month}-15`)));
const time = (e: PublicEvent) => (e.end && osloDay(e.end) === osloDay(e.start)
  ? `${fTime.format(new Date(e.start))}–${fTime.format(new Date(e.end))}`
  : fTime.format(new Date(e.start)));

/** The first day from `days` on or after today that has an event. */
const firstWithEvents = (days: string[], ev: Record<string, PublicEvent[]>, today: string) =>
  days.find((d) => d >= today && ev[d]) ?? null;

function Cells({ days, ev, today, sel, onSel, month }: { days: string[]; ev: Record<string, PublicEvent[]>; today: string; sel: string | null; onSel: (d: string) => void; month?: string }) {
  return (
    <div className={s.cal}>
      {WD.map((w) => <span key={w} className={s.wd} aria-hidden="true">{w}</span>)}
      {days.map((d) => {
        const n = ev[d]?.length;
        const dim = d < today || (month !== undefined && monthOf(d) !== month);
        const label = <><span className={s.n}>{dayNum(d)}</span>{d === today && <span className={s.today}>i dag</span>}</>;
        return n ? (
          <button key={d} type="button" className={`${s.cell} ${s.has}`} data-dim={dim ? '' : undefined} aria-pressed={sel === d} onClick={() => onSel(d)}
            aria-label={`${longDay(d)}, ${n === 1 ? 'ett arrangement' : `${n} arrangementer`}`}>{label}</button>
        ) : (
          <span key={d} className={s.cell} data-dim={dim ? '' : undefined} aria-hidden="true">{label}</span>
        );
      })}
    </div>
  );
}

/** The chosen day's events on green tadelakt; cream on phones. */
function Plate({ day, events, empty }: { day: string | null; events: PublicEvent[]; empty: string }) {
  return (
    <Recess shape="rect" steps={1} tone="green" className={s.plate}>
      <div className={s.plateIn} key={day ?? 'none'} aria-live="polite">
        {day ? (
          <>
            <h3 className={s.pDate}>{longDay(day)}</h3>
            <ul className={s.pList}>
              {events.map((e) => (
                <li key={e.id}>
                  <p className={s.pTitle}>{e.title}</p>
                  <p className={s.pWhen}>kl. {time(e)}{e.location && <> · {e.location}</>}</p>
                </li>
              ))}
            </ul>
          </>
        ) : <p className={s.pEmpty}>{empty}</p>}
      </div>
    </Recess>
  );
}

/** Front page, wide screens: this week and next, between Vårt fellesskap and Støtt moskeen. */
export function ForsideKalender({ events, today }: { events: PublicEvent[]; today: string }) {
  const ev = useMemo(() => byDay(events), [events]);
  const days = twoWeeks(today);
  const [sel, setSel] = useState(() => firstWithEvents(days, ev, today));
  return (
    <Reveal className={s.sec} id="arrangementer" aria-labelledby="v-ar">
      <div className={fs.wrap}>
        <div className={s.top}>
          <div>
            <h2 id="v-ar" className={fs.h2} {...r(0)}>Arrangementer</h2>
            <p className={s.lead} {...r(1)}>Velg en dag for å se hva som skjer i moskeen de neste to ukene.</p>
          </div>
          <div {...r(1)}><Link className={`${fs.btn} ${fs.btnGreen}`} href="/arrangementer">Hele kalenderen<span aria-hidden="true">→</span></Link></div>
        </div>
        <div className={s.pair} {...r(2)}>
          <Recess shape="rect" steps={2} className={s.calBox}><Cells days={days} ev={ev} today={today} sel={sel} onSel={setSel} /></Recess>
          <Plate day={sel} events={sel ? ev[sel] : []} empty="Ingen arrangementer de neste to ukene. Se hele kalenderen for det som kommer senere." />
        </div>
      </div>
    </Reveal>
  );
}

/** Front page, phones: the next fourteen days as a strip to swipe, the chosen day under it. */
export function KalenderStripe({ events, today }: { events: PublicEvent[]; today: string }) {
  const ev = useMemo(() => byDay(events), [events]);
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const [sel, setSel] = useState(() => firstWithEvents(days, ev, today));
  return (
    <>
      <div className={s.mStrip} data-reveal>
        <Recess shape="rect" steps={1} className={s.mStripBox}>
          <div className={s.strip}>
            {days.map((d) => {
              const n = ev[d]?.length;
              const inner = <><span className={s.sWd}>{d === today ? 'i dag' : WD[weekday(d)]}</span><span className={s.sN}>{dayNum(d)}</span></>;
              return n ? (
                <button key={d} type="button" className={`${s.sCell} ${s.has}`} aria-pressed={sel === d} onClick={() => setSel(d)}
                  aria-label={`${longDay(d)}, ${n === 1 ? 'ett arrangement' : `${n} arrangementer`}`}>{inner}</button>
              ) : <span key={d} className={s.sCell} aria-hidden="true">{inner}</span>;
            })}
          </div>
        </Recess>
      </div>
      <div className={s.mPlate} data-reveal>
        <Plate day={sel} events={sel ? ev[sel] : []} empty="Ingen arrangementer de neste to ukene." />
      </div>
    </>
  );
}

/** /arrangementer: one month at a time, from this month to the month of the last event. */
export function KalenderSide({ events, today }: { events: PublicEvent[]; today: string }) {
  const ev = useMemo(() => byDay(events), [events]);
  const last = events.length ? osloDay(events[events.length - 1].start) : today;
  const months = monthsBetween(monthOf(today), monthOf(last));
  const [mi, setMi] = useState(0);
  const month = months[mi];
  const days = monthGrid(month);
  const inMonth = days.filter((d) => monthOf(d) === month);
  const [sel, setSel] = useState(() => firstWithEvents(inMonth, ev, today));
  const go = (n: number) => {
    setMi(n);
    setSel(firstWithEvents(monthGrid(months[n]).filter((d) => monthOf(d) === months[n]), ev, today));
  };
  const listed = inMonth.filter((d) => d >= today && ev[d]);
  const name = monthName(month);
  return (
    <div className={s.pGrid}>
      <div>
        <div className={s.mBar}>
          <button type="button" className={s.arrow} onClick={() => go(mi - 1)} disabled={mi === 0} aria-label="Forrige måned">←</button>
          <h2 className={s.mName} aria-live="polite">{name}</h2>
          <button type="button" className={s.arrow} onClick={() => go(mi + 1)} disabled={mi === months.length - 1} aria-label="Neste måned">→</button>
        </div>
        <Recess shape="rect" steps={2} className={s.calBox}><Cells days={days} ev={ev} today={today} sel={sel} onSel={setSel} month={month} /></Recess>
      </div>
      <div className={s.pSide}>
        <Plate day={sel} events={sel ? ev[sel] : []} empty={`Ingen arrangementer i ${name.toLowerCase()}.`} />
        {listed.length > 0 && (
          <>
            <h2 className={s.allTitle}>Alt i {name.toLowerCase()}</h2>
            <ul className={s.all}>
              {listed.flatMap((d) => ev[d].map((e) => (
                <li key={e.id}>
                  <button type="button" data-on={sel === d ? '' : undefined} onClick={() => setSel(d)}>
                    <span className={s.aDay}>{dayNum(d)}.</span>
                    <span><b>{e.title}</b>{longDay(d).split(' ')[0]} kl. {time(e)}{e.location && <> · {e.location}</>}</span>
                  </button>
                </li>
              )))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
