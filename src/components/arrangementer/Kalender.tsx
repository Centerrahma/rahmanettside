'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { byDay, noonUtc, twoWeeks } from '@/lib/kalender';
import { Recess } from '@/components/forside/gips/Gips';
import { Reveal, r } from '@/components/forside/gips/Reveal';
import fs from '@/components/forside/gips/seksjoner.module.css';
import { dayNum, longDay, time } from './format';
import s from './kalender.module.css';

const WD = ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'];
const month = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', month: 'short' });
const monthYear = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', month: 'long', year: 'numeric' });

function Cells({ days, ev, today, selected, onSelect }: {
  days: string[]; ev: Record<string, PublicEvent[]>; today: string;
  selected: string | null; onSelect: (day: string) => void;
}) {
  return (
    <div className={s.cal}>
      {WD.map((w) => <span key={w} className={s.wd} aria-hidden="true">{w}</span>)}
      {days.map((day) => {
        const count = ev[day]?.length;
        const label = <><span className={s.n}>{dayNum(day)}</span><span className={s.dayNote}>{day === today ? 'i dag' : count ? count : ''}</span></>;
        return count && day >= today ? (
          <button key={day} type="button" className={`${s.cell} ${s.has}`} aria-pressed={selected === day} onClick={() => onSelect(day)}
            aria-label={`${longDay(day)}, ${count === 1 ? 'ett arrangement' : `${count} arrangementer`}`}>
            {label}
          </button>
        ) : <span key={day} className={s.cell} data-dim={day < today ? '' : undefined} aria-hidden="true">{label}</span>;
      })}
    </div>
  );
}

/** Removed, private, or broken attachments fall back to the event's facts. */
function EventFeature({ event, day }: { event: PublicEvent; day: string }) {
  const [broken, setBroken] = useState(false);
  const image = broken ? null : event.image;
  return (
    <article className={`${s.feature} ${image ? '' : s.withoutImage}`} aria-live="polite">
      {image && (
        <div className={s.picture}>
          {/* Bypass the optimiser so withdrawn attachments are not cached separately. */}
          <Image src={image} alt={`Bilde til ${event.title}`} fill unoptimized
            sizes="(max-width: 860px) 92vw, (max-width: 1100px) 50vw, 400px" onError={() => setBroken(true)} />
        </div>
      )}
      <div className={s.featureCopy}>
        <h3 className={s.eventTitle}>{event.title}</h3>
        <p className={s.eventWhen}><time dateTime={day}>{longDay(day)}</time> · kl. {time(event)}</p>
        {event.location && <p className={s.eventPlace}>{event.location}</p>}
        <Link className={s.featureLink} href="/arrangementer">Se arrangementet<span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}

function PhotoCalendar({ events, today }: { events: PublicEvent[]; today: string }) {
  const ev = useMemo(() => byDay(events), [events]);
  const days = twoWeeks(today);
  const upcoming = days.filter((day) => day >= today).flatMap((day) => (ev[day] ?? []).map((event) => ({ day, event })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = upcoming.find(({ event }) => event.id === selectedId) ?? upcoming[0];
  const chooseDay = (day: string) => setSelectedId(ev[day]?.[0]?.id ?? null);
  return (
    <div className={s.pair}>
      <div className={s.sidebar}>
        <Recess shape="rect" steps={1} className={s.calBox}>
          <p className={s.month}>{monthYear.format(noonUtc(today))}</p>
          <Cells days={days} ev={ev} today={today} selected={selected?.day ?? null} onSelect={chooseDay} />
        </Recess>
        {upcoming.length > 0 && (
          <>
            <label className={s.picker}>Velg arrangement
              <select value={selected?.event.id ?? ''} onChange={(e) => setSelectedId(e.target.value)}>
                {upcoming.map(({ day, event }) => <option key={event.id} value={event.id}>{dayNum(day)}. {month.format(noonUtc(day))} · {event.title}</option>)}
              </select>
            </label>
            <div className={s.eventList} role="group" aria-label="Velg arrangement">
              {upcoming.map(({ day, event }) => (
                <button key={event.id} type="button" aria-pressed={selected?.event.id === event.id} onClick={() => setSelectedId(event.id)}>
                  <span className={s.listDate}>{dayNum(day)}<small>{month.format(noonUtc(day))}</small></span>
                  <span className={s.listTitle}>{event.title}<small>kl. {time(event)}</small></span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {selected ? <EventFeature key={`${selected.event.id}:${selected.event.image}`} event={selected.event} day={selected.day} /> : (
        <div className={`${s.feature} ${s.withoutImage}`}><p className={s.empty}>Ingen arrangementer de neste to ukene. Se hele kalenderen for det som kommer senere.</p></div>
      )}
    </div>
  );
}

export function ForsideKalender({ events, today }: { events: PublicEvent[]; today: string }) {
  return (
    <Reveal className={s.sec} id="arrangementer" aria-labelledby="v-ar">
      <div className={fs.wrap} data-home-events-content>
        <div className={s.top}>
          <div>
            <h2 id="v-ar" className={fs.h2} {...r(0)}>Arrangementer</h2>
            <p className={s.lead} {...r(1)}>Finn din neste anledning til å møtes.</p>
          </div>
          <div {...r(1)}><Link className={`${fs.btn} ${fs.btnGreen}`} href="/arrangementer">Alle arrangementer<span aria-hidden="true">↗</span></Link></div>
        </div>
        <div {...r(2)}><PhotoCalendar events={events} today={today} /></div>
      </div>
    </Reveal>
  );
}

export function MobilKalender({ events, today }: { events: PublicEvent[]; today: string }) {
  return <div className={s.mobile} data-reveal><PhotoCalendar events={events} today={today} /></div>;
}
