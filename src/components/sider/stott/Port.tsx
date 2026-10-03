/* Støtt oss on phones and tablets: the evening sky with the dome and minaret tops, and one elastic
   portal whose verse band and lit iwan grow with what is in them. The tile border and the lattice are
   CSS backgrounds made from the same star as the drawings, so the portal can be any height. */
import { useId, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BankIcon, HeartIcon } from '../icons';
import { BANK_ACCOUNT, EMAIL, ORG_NR, VIPPS } from '@/components/forside/links';
import f from '@/components/forside/forside.module.css';
import { arch, crescent, delay, muqarnas, onion, onionRibs, pen, seeded, star, svgUrl, windows } from '../kit';
import { shown, type Verse } from '../verses';
import m from './mobil.module.css';

const tile = (x: number, y: number, i: number) =>
  `<path d="${star(x, y, 6.2, 0.72)}" fill="${i % 2 ? '#e8f4ee' : '#f6e7c4'}" stroke="${i % 2 ? '#0b6a4c' : '#ad8236'}" stroke-width="0.7"/>`;
/** A 48 × 48 square of stone with star tiles round its edge, for border-image. */
const TILES = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="#f7eedb"/>${[[8, 8], [24, 8], [40, 8], [40, 24], [40, 40], [24, 40], [8, 40], [8, 24]].map(([x, y], i) => tile(x, y, i)).join('')}</svg>`,
);
const LATTICE = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="${star(12, 12, 7)}" fill="none" stroke="#ad8236" stroke-width="0.8" stroke-opacity="0.55"/><path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke="#ad8236" stroke-width="0.8" stroke-opacity="0.4"/></svg>`,
);
export const PATTERNS = { '--tiles': TILES, '--lat': LATTICE } as CSSProperties;

/** The top of the scene: evening sky, the melon dome, the minaret tops; the heading sits in the sky. */
export function Crown({ children }: { children: ReactNode }) {
  const { out, line, add } = pen();
  const rnd = seeded(4);
  const stars: ReactNode[] = [];
  for (let i = 0; i < 38; i++) stars.push(<circle key={i} cx={(rnd() * 400).toFixed(1)} cy={(rnd() * 170).toFixed(1)} r={(0.5 + rnd()).toFixed(2)} fill="#fff" opacity={(0.3 + rnd() * 0.5).toFixed(2)} />);
  add(<g className={f.fade} style={delay(0.3)}>{stars}</g>);
  add(<circle cx={200} cy={250} r={150} fill="url(#mc-sun)" className={f.fade} style={delay(0.2)} />);
  // the dome behind the great portal
  line('M162,300 V236 H238 V300', { fill: 'url(#mc-stone)', w: 1.2, t: 0.1 });
  line(windows(168, 232, 5, 262, 20, 7), { fill: 'url(#mc-lit)', w: 0.9, t: 0.4 });
  line(onion(200, 236, 84, 62), { fill: 'url(#mc-dome)', w: 1.5, t: 0.15 });
  line(onionRibs(200, 236, 84, 62, 10), { w: 0.7, op: 0.5, t: 0.35 });
  line('M156,236 H244', { stroke: 'var(--gold)', w: 1.1, t: 0.4 });
  line('M200,174 V164', { w: 1, t: 0.5 });
  line(crescent(200, 160, 4.5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 0.8, t: 0.55 });
  // the minaret tops; their shafts run on down beside the portal (CSS)
  [22, 378].forEach((x) => {
    line(`M${x - 10},300 V170 H${x + 10} V300`, { fill: 'url(#mc-shaft)', w: 1.1, t: 0.1 });
    line(`M${x - 10},182 L${x - 16},174 V168 H${x + 16} V174 L${x + 10},182`, { fill: 'url(#mc-stone)', w: 1, t: 0.4 });
    line(`M${x - 16},168 V160 H${x + 16} V168 M${x - 8},160 V168 M${x},160 V168 M${x + 8},160 V168`, { w: 0.8, t: 0.5 });
    line(`M${x - 7},160 V136 H${x + 7} V160`, { fill: 'url(#mc-stone)', w: 1, t: 0.5 });
    line(arch(x - 3, x + 3, 147, 142, 154, true), { fill: 'url(#mc-lit)', w: 0.7, t: 0.6 });
    line(onion(x, 136, 20, 24), { fill: 'url(#mc-dome)', w: 1, t: 0.6 });
    line(`M${x},112 V104`, { w: 0.9, t: 0.7 });
    line(crescent(x, 100, 3), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 0.7, t: 0.75 });
  });
  // turrets on the portal's corners
  [44, 356].forEach((x) => {
    line(`M${x - 6},300 V276 H${x + 6} V300`, { fill: 'url(#mc-stone)', w: 1, t: 0.4 });
    line(onion(x, 276, 14, 18), { fill: 'url(#mc-dome)', w: 0.9, t: 0.5 });
    line(`M${x},258 V252`, { w: 0.8, t: 0.6 });
  });
  return (
    <div className={m.crown}>
      <svg viewBox="0 0 400 300" aria-hidden="true">
        <defs>
          <radialGradient id="mc-sun" cx={0.5} cy={0.5} r={0.5}>
            <stop offset={0} stopColor="#ffd59a" stopOpacity={0.55} />
            <stop offset={1} stopColor="#f6a77a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="mc-stone" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#fdf6ea" />
            <stop offset={1} stopColor="#ead6b4" />
          </linearGradient>
          <linearGradient id="mc-shaft" x1={0} y1={0} x2={1} y2={0}>
            <stop offset={0} stopColor="#e6d6b8" />
            <stop offset={0.45} stopColor="#fdf9f0" />
            <stop offset={1} stopColor="#dcc7a2" />
          </linearGradient>
          <linearGradient id="mc-dome" x1={0} y1={0} x2={1} y2={0}>
            <stop offset={0} stopColor="#b9d4c9" />
            <stop offset={0.4} stopColor="#eaf5f0" />
            <stop offset={1} stopColor="#a3c4b6" />
          </linearGradient>
          <linearGradient id="mc-lit" x1={0} y1={0} x2={0} y2={1}>
            <stop offset={0} stopColor="#fff5dc" />
            <stop offset={1} stopColor="#f6d090" />
          </linearGradient>
        </defs>
        {out}
      </svg>
      <div className={m.intro}>{children}</div>
    </div>
  );
}

