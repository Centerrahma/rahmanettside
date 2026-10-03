/* Kontakt oss on phones and tablets: the illuminated page drawn for a narrow screen. The border, headpiece and
   cartouches are CSS and stretchable SVG, so the page grows with its content: the greeting, the
   four ways as an illuminated list, the letter, and Koranen 15:46 in the colophon. */
import type { CSSProperties, ReactNode } from 'react';
import { star, svgUrl } from '../kit';
import { SALAM, VERSES } from '../verses';
import k from './kontakt.module.css';
import LetterForm from './LetterForm';
import { RoundMap, type Way } from './ways';

const cell = (x: number, y: number) => `<path d="${star(x, y, 6, 0.62)}" fill="#e2c27d"/><path d="${star(x, y, 2.4, 0.62)}" fill="#0b5f45"/>`;
/** Green with gold stars round the edge, gold squares with rosettes in the corners, for border-image (slice 18). */
const BORDER = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54"><rect width="54" height="54" fill="#0b5f45"/>${[[27, 9], [45, 27], [27, 45], [9, 27]].map(([x, y]) => cell(x, y)).join('')}${[[9, 9], [45, 9], [9, 45], [45, 45]]
    .map(([x, y]) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="#d6af60" stroke="#9b7329" stroke-width="0.8"/><path d="${star(x, y, 6, 0.62)}" fill="#0b5f45"/>`)
    .join('')}</svg>`,
);
const LATTICE = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="${star(12, 12, 7)}" fill="none" stroke="#e2c27d" stroke-width="0.9" stroke-opacity="0.6"/><path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke="#e2c27d" stroke-width="0.8" stroke-opacity="0.45"/></svg>`,
);

/** A cartouche with pointed ends, stretched to whatever holds it; the strokes keep their width. */
function Cartouche() {
  return (
    <svg className={k.pmCart} viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <path vectorEffect="non-scaling-stroke" d="M40,2 H360 C372,2 382,22 398,50 C382,78 372,98 360,98 H40 C28,98 18,78 2,50 C18,22 28,2 40,2 Z" fill="url(#pm-cream)" stroke="var(--gold)" strokeWidth={1.5} />
      <path vectorEffect="non-scaling-stroke" d="M44,9 H356 C366,9 374,26 388,50 C374,74 366,91 356,91 H44 C34,91 26,74 12,50 C26,26 34,9 44,9 Z" fill="none" stroke="var(--gold-2)" strokeWidth={0.8} />
    </svg>
  );
}

/** A small sunburst medallion (shamsa) holding an icon. */
function Medal({ children }: { children: ReactNode }) {
  let lobes = '';
  const n = 20;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p = (r: number, a: number) => `${(32 + r * Math.cos(a)).toFixed(2)},${(32 + r * Math.sin(a)).toFixed(2)}`;
    lobes += `${i ? 'L' : 'M'}${p(28, a0)} Q${p(33, am)} ${p(28, a1)} `;
  }
  return (
    <span className={k.pmMedal}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d={lobes + 'Z'} fill="url(#pm-gold)" stroke="#9b7329" strokeWidth={0.8} />
        <circle cx={32} cy={32} r={24} fill="#0b5f45" stroke="#9b7329" strokeWidth={0.8} />
        <circle cx={32} cy={32} r={19.5} fill="url(#pm-cream)" stroke="var(--gold)" strokeWidth={0.8} />
      </svg>
      {children}
    </span>
  );
}

/** A gold rule with a star in the middle. */
const Rule = () => (
  <svg className={k.pmRule} viewBox="0 0 300 16" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d="M0,8 H128 M172,8 H300" stroke="var(--gold-2)" strokeWidth={1} />
    <path d={star(150, 8, 7, 0.62)} fill="var(--gold)" />
    <circle cx={134} cy={8} r={2} fill="var(--gold-2)" />
    <circle cx={166} cy={8} r={2} fill="var(--gold-2)" />
  </svg>
);

export default function BrevetMobil({ list }: { list: Way[] }) {
  return (
    <div className={k.pm} style={{ '--border': BORDER, '--lat': LATTICE } as CSSProperties}>
      {/* gradients the small drawings share */}
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="pm-gold" x1={0} y1={0} x2={1} y2={1}>
            <stop offset={0} stopColor="#f3dc9c" />
            <stop offset={0.5} stopColor="#d6af60" />
            <stop offset={1} stopColor="#b98a3c" />
          </linearGradient>
          <linearGradient id="pm-cream" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#fffdf6" />
            <stop offset={1} stopColor="#f8eedb" />
          </linearGradient>
        </defs>
      </svg>

      <div className={k.pmSheet}>
        {/* the headpiece: green and gold, the greeting in a cartouche, a crest on top */}
        <div className={k.pmHead}>
          <svg className={k.pmCrest} viewBox="0 0 80 22" aria-hidden="true">
            <path d="M0,22 C8,12 26,10 40,0 C54,10 72,12 80,22 Z" fill="url(#pm-gold)" stroke="#9b7329" strokeWidth={0.8} />
          </svg>
          <div className={k.pmGreet}>
            <Cartouche />
            <p lang="ar" dir="rtl">{SALAM.ar}</p>
          </div>
        </div>
        <p className={k.pmGloss}>{SALAM.no}</p>

        <h1 className={k.pmTitle}>Kontakt oss</h1>
        <p className={k.pmLede}>Kom innom, eller skriv til oss, så svarer vi så snart vi kan.</p>

        <Rule />
        <ul className={k.pmWays}>
          {list.map((w) => (
            <li key={w.key}>
              <Medal>{w.icon}</Medal>
              <span>
                <small>{w.label}</small>
                <b>{w.body}</b>
                {w.link}
              </span>
            </li>
          ))}
        </ul>
        <Rule />

        <div className={k.pmLetter}>
          <LetterForm />
        </div>

        <div className={k.pmColo}>
          <div className={k.pmGreet}>
            <Cartouche />
            <p lang="ar" dir="rtl">{VERSES.v15_46.ar}</p>
          </div>
          <p className={k.pmGloss}>«{VERSES.v15_46.no}» <cite>{VERSES.v15_46.ref}</cite></p>
        </div>
      </div>

      <div className={k.pmMap}>
        <RoundMap />
      </div>
    </div>
  );
}
