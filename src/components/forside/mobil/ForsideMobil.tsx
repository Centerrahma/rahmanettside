'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PrayerSchedule } from '@/types/prayer';
import type { PublicEvent } from '@/lib/arrangementer';
import { MobilKalender } from '@/components/arrangementer/Kalender';
import Konvolutt from '@/components/sider/kontakt/Konvolutt';
import Velger from '@/components/sider/stott/Velger';
import { Recess } from '../gips/Gips';
import { GROUPS } from '../grupper';
import { nextFriday } from '../fredag';
import { ADDRESS, FACEBOOK, MAPS, YEAR_PDF } from '../links';
import Rosett from './Rosett';
import s from './mobil.module.css';

/* The front page under the hero, on phones (desktop keeps Fellesskapet, StottOss and Besok):
   Vårt felleskap — one photo in a square recess carved into beige plaster, the groups open under it one at a time;
   Arrangementer — a carved calendar and event picker, with a large attachment and invitation;
   Støtt moskeen — a green tadelakt plate between double gold rules, with the Vipps switch card;
   Besøk og kontakt oss — on cream plaster under a row of arches: the Friday prayer, then the Kontakt envelope.
   Each heading has a rosette over it. Reveals play once, as each part scrolls into view. */

const Arrow = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>);

function Head({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <header className={s.head} data-reveal>
      <Rosett />
      <h2 id={id}>{title}</h2>
      <p>{lead}</p>
    </header>
  );
}

function Grupper() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <div className={s.stage} data-reveal>
        <Recess shape="rect" className={s.carved}>
          {GROUPS.map((g, i) => (
            <span key={g.key} className={`${s.shot} ${open === i ? s.on : ''}`}>
              <Image src={g.img} alt={open === i ? g.alt : ''} fill quality={90} sizes={g.key === 'medlem' ? '(max-width: 480px) 82vw, 400px' : '(max-width: 480px) 160vw, 800px'} />
            </span>
          ))}
        </Recess>
      </div>
      <div className={s.acc}>
        {GROUPS.map((g, i) => {
          const isOpen = open === i;
          return (
            <div key={g.key} className={`${s.item} ${isOpen ? s.open : ''}`}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={`fm-p${i}`} onClick={() => setOpen(i)}>
                  <span><b>{g.title}</b><small>{g.meta}</small></span>
                  <i aria-hidden="true" />
                </button>
              </h3>
              <div className={s.panel} id={`fm-p${i}`} role="region" aria-label={g.title} hidden={!isOpen}>
                <p>{g.text}</p>
                <ul>{g.points.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}</ul>
                {g.href && <Link className={s.creamBtn} href={g.href}>{g.more}</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function ForsideMobil({ jummah, events, today }: { jummah: PrayerSchedule['jummah']; events: PublicEvent[]; today: string }) {
  const fri = nextFriday();
  const root = useRef<HTMLDivElement>(null);
  // mark each [data-reveal] the first time it scrolls into view; without script nothing is hidden
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.setAttribute('data-js', '');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-in', '');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    el.querySelectorAll('[data-reveal]').forEach((x) => io.observe(x));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${s.root} ${events.length > 0 ? s.withEvents : ''}`} ref={root}>
      <section className={s.green} aria-labelledby="fm-fs">
        <Head id="fm-fs" title="Vårt felleskap" lead="Her lærer barn Koranen og arabisk, unge samles til sport og turer, og familier møtes." />
        <Grupper />
      </section>

      {events.length > 0 && (
        <section className={s.events} aria-labelledby="fm-ar">
          <Head id="fm-ar" title="Arrangementer" lead="Velg en dag for å se hva som skjer." />
          <MobilKalender events={events} today={today} />
          <Link className={`${s.creamBtn} ${s.allBtn}`} href="/arrangementer" data-reveal>Alle arrangementer</Link>
        </section>
      )}

      <section className={s.plate} aria-labelledby="fm-st">
        <Head id="fm-st" title="Støtt moskeen" lead="Et fellesskap bæres av mange." />
        <div className={s.give} data-reveal><Velger /></div>
        <nav className={s.rows} aria-label="Mer fra moskeen" data-reveal>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"><span><b>Følg oss på Facebook</b><small>Nyheter, arrangementer og beskjeder kommer først på Facebook.</small></span><Arrow /></a>
          <a href={YEAR_PDF.href} download={YEAR_PDF.filename}><span><b>Bønnetider for hele 2026</b><small>Last ned som PDF</small></span><Arrow /></a>
          <Link href="/stott-oss"><span><b>Bankoverføring og fast gave</b><small>Flere måter å gi</small></span><Arrow /></Link>
        </nav>
      </section>

      <div className={s.cream} data-paper-surface>
        <section className={s.visit} aria-labelledby="fm-bs">
          <Head id="fm-bs" title="Besøk og kontakt oss" lead="Kom innom moskeen, eller skriv et brev til oss her." />
          <div className={s.notice} data-reveal>
            <p className={s.nTitle}>Fredagsbønn{fri ? ` ${fri.day}. ${fri.month}` : ''}</p>
            <dl>
              <div><dt>Khutbah</dt><dd>{jummah.khutbah}</dd></div>
              <div><dt>Bønn</dt><dd>{jummah.prayer}</dd></div>
            </dl>
            <a className={s.outline} href={MAPS.directions} target="_blank" rel="noopener noreferrer">{ADDRESS.street} · Veibeskrivelse<Arrow /></a>
          </div>
          <div className={s.env}><Konvolutt inPage /></div>
        </section>
      </div>
    </div>
  );
}
