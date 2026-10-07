/* Støtt oss on wide screens: three tiled portals under an evening sky, like the Registan in Samarkand.
   Each portal frames a deep iwan with a muqarnas hood, and one way to give stands lit in each; the
   band above each arch carries a complete verse, and the translations sit in a row under the portals.
   Drawn on a 1400-wide grid with the ground at y 620; HTML is placed on it in the same units. */
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lawn, SceneDefs } from '@/components/forside/Omgivelser';
import { BANK_ACCOUNT, EMAIL, ORG_NR, VIPPS } from '@/components/forside/links';
import f from '@/components/forside/forside.module.css';
import { BankIcon, HeartIcon } from '../icons';
import { Lattice, arch, crescent, delay, muqarnas, onion, onionRibs, pen, tiles, tilesV, windows } from '../kit';
import { TRANSLATION, VERSES, shown, type Verse } from '../verses';
import { KveldDefs, Riwaq, Sky } from './Kveld';
import s from './stott.module.css';

const S = 'url(#kv-stone)';
const VB: [number, number, number, number] = [0, -130, 1400, 830];
const G = 620;

interface Rect { x: number; y: number; w: number; h: number }
interface Portal {
  x0: number; x1: number; top: number; band: [number, number]; verse: Verse;
  o: [number, number, number, number]; i: [number, number, number, number]; rows: number; card: Rect; t: number;
}

const CENTER: Portal = {
  x0: 440, x1: 960, top: 62, band: [86, 228], verse: VERSES.v9_18,
  o: [530, 870, 352, 244], i: [554, 846, 360, 270], rows: 3,
  card: { x: 562, y: 362, w: 276, h: 246 }, t: 0.15,
};
const side = (x0: number, verse: Verse): Portal => {
  const c = x0 + 190;
  return {
    x0, x1: x0 + 380, top: 120, band: [138, 280], verse,
    o: [c - 134, c + 134, 396, 298], i: [c - 114, c + 114, 404, 322], rows: 3,
    card: { x: c - 110, y: 406, w: 220, h: 202 }, t: 0.25,
  };
};
const LEFT = side(20, VERSES.v3_92);
const RIGHT = side(1000, VERSES.v2_245);
const PORTALS = [LEFT, CENTER, RIGHT];
/** Where the Arabic sits: inside the band's gold rules. */
const verseRect = (p: Portal): Rect => ({ x: p.x0 + 32, y: p.band[0] + 6, w: p.x1 - p.x0 - 64, h: p.band[1] - p.band[0] - 12 });

type Pen = ReturnType<typeof pen>;

