/* Bli medlem: the evening city at the top, the words under it, Koranen 49:10 on a green band, three
   reasons under star medallions and the three steps on a gold thread. Signing up itself happens in
   StyreWeb, the mosque's membership system. */
import type { CSSProperties, ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';
import { MEMBERSHIP_SIGNUP_URL } from '@/lib/constants';
import { star, svgUrl } from '../kit';
import { TRANSLATION, VERSES, shown } from '../verses';
import Byen from './Byen';
import m from './medlem.module.css';

const BRREG = 'https://person.brreg.no/nb/minside';

const INTRO =
  'Ønsker du å bli medlem i Center Rahma? Som medlem støtter du moskeen og fellesskapet vårt. Sammen bygger vi Center Rahma for oss alle.';

const REASONS = [
  {
    title: 'Du støtter moskeen',
    body: 'Tros- og livssynssamfunn får tilskudd fra staten for hvert registrerte medlem. Medlemskapet ditt gir oss den støtten vi trenger.',
  },
  {
    title: 'Du styrker fellesskapet',
    body: 'Jo flere vi er, jo mer kan vi gjøre. Undervisningen, Rahma skole, Ung Rahma og alt det andre vi gjør, får vi til fordi dere støtter oss.',
  },
  {
    title: 'Du hjelper fellesskapet å vokse',
    body: 'Du støtter moskeen, og du hjelper det muslimske fellesskapet i Norge å vokse.',
  },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const STEPS: { title: string; body: ReactNode }[] = [
  {
    title: 'Sjekk om du er medlem et annet sted',
    body: (
      <span>
        Logg inn på <a href={BRREG} target="_blank" rel="noopener noreferrer">Min side hos Brønnøysundregistrene</a> og se om du står oppført i et annet tros- eller livssynssamfunn. Gjør du det, må du melde deg ut der før du kan melde deg inn hos oss.
      </span>
    ),
  },
  {
    title: 'Fyll ut innmeldingen',
    body: (
      <>
        <span>Innmeldingen skjer i StyreWeb, medlemssystemet vårt. Skjemaet åpnes i en ny fane.</span>
        <a className={`${f.btn} ${f.primary}`} href={MEMBERSHIP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
          Gå til innmeldingen <Arrow />
        </a>
      </>
    ),
  },
  {
    title: 'Velkommen som medlem',
    body: <>Når skjemaet er sendt, tar vi imot innmeldingen din. Velkommen til fellesskapet i Center Rahma.</>,
  },
];

/** The gold star lattice behind the verse band. */
const LATTICE = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="${star(12, 12, 7)}" fill="none" stroke="#e2c27d" stroke-width="0.9" stroke-opacity="0.6"/><path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke="#e2c27d" stroke-width="0.8" stroke-opacity="0.45"/></svg>`,
);

const StarBadge = ({ n }: { n: number }) => (
  <span className={m.badge}>
    <svg viewBox="0 0 80 80" aria-hidden>
      <path d={star(40, 40, 38, 0.72)} fill="url(#bm-gold)" stroke="#9b7329" strokeWidth={1} />
      <path d={star(40, 40, 30, 0.72)} fill="#0b5f45" stroke="#f1d892" strokeWidth={1} />
    </svg>
    <b>{n}</b>
  </span>
);

export default function Medlem() {
  const v = VERSES.v49_10;
  return (
    <main className={m.page} style={{ '--lat': LATTICE } as CSSProperties}>
      {/* the gold the star medallions share */}
      <svg width={0} height={0} className={m.defs} aria-hidden>
        <defs>
          <linearGradient id="bm-gold" x1={0} y1={0} x2={1} y2={1}>
            <stop offset={0} stopColor="#f3dc9c" />
            <stop offset={0.5} stopColor="#d6af60" />
            <stop offset={1} stopColor="#b98a3c" />
          </linearGradient>
        </defs>
      </svg>

      <section className={m.hero}>
        <Byen />
        <div className={m.text}>
          <p className={m.lede}>{INTRO}</p>
          <a className={`${f.btn} ${f.primary}`} href="#slik">Slik blir du medlem</a>
        </div>
      </section>

      <section className={m.band}>
        <p className={m.ar} lang="ar" dir="rtl">{shown(v.ar)}</p>
        <p className={m.en}>
          <span lang="en">«{v.en}»</span> <cite>{v.ref}, {TRANSLATION}</cite>
        </p>
      </section>

      <section className={m.reasons} aria-labelledby="hvorfor">
        <h2 id="hvorfor" className={m.h2}>Hvorfor bli medlem</h2>
        <ul>
          {REASONS.map((r, i) => (
            <li key={r.title}>
              <StarBadge n={i + 1} />
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="slik" className={m.steps} aria-labelledby="slik-h">
        <h2 id="slik-h" className={m.h2}>Slik blir du medlem</h2>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <svg className={m.node} viewBox="0 0 48 48" aria-hidden>
                <path d={star(24, 24, 22, 0.72)} fill={i === 2 ? 'url(#bm-gold)' : '#fff'} stroke="var(--gold)" strokeWidth={1.4} />
                <text x={24} y={29.5} textAnchor="middle" fontSize={15} fontWeight={700} fill={i === 2 ? '#fff' : 'var(--emerald-ink)'}>{i + 1}</text>
              </svg>
              <div>
                <h3>{s.title}</h3>
                <div className={m.stepBody}>{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
