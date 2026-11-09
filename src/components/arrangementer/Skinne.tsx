'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { noonUtc, osloDay } from '@/lib/kalender';
import { dayNum, longDay, time, until } from './format';
import s from './skinne.module.css';

const month = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', month: 'short' });
const weekday = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', weekday: 'long' });

const Arrow = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>);

/** A removed, private or broken attachment falls back to the date on green. */
function Card({ event, day, today }: { event: PublicEvent; day: string; today: string }) {
  const [broken, setBroken] = useState(false);
  const image = broken ? null : event.image;
  return (
    <li className={s.item}>
      <Link href="/arrangementer" className={s.card} aria-label={`${event.title}, ${longDay(day)} kl. ${time(event)}`}>
        <span className={`${s.picture} ${image ? '' : s.noPicture}`}>
          {image ? (
            // Bypass the optimiser so withdrawn attachments are not cached separately.
            <Image src={image} alt="" fill unoptimized sizes="264px" onError={() => setBroken(true)} />
          ) : (
            <span className={s.bigDay} aria-hidden="true"><b>{dayNum(day)}</b>{month.format(noonUtc(day))}</span>
          )}
          <span className={s.badge} aria-hidden="true"><b>{dayNum(day)}</b>{month.format(noonUtc(day)).replace('.', '')}</span>
        </span>
        <span className={s.copy}>
          <span className={s.when}>{until(day, today)} · {weekday.format(noonUtc(day))}</span>
          <span className={s.title}>{event.title}</span>
          <span className={s.facts}>kl. {time(event)}{event.location ? ` · ${event.location}` : ''}</span>
        </span>
      </Link>
    </li>
  );
}

/** Phones: the coming events as one row of cards that scrolls sideways. The next card always pokes in
    from the right, a counter and a "Sveip" cue say there is more, a thin bar shows how far along you are,
    and the row ends in a card that leads to all of them. It nudges sideways once when it first comes
    into view. */
export function ArrangementSkinne({ events, today }: { events: PublicEvent[]; today: string }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const upcoming = events.map((event) => ({ event, day: osloDay(event.start) })).filter(({ day }) => day >= today);

  const onScroll = () => {
    const el = scroller.current;
    const rt = root.current;
    if (!el || !rt || !thumb.current) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    const w = Math.min(1, el.clientWidth / el.scrollWidth);
    thumb.current.style.width = `${w * 100}%`;
    thumb.current.style.transform = `translateX(${(1 / w - 1) * p * 100}%)`;
    if (el.scrollLeft > 8) rt.setAttribute('data-moved', '');
    if (max - el.scrollLeft < 8) rt.setAttribute('data-end', ''); else rt.removeAttribute('data-end');
  };

  // the one-time nudge, when the row is first mostly in view
  useEffect(() => {
    const rt = root.current;
    if (!rt) return;
    onScroll();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      if (!rt.hasAttribute('data-moved')) rt.setAttribute('data-nudge', '');
      io.disconnect();
    }, { threshold: 0.6 });
    io.observe(rt);
    return () => io.disconnect();
  }, []);

  if (upcoming.length === 0) return null;
  return (
    <div className={s.root} ref={root} data-reveal>
      <div className={s.meta}>
        <span>{upcoming.length === 1 ? '1 arrangement' : `${upcoming.length} arrangementer`}</span>
        {upcoming.length > 1 && <span className={s.hint} aria-hidden="true">Sveip <Arrow /></span>}
      </div>
      <div className={s.frame}>
        <div className={s.scroller} ref={scroller} onScroll={onScroll} role="region" aria-label="Arrangementer. Sveip sideveis for å se flere." tabIndex={0}>
          <ul className={s.list}>
            {upcoming.map(({ event, day }) => <Card key={event.id} event={event} day={day} today={today} />)}
            <li className={`${s.item} ${s.last}`}>
              <Link href="/arrangementer" className={s.all}>Se alle<br />arrangementer<Arrow /></Link>
            </li>
          </ul>
        </div>
        <span className={s.fade} aria-hidden="true" />
      </div>
      {upcoming.length > 1 && <span className={s.bar} aria-hidden="true"><span ref={thumb} /></span>}
    </div>
  );
}
