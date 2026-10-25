'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import type { PublicEvent } from '@/lib/arrangementer';
import { ForsideKalender } from '@/components/arrangementer/Kalender';
import { GIFT, MONTHLY } from '@/components/sider/stott/gaver';
import KontaktBrev from '../KontaktBrev';
import { GROUPS, LEAD } from '../grupper';
import { ADDRESS, FACEBOOK, MAPS, YEAR_PDF } from '../links';
import { MapSand, Recess } from './Gips';
import { Reveal, r } from './Reveal';
import { useFriday } from './useFredag';
import s from './seksjoner.module.css';

/* The front page under the hero, on wide screens (phones get mobil/ForsideMobil). Beige tadelakt with
   things carved into it, and one band of the hero's green:
   Vårt fellesskap — one screen: the three groups to choose between, and one carved arch whose photo
     scrolls or swipes between them;
   Arrangementer — this week and next carved as days, with a large photo and invitation for the selected event;
   Støtt moskeen — a compact carved giving counter with a single-gift/monthly switch;
   Besøk og kontakt oss — one screen: the address and the Friday prayer in two small boxes over the map,
     beside the letter. */

function Fellesskap() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  // the group a tab click is scrolling to; scroll events on the way there must not move the selection
  const target = useRef<number | null>(null);
  const go = (i: number) => {
    const el = track.current;
    const n = (i + GROUPS.length) % GROUPS.length;
    setActive(n);
    if (!el) return;
    target.current = n === Math.round(el.scrollLeft / el.clientWidth) ? null : n;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };
  // swiping or scrolling the arch picks the group that comes to rest in it
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (target.current !== null) {
      if (i === target.current) target.current = null;
      return;
    }
    if (i !== active) setActive(i);
  };
  const release = () => { target.current = null; };
  return (
    <Reveal className={s.sec} id="fellesskapet" aria-labelledby="v-fs">
      <div className={`${s.wrap} ${s.fs}`}>
        <div className={s.fsText}>
          <h2 id="v-fs" className={s.h2} {...r(0)}>Vårt fellesskap</h2>
          <p className={s.lead} {...r(1)}>{LEAD}</p>
          <div className={s.tabs} role="tablist" aria-label="Velg gruppe" {...r(2)}>
            {GROUPS.map((g, i) => (
              <button key={g.key} type="button" role="tab" id={`v-tab-${g.key}`} aria-selected={active === i} aria-controls={`v-panel-${g.key}`} className={s.tab} onClick={() => go(i)}>
                {g.title}
              </button>
            ))}
          </div>
          {/* all three texts share one cell, so the height never jumps; only the chosen one shows */}
          <div className={s.panels} {...r(3)}>
            {GROUPS.map((g, i) => (
              <div key={g.key} id={`v-panel-${g.key}`} role="tabpanel" aria-labelledby={`v-tab-${g.key}`} className={s.panel} data-on={active === i ? '' : undefined} aria-hidden={active !== i}>
                <p className={s.meta}>{g.meta}</p>
                <p className={s.body}>{g.text}</p>
                <ul className={s.points}>{g.points.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}</ul>
                {g.href && <Link className={`${s.btn} ${s.btnGreen} ${s.more}`} href={g.href} tabIndex={active === i ? 0 : -1}>{g.more}<span aria-hidden="true">↗</span></Link>}
              </div>
            ))}
          </div>
        </div>
        <div className={s.fsArch} {...r(2)}>
          <Recess className={s.arch}>
            <div className={s.track} ref={track} onScroll={onScroll} onTouchStart={release} onWheel={release} onPointerDown={release}>
              {GROUPS.map((g) => (
                <div key={g.key} className={s.slide}><Image src={g.img} alt={g.alt} fill quality={90} sizes={g.key === 'medlem' ? '(max-width: 900px) 88vw, 40vw' : '(max-width: 900px) 160vw, 90vw'} /></div>
              ))}
            </div>
          </Recess>
          <div className={s.arrows}>
            <button type="button" className={s.arrow} onClick={() => go(active - 1)} aria-label="Forrige gruppe">←</button>
            <span className={s.dots} aria-hidden="true">{GROUPS.map((g, i) => <i key={g.key} data-on={active === i ? '' : undefined} />)}</span>
            <button type="button" className={s.arrow} onClick={() => go(active + 1)} aria-label="Neste gruppe">→</button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Stott() {
  const [monthly, setMonthly] = useState(false);
  const way = monthly ? MONTHLY : GIFT;
  return (
    <Reveal className={`${s.greenField} ${s.give}`} id="stott" aria-labelledby="v-st">
      <div className={`${s.wrap} ${s.giveGrid}`}>
        <div>
          <h2 id="v-st" className={s.h2} {...r(0)}>Støtt moskeen</h2>
          <p className={s.giveIntro} {...r(1)}>Et fellesskap bæres av mange.</p>
          <p className={s.giveNote} {...r(2)}>Gi en gave når det passer deg, eller bli fast giver.</p>
        </div>
        <div className={s.counter} {...r(3)}>
          <div className={s.giftChoice} role="group" aria-label="Hvor ofte vil du gi?">
            <button type="button" aria-pressed={!monthly} onClick={() => setMonthly(false)}>Én gang</button>
            <button type="button" aria-pressed={monthly} onClick={() => setMonthly(true)}>Hver måned</button>
          </div>
          <div className={s.counterBody}>
            <div className={s.counterCopy}>
              <div aria-live="polite" aria-atomic="true">
                <h3>{way.title}</h3>
                <p className={s.counterLine}>{monthly ? 'En fast gave til Rahma.' : way.line}</p>
                <p className={s.counterNumber}>{way.vipps.number}<span>på Vipps</span></p>
              </div>
              <a className={s.counterAction} href={way.vipps.url} target="_blank" rel="noopener noreferrer">{way.action}<span aria-hidden="true">↗</span></a>
            </div>
            <div className={s.counterQr}>
              <Image src={way.vipps.qr} width={180} height={180} unoptimized alt={`QR-kode til Vipps ${way.vipps.number}`} />
              <p>Skann med kameraet</p>
            </div>
          </div>
        </div>
        <nav className={s.giveLinks} aria-label="Flere måter å følge og støtte oss" {...r(4)}>
          <Link href="/stott-oss">Bankoverføring og flere måter å gi ↗</Link>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
          <a href={YEAR_PDF.href} download={YEAR_PDF.filename}>Bønnetider 2026 ↓</a>
        </nav>
      </div>
    </Reveal>
  );
}

function Besok({ jummah }: { jummah: PrayerSchedule['jummah'] }) {
  const fri = useFriday(jummah.khutbah, jummah.prayer);
  return (
    <Reveal className={`${s.sec} ${s.besok}`} id="besok" aria-labelledby="v-bs">
      <div className={s.visitWrap}>
        <div className={s.wrap}>
            <h2 id="v-bs" className={`${s.h2} ${s.h2s}`} {...r(0)}>Besøk og kontakt oss</h2>
        </div>
        <div className={`${s.wrap} ${s.visitMain}`}>
          <div className={s.leftCol}>
            {/* the facts, kept small: two shallow boxes */}
            <div className={s.boxes} {...r(2)}>
              <Recess shape="rect" steps={1} className={s.box}>
                <div className={s.boxIn}>
                  <p className={s.boxBig}>{ADDRESS.street}</p>
                  <p className={s.boxSmall}>{ADDRESS.city} · <a href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse ↗</a></p>
                </div>
              </Recess>
              <Recess shape="rect" steps={1} className={s.box}>
                <div className={s.boxIn}>
                  <p className={s.boxBig}>Khutbah {jummah.khutbah} · bønn {jummah.prayer}</p>
                  <p className={s.boxSmall}>Fredagsbønn {fri.day}. {fri.month}{fri.left && <span> · {fri.left.toLowerCase()}</span>}</p>
                </div>
              </Recess>
            </div>
            <div className={s.mapCol} {...r(3)}><Recess shape="rect" className={s.mapBox}><MapSand /></Recess></div>
          </div>
          <div className={s.letterCol} {...r(4)}>
            <Recess shape="rect" steps={1} className={s.letter}>
              <div className={s.desk} data-paper-surface><KontaktBrev /></div>
            </Recess>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ForsideSeksjoner({ jummah, events, today }: { jummah: PrayerSchedule['jummah']; events: PublicEvent[]; today: string }) {
  return (
    <div className={`${s.page} ${events.length > 0 ? s.withEvents : ''}`}>
      <Fellesskap />
      {events.length > 0 && <ForsideKalender events={events} today={today} />}
      <Stott />
      <Besok jummah={jummah} />
    </div>
  );
}
