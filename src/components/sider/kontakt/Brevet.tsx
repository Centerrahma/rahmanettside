/* Kontakt oss on wide screens: an illuminated manuscript page, and the message form is the letter on
   it. A gold and green border, a headpiece with the greeting in a cartouche, the four ways to reach
   us in round sunburst medallions in the margins, and Koranen 15:46 in the colophon. Grid 1200 × 900. */
import type { ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';
import { Lattice, delay, pen, star } from '../kit';
import { SALAM, TRANSLATION, VERSES } from '../verses';
import k from './kontakt.module.css';
import LetterForm from './LetterForm';
import { Frame, WayBody, type Way } from './ways';

const MEDALS: [number, number][] = [[214, 428], [214, 640], [986, 428], [986, 640]];
const R = 100;

/** A lobed cartouche with pointed ends. */
const cartouche = (x0: number, x1: number, y0: number, y1: number) => {
  const m = (y0 + y1) / 2;
  const e = (y1 - y0) * 0.55;
  return `M${x0 + e},${y0} H${x1 - e} C${x1 - e * 0.4},${y0} ${x1 - e * 0.15},${m - (m - y0) * 0.45} ${x1},${m} C${x1 - e * 0.15},${m + (y1 - m) * 0.45} ${x1 - e * 0.4},${y1} ${x1 - e},${y1} H${x0 + e} C${x0 + e * 0.4},${y1} ${x0 + e * 0.15},${m + (y1 - m) * 0.45} ${x0},${m} C${x0 + e * 0.15},${m - (m - y0) * 0.45} ${x0 + e * 0.4},${y0} ${x0 + e},${y0} Z`;
};

/** A round sunburst medallion (shamsa) with a scalloped gold edge and two small pendants. */
function shamsa(cx: number, cy: number) {
  let lobes = '';
  const n = 24;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    lobes += `${i ? 'L' : 'M'}${p(R - 4, a0)} Q${p(R + 8, am)} ${p(R - 4, a1)} `;
  }
  let rays = '';
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    rays += `M${(cx + 86 * Math.cos(a)).toFixed(1)},${(cy + 86 * Math.sin(a)).toFixed(1)} L${(cx + 94 * Math.cos(a)).toFixed(1)},${(cy + 94 * Math.sin(a)).toFixed(1)} `;
  }
  return { lobes: lobes + 'Z', rays };
}

function Art() {
  const { out, line, add, fade } = pen();

  // the sheet, with a second one under it
  add(<rect x={34} y={24} width={1150} height={870} rx={4} fill="#e6d6b4" className={f.fade} style={delay(0)} />);
  line('M20,10 H1166 V878 H20 Z', { fill: 'url(#kc-paper)', stroke: '#c9b58c', w: 1.2, t: 0.02 });

  // the illuminated border: green with gold stars, gold rules, gold corner rosettes
  fade(0.5, <path d="M46,36 H1140 V852 H46 Z M86,76 V812 H1100 V76 Z" fill="url(#kc-orn)" fillRule="evenodd" />);
  line('M46,36 H1140 V852 H46 Z', { stroke: 'var(--gold)', w: 1.6, t: 0.1 });
  line('M40,30 H1146 V858 H40 Z', { stroke: 'var(--gold-2)', w: 0.8, t: 0.15 });
  line('M86,76 H1100 V812 H86 Z', { stroke: 'var(--gold)', w: 1.6, t: 0.1 });
  line('M92,82 H1094 V806 H92 Z', { stroke: 'var(--gold-2)', w: 0.8, t: 0.15 });
  [[66, 56], [1120, 56], [66, 832], [1120, 832]].forEach(([x, y]) => {
    line(`M${x - 20},${y - 20} H${x + 20} V${y + 20} H${x - 20} Z`, { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 1, t: 0.3 });
    line(star(x, y, 15), { fill: '#0b5f45', stroke: '#f1d892', w: 0.9, t: 0.4 });
    line(star(x, y, 6), { fill: '#f1d892', stroke: '#f1d892', w: 0.6, t: 0.5 });
  });

  // the headpiece: a green and gold panel with the greeting in a cartouche
  line('M120,100 H1066 V208 H120 Z', { fill: '#0a5e44', stroke: 'var(--gold)', w: 1.4, t: 0.2 });
  fade(0.6, <rect x={120} y={100} width={946} height={108} fill="url(#kc-lat)" />);
  line('M126,106 H1060 V202 H126 Z', { stroke: '#e2c27d', w: 0.8, t: 0.3 });
  line(cartouche(318, 868, 112, 196), { fill: 'url(#kc-cream)', stroke: 'var(--gold)', w: 1.6, t: 0.3 });
  line(cartouche(328, 858, 119, 189), { stroke: 'var(--gold-2)', w: 0.8, t: 0.4 });
  add(
    <text x={593} y={166} textAnchor="middle" fontSize={34} fontWeight={700} fill="var(--emerald-ink)" direction="rtl" lang="ar" className={f.fade} style={delay(1)}>
      {SALAM.ar}
    </text>,
  );
  [196, 990].forEach((x) => {
    line(`M${x - 40},154 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0 Z`, { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 1, t: 0.4 });
    line(star(x, 154, 30, 0.7), { fill: '#0b5f45', stroke: '#f1d892', w: 1, t: 0.5 });
    line(star(x, 154, 12, 0.7), { fill: '#f1d892', stroke: '#f1d892', w: 0.6, t: 0.6 });
  });
  // a little crest rising from the headpiece into the border
  line('M553,100 C560,84 578,78 593,62 C608,78 626,84 633,100', { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 1, t: 0.5 });

  // rules: under the title, the columns, above the colophon
  line('M120,316 H1066 M120,321 H1066', { stroke: 'var(--gold-2)', w: 0.9, t: 0.5 });
  line('M120,742 H1066 M120,747 H1066', { stroke: 'var(--gold-2)', w: 0.9, t: 0.55 });
  line('M342,336 V728 M347,336 V728 M853,336 V728 M858,336 V728', { stroke: 'var(--gold-2)', w: 0.9, t: 0.6 });
  // the four medallions in the margins
  MEDALS.forEach(([cx, cy], i) => {
    const s = shamsa(cx, cy);
    const t = 0.5 + i * 0.08;
    line(s.lobes, { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 1.1, t });
    line(`M${cx - 88},${cy} a88,88 0 1,0 176,0 a88,88 0 1,0 -176,0 Z`, { fill: '#0b5f45', stroke: '#9b7329', w: 1, t: t + 0.05 });
    add(<path d={s.rays} stroke="#e2c27d" strokeWidth={1} className={f.fade} style={delay(1)} />);
    line(`M${cx - 82},${cy} a82,82 0 1,0 164,0 a82,82 0 1,0 -164,0 Z`, { fill: 'url(#kc-cream)', stroke: 'var(--gold)', w: 1, t: t + 0.1 });
    // pendants above and below
    line(`M${cx},${cy - R - 2} C${cx - 7},${cy - R - 8} ${cx - 4},${cy - R - 16} ${cx},${cy - R - 22} C${cx + 4},${cy - R - 16} ${cx + 7},${cy - R - 8} ${cx},${cy - R - 2} Z`, { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 0.8, t: t + 0.3 });
    line(`M${cx},${cy + R + 2} C${cx - 7},${cy + R + 8} ${cx - 4},${cy + R + 16} ${cx},${cy + R + 22} C${cx + 4},${cy + R + 16} ${cx + 7},${cy + R + 8} ${cx},${cy + R + 2} Z`, { fill: 'url(#kc-gold)', stroke: '#9b7329', w: 0.8, t: t + 0.3 });
  });

  // the colophon with 15:46
  line(cartouche(250, 936, 758, 802), { fill: 'url(#kc-cream)', stroke: 'var(--gold)', w: 1.3, t: 0.6 });
  add(
    <text x={782} y={788} textAnchor="middle" fontSize={24} fontWeight={700} fill="var(--emerald-ink)" direction="rtl" lang="ar" className={f.fade} style={delay(1.2)}>
      {VERSES.v15_46.ar}
    </text>,
  );
  line(star(664, 780, 7), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 0.6, t: 1 });
  return out;
}