function drawPortal(p: Portal, id: string, { line, add, fade }: Pen) {
  const { x0, x1, top, t } = p;
  const cx = (x0 + x1) / 2;
  const [ox0, ox1, osp, otp] = p.o;
  const [ix0, ix1, isp, itp] = p.i;
  const outer = arch(ox0, ox1, osp, otp, G, true);
  const inner = arch(ix0, ix1, isp, itp, G, true);
  const ts = 16;
  // the block of the portal, its tile border and frames
  line(`M${x0},${G} V${top} H${x1} V${G}`, { fill: S, w: 1.8, t });
  fade(t + 0.9, <>{tiles(x0, x1, top + ts / 2 + 1, ts)}{tilesV(x0 + ts / 2, top + ts + 2, G - 6, ts)}{tilesV(x1 - ts / 2, top + ts + 2, G - 6, ts)}</>);
  line(`M${x0 + ts + 2},${G} V${top + ts + 2} H${x1 - ts - 2} V${G}`, { stroke: 'var(--gold-2)', w: 1, t: t + 0.2 });
  // the band for the verse (the Arabic itself is HTML, placed by the page)
  const [b0, b1] = p.band;
  line(`M${x0 + 22},${b0} H${x1 - 22} V${b1} H${x0 + 22} Z`, { fill: 'url(#st-band)', stroke: 'var(--emerald-ink)', w: 1.2, t: t + 0.3 });
  line(`M${x0 + 28},${b0 + 5} H${x1 - 28} M${x0 + 28},${b1 - 5} H${x1 - 28}`, { stroke: '#d9b770', w: 0.9, t: t + 0.5 });
  // the alfiz frame round the arch, lattice in the spandrels
  const ax0 = ox0 - 20;
  const ax1 = ox1 + 20;
  const ay = otp - 6;
  fade(t + 0.8, <path d={`M${ax0},${ay} H${ax1} V${osp} H${ax0} Z ${outer}`} fill="url(#st-lat)" fillRule="evenodd" />);
  line(`M${ax0},${G} V${ay} H${ax1} V${G}`, { w: 1.4, t: t + 0.25 });
  line(`M${ax0 - 8},${G} V${ay - 8} H${ax1 + 8} V${G}`, { stroke: 'var(--gold-2)', w: 1, t: t + 0.3 });
  // the iwan: a deep reveal, the muqarnas hood, the lit room
  fade(t + 0.5, <path d={`${outer} ${inner}`} fill="url(#st-rev)" fillRule="evenodd" />);
  fade(
    t + 0.7,
    <g clipPath={`url(#st-in-${id})`}>
      <rect x={ix0} y={isp - 12} width={ix1 - ix0} height={G - isp + 12} fill="url(#kv-lit)" />
      <ellipse cx={cx} cy={isp + 40} rx={(ix1 - ix0) * 0.6} ry={150} fill="url(#kv-glow)" />
      {muqarnas(ix0, ix1, itp, isp, p.rows, ['#f7ecd3', '#e2cc9f'])}
    </g>,
  );
  line(outer, { w: 1.8, t: t + 0.2 });
  line(inner, { stroke: 'var(--gold-2)', w: 1.1, t: t + 0.35 });
  line(arch((ox0 + ix0) / 2, (ox1 + ix1) / 2, (osp + isp) / 2, (otp + itp) / 2, G), { stroke: 'var(--gold-2)', w: 0.8, op: 0.7, t: t + 0.45 });
  // warm light spilling from the iwan onto the ground
  add(<ellipse cx={cx} cy={G + 6} rx={(ix1 - ix0) * 0.7} ry={26} fill="url(#nt-flood)" className={f.fade} style={delay(1.4)} />);
}

