/* Bli medlem: the whole page is one cream sheet, tooled in gold like a book cover, with a
   quarter-medallion in each corner. On it the title, the words, the green button to the StyreWeb
   innmelding form, the rules for children, the Brønnøysund check and «Viktig». */
import type { ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';
import { MEMBERSHIP_SIGNUP_URL } from '@/lib/constants';
import m from './medlem.module.css';

const BRREG = 'https://person.brreg.no/nb/minside';

const INTRO = [
  'Ønsker du å bli medlem i Center Rahma? Du kan enkelt melde deg inn via innmeldingsskjemaet vårt.',
  'Som medlem støtter du arbeidet vårt og bidrar til vårt religiøse tilbud, aktiviteter og fellesskap.',
];

const BARN = [
  { label: 'Barn under 15 år', body: 'Meldes inn av den eller de som har foreldreansvaret. Barnet skal også få medvirke ut fra alder og modenhet.' },
  { label: 'Fra fylte 15 år', body: 'Barnet bestemmer selv og må selv melde seg inn.' },
];

const GREEN = '#0b5f45';
const GOLDLINE = '#8d6a2c';

const n2 = (v: number) => +v.toFixed(2);
/** The point at radius r and angle deg, measured clockwise from straight up. */
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [n2(cx + r * Math.cos(a)), n2(cy + r * Math.sin(a))];
};

const starN = (cx: number, cy: number, r: number, n: number, k: number, rot = 0) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const [x, y] = polar(cx, cy, i % 2 ? r * k : r, rot + (i * 180) / n);
    d += (i ? 'L' : 'M') + x + ',' + y;
  }
  return d + 'Z';
};

/** A disc with n round lobes on its rim. */
const lobed = (cx: number, cy: number, r: number, n: number, depth: number) => {
  const rr = r - depth;
  const bulge = n2((2 * rr * Math.sin(Math.PI / n)) / 1.8);
  let d = '';
  for (let i = 0; i < n; i++) {
    const [x0, y0] = polar(cx, cy, rr, (i * 360) / n);
    const [x1, y1] = polar(cx, cy, rr, ((i + 1) * 360) / n);
    d += (i ? '' : `M${x0},${y0}`) + `A${bulge},${bulge} 0 0 1 ${x1},${y1}`;
  }
  return d + 'Z';
};

/** A lancet-shaped ray from r0 to r1 at angle a, w degrees wide at its base. */
const ray = (r0: number, r1: number, a: number, w: number) => {
  const [x0, y0] = polar(0, 0, r0, a - w);
  const [x1, y1] = polar(0, 0, r0, a + w);
  const [cx0, cy0] = polar(0, 0, (r0 + r1) / 2, a - w * 0.9);
  const [cx1, cy1] = polar(0, 0, (r0 + r1) / 2, a + w * 0.9);
  const [tx, ty] = polar(0, 0, r1, a);
  return `M${x0},${y0} Q${cx0},${cy0} ${tx},${ty} Q${cx1},${cy1} ${x1},${y1} Z`;
};

