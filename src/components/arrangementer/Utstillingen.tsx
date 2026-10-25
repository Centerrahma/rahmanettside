'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { addDays, byDay, mondayOf, noonUtc, osloDay, weekday } from '@/lib/kalender';
import { dayNum, longDay, time } from './format';
import s from './utstillingen.module.css';

const monthLabel = new Intl.DateTimeFormat('nb-NO', { month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' });
const shortMonth = new Intl.DateTimeFormat('nb-NO', { month: 'short', timeZone: 'Europe/Oslo' });

function downloadCalendar(event: PublicEvent) {
  const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
  const stamp = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Center Rahma//Arrangementer//NO', 'BEGIN:VEVENT',
    `UID:rahma-${escape(event.id)}@centerrahma.no`, `DTSTAMP:${stamp(new Date().toISOString())}`, `DTSTART:${stamp(event.start)}`,
    ...(event.end ? [`DTEND:${stamp(event.end)}`] : []), `SUMMARY:${escape(event.title)}`,
    ...(event.location ? [`LOCATION:${escape(event.location)}`] : []), 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `rahma-${event.id}.ics`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Utstillingen({ events, today }: { events: PublicEvent[]; today: string }) {
  const firstDay = events[0] ? osloDay(events[0].start) : today;
  const [day, setDay] = useState(firstDay);
  const [month, setMonth] = useState(firstDay.slice(0, 7));
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [filter, setFilter] = useState(0);
  const [detail, setDetail] = useState<PublicEvent | null>(null);
  const [broken, setBroken] = useState<ReadonlySet<string>>(() => new Set());
  const dialog = useRef<HTMLDialogElement>(null);
  const days = byDay(events);
  const selected = days[day]?.find(event => event.id === selectedId) ?? days[day]?.[0];
  const monthStart = `${month}-01`;
  const count = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).getUTCDate();
  const weekStart = addDays(mondayOf(today), filter === 2 ? 7 : 0);
  const visible = filter === 0 ? events : events.filter(event => {
    const date = osloDay(event.start);
    return date >= weekStart && date < addDays(weekStart, 7);
  });
  const reset = () => { setDay(firstDay); setMonth(firstDay.slice(0, 7)); setSelectedId(events[0]?.id); };
  const moveMonth = (offset: number) => {
    const date = noonUtc(monthStart);
    date.setUTCMonth(date.getUTCMonth() + offset);
    const next = date.toISOString().slice(0, 7);
    setMonth(next);
    setDay(Object.keys(days).sort().find(key => key.startsWith(next)) ?? `${next}-01`);
  };
  const picture = (event: PublicEvent, thumbnail = false) => (
    <div className={`${s.picture} ${thumbnail ? s.thumbnail : ''}`}>
      {event.image && !broken.has(event.id) ? (
        // Keep withdrawal of private attachments under the control of our own image route.
        <Image src={event.image} alt={thumbnail ? '' : `Bilde til ${event.title}`} fill unoptimized
          sizes={thumbnail ? '56px' : '(max-width: 900px) 90vw, 520px'}
          onError={() => setBroken(previous => new Set(previous).add(event.id))} />
      ) : <span className={s.dateArt} aria-hidden="true"><b>{dayNum(osloDay(event.start))}</b><span>{shortMonth.format(new Date(event.start))}</span></span>}
    </div>
  );
  const facts = (event: PublicEvent) => <dl className={s.facts}>
    <div><dt>Tid</dt><dd>{longDay(osloDay(event.start))}<span>kl. {time(event)}</span></dd></div>
    {event.location && <div><dt>Sted</dt><dd>{event.location}</dd></div>}
  </dl>;
  const actions = (event: PublicEvent) => <div className={s.actions}>
    <button className={s.solid} type="button" onClick={() => downloadCalendar(event)}>Legg i kalender <span aria-hidden="true">↗</span></button>
    {event.location && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer">Veibeskrivelse <span aria-hidden="true">↗</span></a>}
  </div>;
  const open = (event: PublicEvent) => { setDetail(event); dialog.current?.showModal(); };

  return <section className={s.screen} aria-labelledby="ar-h1">
    <div className={s.wrap}>
      <header className={s.heading}><h1 id="ar-h1">Arrangementer</h1><p><span className={s.desktopLead}>Finn en dag. Se hva som skjer.</span><span className={s.mobileLead}>Små og store anledninger. Sammen i Rahma.</span></p></header>
      {events.length === 0 ? <div className={s.empty}><h2>Ingen kommende arrangementer akkurat nå.</h2><p>Følg med her eller på Facebook.</p></div> : <>
        <div className={s.desktop}>
          <aside>
            <div className={s.monthPanel}>
              <div className={s.monthHead}><h2 aria-live="polite">{monthLabel.format(noonUtc(monthStart))}</h2><div className={s.arrows}><button type="button" onClick={() => moveMonth(-1)} aria-label="Forrige måned">←</button><button type="button" onClick={() => moveMonth(1)} aria-label="Neste måned">→</button></div></div>
              <div className={s.monthDays}>
                {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((name, i) => <span className={s.weekday} aria-hidden="true" key={i}>{name}</span>)}
                {Array.from({ length: weekday(monthStart) }, (_, i) => <span key={`blank-${i}`} />)}
                {Array.from({ length: count }, (_, i) => {
                  const key = `${month}-${String(i + 1).padStart(2, '0')}`;
                  const total = days[key]?.length ?? 0;
                  return <button className={s.dateCell} data-events={total > 0 || undefined} type="button" key={key} aria-pressed={day === key} aria-current={key === today ? 'date' : undefined}
                    aria-label={`${longDay(key)}, ${total} arrangementer`} onClick={() => setDay(key)}><span>{i + 1}</span><small>{total > 0 ? `${total} arr.` : '\u00a0'}</small></button>;
                })}
              </div>
            </div>
            <div className={s.dayEvents}><h2>{longDay(day)}</h2>
              {(days[day] ?? []).map(event => <button type="button" key={event.id} aria-pressed={event.id === selected?.id} onClick={() => setSelectedId(event.id)}>{picture(event, true)}<span>{event.title}<small>kl. {time(event)}</small></span></button>)}
              {!days[day]?.length && <p>Ingen arrangementer denne dagen.</p>}
            </div>
            <button type="button" className={s.reset} onClick={reset}>Til neste arrangement →</button>
          </aside>
          {selected ? <article className={s.feature} key={selected.id} aria-live="polite">{picture(selected)}<div className={s.featureCopy}><div><h2>{selected.title}</h2>{facts(selected)}</div>{actions(selected)}</div></article> : <div className={s.empty}><h2>En ledig dag i kalenderen.</h2><p>Velg en markert dato for å se hva som skjer.</p><button type="button" className={s.solid} onClick={reset}>Se neste arrangement →</button></div>}
        </div>
        <div className={s.mobile}>
          <div className={s.filters} aria-label="Filtrer arrangementer">{['Alle arrangementer', 'Denne uken', 'Neste uke'].map((label, i) => <button type="button" key={label} aria-pressed={filter === i} onClick={() => setFilter(i)}>{label}</button>)}</div>
          <div className={s.posters}>
            {visible.map((event, i) => <article className={s.poster} key={event.id}>
              <button type="button" className={`${s.posterImage} ${i === 0 ? s.largePoster : ''}`} onClick={() => open(event)} aria-label={`Se ${event.title}`}>{picture(event)}</button>
              <div className={s.caption}><span className={s.posterDate} aria-hidden="true">{dayNum(osloDay(event.start))}<small>{shortMonth.format(new Date(event.start))}</small></span><div><h2><button type="button" onClick={() => open(event)}>{event.title}</button></h2><p>{longDay(osloDay(event.start))} · kl. {time(event)}</p>{event.location && <p>{event.location}</p>}</div><button className={s.detailArrow} type="button" aria-label={`Detaljer om ${event.title}`} onClick={() => open(event)}>↗</button></div>
            </article>)}
          </div>
          {visible.length === 0 && <div className={s.empty} role="status"><h2>Ingen arrangementer denne uken.</h2><p>Se hele programmet for kommende anledninger.</p><button className={s.solid} type="button" onClick={() => setFilter(0)}>Alle arrangementer →</button></div>}
        </div>
      </>}
    </div>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="event-dialog-title" onClose={() => setDetail(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className={s.close} type="button" onClick={() => dialog.current?.close()}>Lukk <span aria-hidden="true">×</span></button>
      {detail && <div className={s.dialogContent}>{picture(detail)}<div><h2 id="event-dialog-title">{detail.title}</h2>{facts(detail)}{actions(detail)}</div></div>}
    </dialog>
  </section>;
}