function Art() {
  const p = pen();
  const { line, fade } = p;

  // walls behind the minarets
  line(`M395,${G} V300 H445 V${G} M955,${G} V300 H1005 V${G}`, { fill: S, w: 1.2, t: 0.1 });

  // the melon dome on its drum
  line('M618,62 V16 H782 V62', { fill: S, w: 1.4, t: 0.1 });
  line(windows(626, 774, 7, 56, 30, 10), { fill: 'url(#kv-lit)', w: 1, t: 0.4 });
  line(onion(700, 16, 176, 112), { fill: 'url(#kv-dome)', w: 1.8, t: 0.15 });
  line(onionRibs(700, 16, 176, 112, 14), { w: 0.9, op: 0.55, t: 0.35 });
  line('M606,16 H794 M612,8 H788', { stroke: 'var(--gold)', w: 1.2, t: 0.4 });
  line('M700,-96 V-110', { w: 1.3, t: 0.5 });
  line(crescent(700, -116, 6.5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1, t: 0.55 });

  // minarets either side of the great portal
  [420, 980].forEach((x) => {
    line(`M${x - 16},${G} V30 H${x + 16} V${G}`, { fill: 'url(#kv-shaft)', w: 1.4, t: 0.1 });
    fade(1, <>{tiles(x - 16, x + 16, 230, 16)}{tiles(x - 16, x + 16, 420, 16)}</>);
    line(`M${x - 16},222 H${x + 16} M${x - 16},238 H${x + 16} M${x - 16},412 H${x + 16} M${x - 16},428 H${x + 16}`, { w: 0.9, t: 0.6 });
    line(`M${x - 16},50 L${x - 26},38 V30 H${x + 26} V38 L${x + 16},50`, { fill: S, w: 1.2, t: 0.5 });
    line(`M${x - 26},30 V18 H${x + 26} V30 M${x - 18},18 V30 M${x - 9},18 V30 M${x},18 V30 M${x + 9},18 V30 M${x + 18},18 V30`, { w: 1, t: 0.6 });
    line(`M${x - 11},18 V-16 H${x + 11} V18`, { fill: S, w: 1.2, t: 0.6 });
    line(arch(x - 5, x + 5, 2, -6, 12, true), { fill: 'url(#kv-lit)', w: 0.9, t: 0.8 });
    line(onion(x, -16, 30, 34), { fill: 'url(#kv-dome)', w: 1.2, t: 0.7 });
    line(`M${x},-50 V-60`, { w: 1, t: 0.8 });
    line(crescent(x, -64, 4), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 0.9, t: 0.85 });
  });

  // the three portals
  drawPortal(LEFT, 'l', p);
  drawPortal(RIGHT, 'r', p);
  drawPortal(CENTER, 'c', p);

  // little turrets (guldasta) on the portals' corners
  [LEFT.x0 + 8, LEFT.x1 - 8, RIGHT.x0 + 8, RIGHT.x1 - 8].forEach((x) => {
    line(`M${x - 7},${LEFT.top} V${LEFT.top - 40} H${x + 7} V${LEFT.top}`, { fill: S, w: 1.1, t: 0.5 });
    line(onion(x, LEFT.top - 40, 16, 20), { fill: 'url(#kv-dome)', w: 1, t: 0.6 });
    line(`M${x},${LEFT.top - 60} V${LEFT.top - 68}`, { w: 0.9, t: 0.7 });
  });
  [CENTER.x0 + 9, CENTER.x1 - 9].forEach((x) => {
    line(`M${x - 8},${CENTER.top} V${CENTER.top - 44} H${x + 8} V${CENTER.top}`, { fill: S, w: 1.1, t: 0.5 });
    line(onion(x, CENTER.top - 44, 18, 24), { fill: 'url(#kv-dome)', w: 1, t: 0.6 });
    line(`M${x},${CENTER.top - 68} V${CENTER.top - 78}`, { w: 0.9, t: 0.7 });
  });
  return <>{p.out}</>;
}

/** In front of the lawn: the steps and a stone path up to the great portal. */
function Fore() {
  const { out, line } = pen();
  line(`M548,${G} H852 V${G + 12} H548 Z`, { fill: S, w: 1.2, t: 0.5 });
  line(`M530,${G + 12} H870 V${G + 24} H530 Z`, { fill: S, w: 1.2, t: 0.55 });
  line(`M566,${G + 24} H834 L900,700 H500 Z`, { fill: 'url(#st-path)', w: 1.2, t: 0.6 });
  line(`M540,664 H860 M520,684 H880`, { stroke: 'var(--gold-2)', w: 0.8, op: 0.6, t: 0.8 });
  return <>{out}</>;
}

function Drawing() {
  return (
    <svg viewBox={VB.join(' ')} role="img" aria-label="Tre flislagte portaler med kupler og minareter i kveldslys. I hver portal står en måte å gi på.">
      <defs>
        <SceneDefs mood="dusk" />
        <KveldDefs />
        <linearGradient id="st-rev" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#d6bd8c" />
          <stop offset={0.5} stopColor="#eddcb9" />
          <stop offset={1} stopColor="#cfb47f" />
        </linearGradient>
        <linearGradient id="st-band" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#0d7553" />
          <stop offset={1} stopColor="#085a40" />
        </linearGradient>
        <linearGradient id="st-path" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#f3e3c2" />
          <stop offset={1} stopColor="#e2cb9f" />
        </linearGradient>
        <Lattice id="st-lat" />
        {[['c', CENTER], ['l', LEFT], ['r', RIGHT]].map(([id, p]) => {
          const q = p as Portal;
          return <clipPath key={id as string} id={`st-in-${id}`}><path d={arch(q.i[0], q.i[1], q.i[2], q.i[3], G, true)} /></clipPath>;
        })}
      </defs>
      {/* the scenery is drawn on the front page's grid: 100 right, 40 down puts it under these portals */}
      <g transform="translate(100,40)">
        <Sky />
        <g className={f.wide}><Riwaq /></g>
      </g>
      <Art />
      <g transform="translate(100,40)"><Lawn arch={false} /></g>
      <Fore />
    </svg>
  );
}

