'use client';

import { useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import f from './forside.module.css';
import s from './fellesskapet.module.css';

/* Fellesskapet: Ung Rahma, Rahma skole and Bli medlem in one stage shaped like the mihrab's arch.
   The points are the mosque's own words from each group's page. */

const GROUPS = [
  {
    key: 'ung', href: '/ung-rahma', img: '/UngRahma.jpeg', alt: 'Barn og unge samlet i en idrettshall',
    title: 'Ung Rahma', meta: '13 til 25 år', more: 'Les om Ung Rahma',
    text: 'Et ungdomsprogram som styrker neste generasjon gjennom tro, læring og lederskap.',
    points: [
      ['Aktiviteter', 'Sport, utflukter og sosiale arrangementer som bygger vennskap.'],
      ['Læring', 'Islamske studier, Koranen og personlig utvikling i et trygt miljø.'],
      ['Mentorordning', 'Erfarne mentorer som hjelper deg å vokse som person og muslim.'],
    ],
  },
  {
    key: 'skole', href: '/rahma-skole', img: '/Rahmaskole.jpeg', alt: 'Elever i et klasserom ser på en skjerm med arabiske bokstaver',
    title: 'Rahma skole', meta: 'Barn og unge', more: 'Les om Rahma skole',
    text: 'Strukturert undervisning for barn og unge, med kvalifiserte lærere i et trygt miljø.',
    points: [
      ['Koranundervisning', 'Tajwid og memorering under veiledning av kvalifiserte lærere.'],
      ['Arabisk språk', 'Fra grunnivå til avansert, med vekt på forståelse.'],
      ['Islamske studier', 'Fiqh, aqidah og seerah, tilpasset alderen.'],
    ],
  },
  {
    key: 'medlem', href: '/blimedlem', img: '/BliMedlem_bue.jpg', alt: 'Barn som spiser sammen i bønnesalen',
    title: 'Bli medlem', meta: 'For hele familien', more: 'Meld deg inn',
    text: 'Jo flere vi er, jo mer kan vi gjøre. Undervisningen, Rahma skole og Ung Rahma får vi til fordi dere støtter oss.',
    points: [
      ['Du støtter moskeen', 'Staten gir tilskudd for hvert registrerte medlem.'],
      ['Du styrker fellesskapet', 'Hvert medlem gjør mer mulig for barn, unge og familier.'],
      ['Du hjelper fellesskapet å vokse', 'Det muslimske fellesskapet i Norge vokser med deg.'],
    ],
  },
];

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={s.star}>
    <path d="M12,2 L14.6,7.4 L20.5,6.3 L18.2,11.9 L22,16.5 L16.1,17.1 L14.5,22.9 L12,17.6 L9.5,22.9 L7.9,17.1 L2,16.5 L5.8,11.9 L3.5,6.3 L9.4,7.4 Z" />
  </svg>
);

export default function Fellesskapet() {
  const [active, setActive] = useState(0);
  const g = GROUPS[active];
  // arrow keys move between the names, as in any tab list
  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + GROUPS.length) % GROUPS.length;
    setActive(next);
    document.getElementById(`fs-t${next}`)?.focus();
  };

  return (
    <section className={s.sec} id="fellesskapet" aria-labelledby="fs-h2">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2 id="fs-h2">Fellesskapet</h2>
          <p className={s.lead}>Her lærer barn Koranen og arabisk, unge samles til sport og turer, og familier møtes.</p>
        </div>
        <div className={s.grid}>
          <div className={s.arch}>
            <div className={s.stage}>
              {GROUPS.map((x, i) => (
                <span key={x.key} className={`${s.img} ${active === i ? s.on : ''}`} aria-hidden={active !== i}>
                  <Image src={x.img} alt={active === i ? x.alt : ''} fill sizes="(max-width: 860px) 100vw, 45vw" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className={s.tabs} role="tablist" aria-label="Fellesskapet" onKeyDown={onKeyDown}>
              {GROUPS.map((x, i) => (
                <button
                  key={x.key}
                  id={`fs-t${i}`}
                  role="tab"
                  type="button"
                  aria-selected={active === i}
                  aria-controls="fs-panel"
                  tabIndex={active === i ? 0 : -1}
                  className={active === i ? s.on : ''}
                  onClick={() => setActive(i)}
                >
                  <span>{x.title}</span>
                  <small>{x.meta}</small>
                </button>
              ))}
            </div>
            <div className={s.panel} id="fs-panel" role="tabpanel" aria-labelledby={`fs-t${active}`} key={g.key}>
              <p className={s.text}>{g.text}</p>
              <ul className={s.points}>
                {g.points.map(([t, d]) => (
                  <li key={t}><Star /><span><b>{t}</b>{d}</span></li>
                ))}
              </ul>
              <Link className={`${f.btn} ${f.primary}`} href={g.href}>{g.more}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