/** The arch at the top of the iwan: lattice spandrels, a deep reveal and a muqarnas hood.
    Below it the room continues in CSS, so the arch is drawn down to its springing only. */
function Hood({ rows = 3 }: { rows?: number }) {
  const id = useId().replace(/:/g, '');
  const outer = arch(28, 272, 150, 10, 150, true);
  const inner = arch(46, 254, 150, 34, 150, true);
  return (
    <svg className={m.hood} viewBox="0 0 300 150" aria-hidden="true">
      <defs>
        <clipPath id={`h-${id}`}><path d={inner} /></clipPath>
        <linearGradient id={`r-${id}`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#d6bd8c" />
          <stop offset={0.5} stopColor="#eddcb9" />
          <stop offset={1} stopColor="#cfb47f" />
        </linearGradient>
      </defs>
      <path d={`${outer} ${inner}`} fill={`url(#r-${id})`} fillRule="evenodd" />
      <g clipPath={`url(#h-${id})`}>
        <rect x={46} y={0} width={208} height={150} fill="#fff5dc" />
        {muqarnas(46, 254, 34, 146, rows, ['#f7ecd3', '#e2cc9f'])}
      </g>
      <path d={outer} fill="none" stroke="var(--emerald)" strokeWidth={1.6} pathLength={1} className={f.draw} style={delay(0.3)} />
      <path d={inner} fill="none" stroke="var(--gold-2)" strokeWidth={1} pathLength={1} className={f.draw} style={delay(0.4)} />
      <path d={arch(37, 263, 150, 22, 150)} fill="none" stroke="var(--gold-2)" strokeWidth={0.7} strokeOpacity={0.7} pathLength={1} className={f.draw} style={delay(0.5)} />
    </svg>
  );
}

/** The band of a portal: the complete verse in Arabic, its translation under it. */
export function Band({ v }: { v: Verse }) {
  return (
    <div className={m.band}>
      <p lang="ar" dir="rtl">{shown(v.ar)}</p>
      <p className={m.no}>«{v.no}» <cite>{v.ref}</cite></p>
    </div>
  );
}

/** A portal: tile border, verse band, then the iwan with something standing in its lit room. */
export function Portal({ verse, children, small = false, band, bandBelow = false }: { verse?: Verse; children: ReactNode; small?: boolean; band?: ReactNode; bandBelow?: boolean }) {
  return (
    <section className={`${m.portal} ${small ? m.small : ''}`}>
      <div className={m.frame}>
        {!bandBelow && (band ?? (verse && <Band v={verse} />))}
        <div className={m.iwan}>
          <Hood rows={small ? 2 : 3} />
          <div className={m.room}>{children}</div>
        </div>
        {bandBelow && (band ?? (verse && <Band v={verse} />))}
      </div>
      <div className={m.steps} aria-hidden="true" />
    </section>
  );
}

export function Vipps() {
  return (
    <div className={`${m.card} ${m.vipps}`}>
      <h2>Gi med Vipps</h2>
      <Image src="/vippsdonasjon.png" alt="QR-kode for å gi med Vipps" width={150} height={150} />
      <b className={f.num}>{VIPPS.number}</b>
      <a className={`${f.btn} ${f.vipps}`} href={VIPPS.url} target="_blank" rel="noopener noreferrer">Åpne Vipps</a>
    </div>
  );
}
export function Bank() {
  return (
    <div className={m.card}>
      <BankIcon />
      <h2>Bankoverføring</h2>
      {BANK_ACCOUNT ? (
        <p>Kontonummer<br /><span className={`${m.acct} ${f.num}`}>{BANK_ACCOUNT}</span></p>
      ) : (
        <p>Be om kontonummeret på <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      )}
      <small>Merk overføringen «Gave»<br />Org.nr. <span className={f.num}>{ORG_NR}</span></small>
    </div>
  );
}
export function Member() {
  return (
    <div className={m.card}>
      <HeartIcon />
      <h2>Bli medlem</h2>
      <p>Medlemskapet støtter driften av moskeen og programmene, år etter år.</p>
      <Link className={`${f.btn} ${f.primary}`} href="/become-member">Bli medlem</Link>
    </div>
  );
}

/** A strip of evening lawn the portal stands on. */
export function Ground() {
  return <div className={m.ground} aria-hidden="true" />;
}

/** The hadith and the legal note, on white under the scene. */
export function After() {
  return (
    <div className={m.after}>
      <blockquote>
        <p>«Den som bygger en moské for Allahs skyld, Allah vil bygge et hus for ham i Paradis.»</p>
        <footer>Sahih al-Bukhari &amp; Muslim</footer>
      </blockquote>
      <p className={m.credit}>Oversettelsene av Koranen er ved Einar Berg.</p>
      <p className={m.legal}>
        Mottaker er Center Rahma, org.nr. {ORG_NR}. Det er ingen bindingstid på avtaler om faste trekk. Enhver avtale kan sies opp ved å
        kontakte oss på <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </div>
  );
}