export default function Portaler() {
  const [vx, vy, vw, vh] = VB;
  const pos = (r: Rect, t: number) =>
    ({
      '--x': `${(((r.x - vx) / vw) * 100).toFixed(3)}%`,
      '--y': `${(((r.y - vy) / vh) * 100).toFixed(3)}%`,
      '--w': `${((r.w / vw) * 100).toFixed(3)}%`,
      '--h': `${((r.h / vh) * 100).toFixed(3)}%`,
      ...delay(t),
    }) as CSSProperties;
  const place = (r: Rect, t: number, cls: string, node: ReactNode, key?: string) => (
    <div key={key} className={`${s.place} ${cls}`} style={pos(r, t)}>{node}</div>
  );
  return (
    <div className={s.desk} style={{ '--ar': `${vw}/${vh}`, '--arn': vw / vh } as CSSProperties}>
      <div className={s.stage}>
        <div className={s.art}><Drawing /></div>

        {place({ x: 44, y: -120, w: 380, h: 168 }, 0.9, s.intro, <h1>Støtt moskeen vår</h1>)}
        {place({ x: 1016, y: -120, w: 344, h: 168 }, 1.1, s.hadith, (
          <blockquote>
            <p>«Den som bygger en moské for Allahs skyld, Allah vil bygge et hus for ham i Paradis.»</p>
            <footer>Sahih al-Bukhari &amp; Muslim</footer>
          </blockquote>
        ))}
        {PORTALS.map((p) => place(verseRect(p), 1.2, s.verse, <p lang="ar" dir="rtl">{shown(p.verse.ar)}</p>, p.verse.ref))}

        {place(LEFT.card, 1.5, s.card, (
          <>
            <BankIcon />
            <h2>Bankoverføring</h2>
            {BANK_ACCOUNT ? (
              <p>Kontonummer<br /><span className={`${s.acct} ${f.num}`}>{BANK_ACCOUNT}</span></p>
            ) : (
              <p>Be om kontonummeret på <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            )}
            <small>Merk overføringen «Gave»<br />Org.nr. <span className={f.num}>{ORG_NR}</span></small>
          </>
        ))}
        {place(CENTER.card, 1.3, s.card, (
          <>
            <Image src="/vipps-77811.png" alt="QR-kode for å gi med Vipps" width={150} height={150} />
            <b className={f.num}>{VIPPS.number}</b>
            <a className={`${f.btn} ${f.vipps}`} href={VIPPS.url} target="_blank" rel="noopener noreferrer">Åpne Vipps</a>
          </>
        ))}
        {place(RIGHT.card, 1.7, s.card, (
          <>
            <HeartIcon />
            <h2>Bli medlem</h2>
            <p>Medlemskapet støtter driften av moskeen og programmene, år etter år.</p>
            <Link className={`${f.btn} ${f.primary}`} href="/blimedlem">Bli medlem</Link>
          </>
        ))}
      </div>

      {/* the translations (English, Sahih International), each under its portal */}
      <div className={s.under}>
        <ul className={s.translations}>
          {PORTALS.map((p) => (
            <li key={p.verse.ref}><span lang="en">«{p.verse.en}»</span> <cite>{p.verse.ref}</cite></li>
          ))}
        </ul>
        <p className={s.credit}>Engelsk oversettelse: {TRANSLATION}</p>
        <p className={s.legal}>
          Mottaker er Center Rahma, org.nr. {ORG_NR}. Det er ingen bindingstid på avtaler om faste trekk. Enhver avtale kan sies opp ved å
          kontakte oss på <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}
