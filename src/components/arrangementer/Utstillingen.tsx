'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { PublicEvent } from '@/lib/arrangementer';
import { osloDay } from '@/lib/kalender';
import { Recess } from '@/components/forside/gips/Gips';
import { dayNum, longDay, time, until } from './format';
import s from './utstillingen.module.css';

/* /arrangementer: one event at a time, on one screen. Its picture stands in a tall arch cut deep into
   the plaster, what, when and where beside it, and the coming events in a short list to choose from or
   step through. An event without a picture shows the green plaster with its day cut into it.
   `today` comes from the server, so server and browser agree on it. */

export default function Utstillingen({ events, today }: { events: PublicEvent[]; today: string }) {
  const [i, setI] = useState(0);
  // pictures that failed to load; their events fall back to the green plaster
  const [broken, setBroken] = useState<ReadonlySet<string>>(() => new Set());
  const list = useRef<HTMLOListElement>(null);
  // keep the chosen row in view when the arrows step past the list's edge; only the list scrolls,
  // never the page (the list is a column on wide screens and a row on phones)
  useEffect(() => {
    const el = list.current;
    const row = el?.children[i] as HTMLElement | undefined;
    if (!el || !row) return;
    if (row.offsetTop < el.scrollTop) el.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = row.offsetTop + row.offsetHeight - el.clientHeight;
    if (row.offsetLeft < el.scrollLeft) el.scrollLeft = row.offsetLeft;
    else if (row.offsetLeft + row.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollLeft = row.offsetLeft + row.offsetWidth - el.clientWidth;
  }, [i]);

  if (events.length === 0) {
    return (
      <section className={s.screen} aria-labelledby="ar-h1">
        <div className={s.wrap}>
          <div className={s.grid}>
            <div className={s.archCol}>
              <Recess shape="arch" steps={3} className={s.arch}><span className={s.green} /></Recess>
            </div>
            <div className={s.text}>
              <h1 id="ar-h1" className={s.h1}>Arrangementer</h1>
              <div className={s.now}>
                <p className={s.title}>Ingen kommende arrangementer akkurat nå.</p>
                <p className={s.empty}>Følg med her eller på Facebook.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const e = events[Math.min(i, events.length - 1)];
  const d = osloDay(e.start);
  return (
    <section className={s.screen} aria-labelledby="ar-h1">
      <div className={s.wrap}>
        <div className={s.grid}>
          <div className={s.archCol}>
            <Recess shape="arch" steps={3} className={s.arch}>
              <div className={s.pic} key={e.id}>
                {e.image && !broken.has(e.id) ? (
                  // served as is from our own route, which stops serving it once the event is no longer Public;
                  // the image optimiser would keep its own copy for hours
                  <Image src={e.image} alt={`Bilde til ${e.title}`} fill unoptimized sizes="(max-width: 900px) 92vw, 520px"
                    onError={() => setBroken((b) => new Set(b).add(e.id))} />
                ) : (
                  <span className={s.green}><b className={s.gNum}>{dayNum(d)}</b></span>
                )}
              </div>
            </Recess>
          </div>
          <div className={s.text}>
            <h1 id="ar-h1" className={s.h1}>Arrangementer</h1>
            <div className={s.now} key={e.id} aria-live="polite">
              <p className={s.when}>{longDay(d)} · {until(d, today)}</p>
              <h2 className={s.title}>{e.title}</h2>
              <dl className={s.facts}>
                <div><dt>Tid</dt><dd>kl. {time(e)}</dd></div>
                {e.location && <div><dt>Sted</dt><dd>{e.location}</dd></div>}
              </dl>
            </div>
            {events.length > 1 && (
              <div className={s.next}>
                <div className={s.nextHead}>
                  <h2>Fremover</h2>
                  <div className={s.arrows}>
                    <button type="button" className={s.arrow} onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Forrige arrangement">←</button>
                    <button type="button" className={s.arrow} onClick={() => setI(i + 1)} disabled={i === events.length - 1} aria-label="Neste arrangement">→</button>
                  </div>
                </div>
                <ol className={s.list} ref={list}>
                  {events.map((x, k) => (
                    <li key={x.id}>
                      <button type="button" aria-current={k === i} onClick={() => setI(k)} aria-label={`${x.title}, ${longDay(osloDay(x.start))}`}>
                        <span className={s.n}>{dayNum(osloDay(x.start))}</span>
                        <span className={s.t}>{x.title}</span>
                        <span className={s.k}>{time(x).split('–')[0]}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