export default function Brevet({ list }: { list: Way[] }) {
  const items: { rect: { x: number; y: number; w: number; h: number }; node: ReactNode; cls?: string; t?: number }[] = [
    {
      rect: { x: 300, y: 222, w: 586, h: 88 },
      node: <><h1>Kontakt oss</h1><p>Skriv til oss, så svarer vi så snart vi kan. Eller kom innom.</p></>,
      cls: k.title,
      t: 0.8,
    },
    { rect: { x: 372, y: 330, w: 456, h: 404 }, node: <LetterForm />, cls: k.letterBox, t: 1.1 },
    { rect: { x: 262, y: 760, w: 380, h: 40 }, node: <><span lang="en">«{VERSES.v15_46.en}»</span> <cite>{VERSES.v15_46.ref}, {TRANSLATION}</cite></>, cls: k.colo, t: 1.3 },
    ...list.map((w, i) => ({
      rect: { x: MEDALS[i][0] - 76, y: MEDALS[i][1] - 70, w: 152, h: 140 },
      node: <WayBody w={w} />,
      cls: `${k.way} ${k.medal}`,
      t: 1.3 + i * 0.12,
    })),
  ];
  return (
    <Frame
      vb={[0, 0, 1200, 900]}
      reserve={124}
      label="En opplyst manuskriptside med hilsenen øverst, fire medaljonger i margen og Koranen 15:46 nederst"
      items={items}
      art={
        <>
          <defs>
            <linearGradient id="kc-paper" x1={0} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor="#fffaf0" />
              <stop offset={0.6} stopColor="#fbf2de" />
              <stop offset={1} stopColor="#f3e5c6" />
            </linearGradient>
            <linearGradient id="kc-cream" x1={0} y1={0} x2={0} y2={1}>
              <stop offset={0} stopColor="#fffdf6" />
              <stop offset={1} stopColor="#f8eedb" />
            </linearGradient>
            <linearGradient id="kc-gold" x1={0} y1={0} x2={1} y2={1}>
              <stop offset={0} stopColor="#f3dc9c" />
              <stop offset={0.5} stopColor="#d6af60" />
              <stop offset={1} stopColor="#b98a3c" />
            </linearGradient>
            <pattern id="kc-orn" x={46} y={36} width={40} height={40} patternUnits="userSpaceOnUse">
              <rect width={40} height={40} fill="#0b5f45" />
              <path d={star(20, 20, 12, 0.62)} fill="#e2c27d" />
              <path d={star(20, 20, 5, 0.62)} fill="#0b5f45" />
              {[[0, 0], [40, 0], [0, 40], [40, 40]].map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={3.2} fill="#f6e7b8" />)}
            </pattern>
            <Lattice id="kc-lat" />
          </defs>
          <Art />
        </>
      }
    />
  );
}
