'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { addDays, byDay, twoWeeks, weekday } from '@/lib/kalender';
import { Recess } from '@/components/forside/gips/Gips';
import { Reveal, r } from '@/components/forside/gips/Reveal';
import fs from '@/components/forside/gips/seksjoner.module.css';
import { dayNum, longDay, time } from './format';
import s from './kalender.module.css';

/* The events calendar: days carved into the plaster as small square cuts, the days with something on
   filled with the green tadelakt. Choose one and its events stand on a green plate.
   Front page (wide screens): this week and next. Phones: a strip of the next fourteen days.
   `today` comes from the server, so server and browser agree on it. */

const WD = ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'];
/** The first day from `days` on or after today that has an event. */
const firstWithEvents = (days: string[], ev: Record<string, PublicEvent[]>, today: string) =>
  days.find((d) => d >= today && ev[d]) ?? null;

function Cells({ days, ev, today, sel, onSel }: { days: string[]; ev: Record<string, PublicEvent[]>; today: string; sel: string | null; onSel: (d: string) => void }) {
  return (
    <div className={s.cal}>
      {WD.map((w) => <span key={w} className={s.wd} aria-hidden="true">{w}</span>)}
      {days.map((d) => {
        const n = ev[d]?.length;
        const dim = d < today;
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
          <div {...r(1)}><Link className={`${fs.btn} ${fs.btnGreen}`} href="/arrangementer">Alle arrangementer<span aria-hidden="true">→</span></Link></div>
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