/** The corner piece: a quarter of a sunburst medallion centred on the corner, turned into place by CSS. */
function Corner({ className }: { className: string }) {
  const r = 78;
  const rays: ReactNode[] = [];
  for (let i = 8; i <= 16; i++) {
    const a = (i * 360) / 32;
    const long = i % 2 === 0;
    rays.push(
      <g key={i}>
        <path d={ray(r * 0.95, long ? r * 1.4 : r * 1.22, a, long ? 4.2 : 3.2)} fill={long ? GREEN : 'url(#bm-gold)'} stroke={long ? '#d6af60' : GOLDLINE} strokeWidth={0.8} />
        {long && <path d={`M${polar(0, 0, r, a).join(',')} L${polar(0, 0, r * 1.32, a).join(',')}`} stroke="#e9c875" strokeWidth={0.7} />}
        {long && <circle cx={polar(0, 0, r * 1.45, a)[0]} cy={polar(0, 0, r * 1.45, a)[1]} r={1.1} fill="#c9a35b" />}
      </g>,
    );
  }
  return (
    <svg className={`${m.corner} ${className}`} viewBox="0 0 150 150" aria-hidden>
      {rays}
      <path d={lobed(0, 0, r, 24, r * 0.04)} fill="url(#bm-gold)" stroke={GOLDLINE} strokeWidth={1} />
      <circle r={r * 0.9} fill={GREEN} stroke="#f1d892" strokeWidth={1} />
      {Array.from({ length: 7 }, (_, i) => {
        const [x, y] = polar(0, 0, r * 0.845, 90 + i * 15);
        return i % 2 ? <circle key={i} cx={x} cy={y} r={0.9} fill="#e9c875" /> : <path key={i} d={starN(x, y, 2.5, 8, 0.6)} fill="#e9c875" />;
      })}
      <circle r={r * 0.79} fill="#fffaf0" stroke="#e9c875" strokeWidth={1.4} />
      <path d={starN(0, 0, 48, 8, 0.7)} fill="url(#bm-gold)" stroke={GOLDLINE} strokeWidth={0.8} />
      <path d={starN(0, 0, 30, 8, 0.7, 22.5)} fill={GREEN} />
    </svg>
  );
}

/** A tooled rule: dotted gold lines either side of a small gold lozenge. */
const Tool = () => (
  <svg className={m.tool} viewBox="0 0 300 20" aria-hidden>
    <path d="M0,10 H128 M172,10 H300" stroke="#c9a35b" strokeWidth={1} strokeDasharray="1 3" />
    <path d="M132,10 L150,2 L168,10 L150,18 Z" fill="url(#bm-gold)" stroke={GOLDLINE} strokeWidth={0.6} />
    <circle cx={150} cy={10} r={2.6} fill={GREEN} />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Medlem() {
  return (
    <main className={m.page}>
      {/* the gold the corner pieces and rules share */}
      <svg width={0} height={0} className={m.defs} aria-hidden>
        <defs>
          <linearGradient id="bm-gold" x1={0} y1={0} x2={0.5} y2={1}>
            <stop offset={0} stopColor="#f6e2a8" />
            <stop offset={0.5} stopColor="#d6af60" />
            <stop offset={1} stopColor="#a8803a" />
          </linearGradient>
        </defs>
      </svg>

      <article className={m.sheet}>
        <Corner className={m.tl} />
        <Corner className={m.tr} />
        <Corner className={m.bl} />
        <Corner className={m.br} />

        <header className={m.head}>
          {/* a non-breaking space keeps «i Center Rahma» together */}
          <h1>Bli medlem i&nbsp;Center Rahma</h1>
          {INTRO.map((p) => <p key={p} className={m.lede}>{p}</p>)}
          <a className={`${f.btn} ${f.primary} ${m.cta}`} href={MEMBERSHIP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            Innmeldingsskjema <Arrow />
          </a>
        </header>

        <Tool />

        <section aria-labelledby="barn">
          <h2 id="barn" className={m.h2}>Medlemskap for barn</h2>
          {BARN.map((b) => (
            <p key={b.label} className={m.row}>
              <b>{b.label}:</b> {b.body}
            </p>
          ))}
        </section>

        <Tool />

        <section aria-labelledby="annet">
          <h2 id="annet" className={m.h2}>Allerede registrert i et annet trossamfunn?</h2>
          <p className={m.body}>
            {/* a sentence a line on wide screens */}
            <span>Dobbeltregistrerte medlemmer gir ikke grunnlag for statstilskudd.</span>{' '}
            <span>Sjekk derfor hvor du er registrert og meld deg ut av andre tros- eller livssynssamfunn før du melder deg inn hos oss.</span>
          </p>
          <p className={m.center}>
            <a className={m.link} href={BRREG} target="_blank" rel="noopener noreferrer">Sjekk hvor du er registrert hos Brønnøysundregistrene</a>
          </p>
        </section>

        <p className={m.viktig}>
          <b>Viktig:</b> Innmelding skal være frivillig og basert på aktivt og informert samtykke. Det er alltid mulig å melde seg ut.
        </p>
      </article>
    </main>
  );
}
