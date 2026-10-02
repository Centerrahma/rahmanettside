'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { nextSlot, osloNow, slotsFor, until } from '@/lib/prayer-clock';
import { DownloadIcon } from './icons';
import { YEAR_PDF } from './links';
import s from './forside.module.css';

/* The mosque front, drawn on a 1200 × 660 grid (y runs from -80). Each of the five
   arches holds the sky of one prayer: dawn, high sun, low sun, sunset, night. */

const SKIES = [
  { stops: [['0', '#22305b'], ['.55', '#5d6aa0'], ['1', '#f2c3b0']], hill: 'rgba(20,24,60,.35)' },
  { stops: [['0', '#86c0e8'], ['1', '#e9f5fc']], hill: 'rgba(40,90,80,.16)' },
  { stops: [['0', '#a6cde6'], ['1', '#fbe2b0']], hill: 'rgba(90,80,40,.16)' },
  { stops: [['0', '#4b4789'], ['.55', '#d8707a'], ['1', '#f7b46c']], hill: 'rgba(50,20,40,.35)' },
  { stops: [['0', '#0a1633'], ['1', '#243a6c']], hill: 'rgba(0,0,10,.4)' },
];

const star = (cx: number, cy: number, r0: number) => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? r0 * 0.7654 : r0;
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};
const crescent = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r * 1.3},${r * 1.3} 0 0 1 ${cx - r},${cy} Z`;

const delay = (d: number | string) => ({ '--d': `${d}s` }) as CSSProperties;
const bayX = (i: number) => 150 + 180 * i;
const pct = (v: number, total: number, off = 0) => (((v + off) / total) * 100).toFixed(3) + '%';

interface LineOpts { fill?: string; stroke?: string; w?: number; d?: string; op?: number }

/** The whole drawing. `next` and `past` only change fills and opacities, so React
    keeps the same elements and the draw-on never replays. */
function Facade({ next, past }: { next: number | null; past: boolean[] }) {
  const out: ReactNode[] = [];
  let di = 0;
  const line = (d: string, o: LineOpts = {}) =>
    out.push(
      <path
        key={out.length}
        d={d}
        fill={o.fill ?? 'none'}
        stroke={o.stroke ?? 'var(--emerald)'}
        strokeWidth={o.w ?? 1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeOpacity={o.op}
        pathLength={1}
        className={s.draw}
        style={delay(o.d ?? (0.05 + di++ * 0.03).toFixed(2))}
      />,
    );

  // dome and drum
  line('M528,104 V70 H672 V104', { fill: '#fff' });
  [548, 574, 600, 626, 652].forEach((c) => line(`M${c - 4},96 V84 C${c - 4},80 ${c},76 ${c},74 C${c},76 ${c + 4},80 ${c + 4},84 V96`, { w: 1 }));
  line('M520,70 C498,50 504,14 540,-6 C568,-22 594,-28 600,-50 C606,-28 632,-22 660,-6 C696,14 702,50 680,70 Z', { fill: 'var(--mint)', w: 1.8 });
  line('M600,-50 C590,-10 572,34 562,70 M600,-50 C610,-10 628,34 638,70 M600,-50 V70', { w: 1, op: 0.35 });
  line('M512,70 H688', { w: 1.5 });
  line('M600,-50 V-62', { w: 1.4 });
  line(crescent(600, -68, 7), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
  line(star(600, 22, 12), { stroke: 'var(--gold)', fill: '#fff', w: 1.1 });
  // side domes
  [240, 960].forEach((c) => {
    line(`M${c - 34},104 C${c - 42},84 ${c - 26},68 ${c},54 C${c + 26},68 ${c + 42},84 ${c + 34},104 Z`, { fill: 'var(--mint)' });
    line(`M${c},54 V44`, { w: 1.2 });
    line(crescent(c, 39, 4.5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
  });
  // minarets, each tied to the arcade by a wall
  [90, 1110].forEach((x) => {
    line(`M${x - 22},580 V548 H${x + 22} V580`, { fill: '#fff' });
    line(`M${x - 12},548 V96 H${x + 12} V548`, { fill: '#fff' });
    line(`M${x - 22},250 H${x + 22} M${x - 20},258 H${x + 20} M${x - 18},258 L${x - 12},268 M${x + 18},258 L${x + 12},268 M${x - 7},258 V266 M${x + 7},258 V266`, { w: 1.2 });
    line(`M${x - 21},96 H${x + 21} M${x - 18},103 H${x + 18}`, { w: 1.2 });
    line(`M${x - 7},96 V58 H${x + 7} V96`, { fill: '#fff' });
    line(`M${x - 10},58 C${x - 11},42 ${x},32 ${x},10 C${x},32 ${x + 11},42 ${x + 10},58 Z`, { fill: 'var(--mint)' });
    line(`M${x},10 V-2`, { w: 1.2 });
    line(crescent(x, -7, 5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
    [170, 330, 430].forEach((y) => line(`M${x - 4},${y + 14} V${y + 4} C${x - 4},${y} ${x},${y - 4} ${x},${y - 6} C${x},${y - 4} ${x + 4},${y} ${x + 4},${y + 4} V${y + 14}`, { w: 1 }));
    const a = x < 600 ? x + 12 : 1062;
    const b = x < 600 ? 138 : x - 12;
    line(`M${a},580 V330 H${b} V580`, { fill: '#fff' });
    const c = (a + b) / 2;
    line(`M${c - 8},560 V470 C${c - 8},458 ${c},450 ${c},446 C${c},450 ${c + 8},458 ${c + 8},470 V560`, { w: 1.1 });
  });
  // crenellation, frieze with the verse, lattice in the spandrels, muqarnas
  let cren = '';
  for (let x = 138; x < 1062; x += 14) cren += `M${x + 1},120 V113 L${x + 7},106 L${x + 13},113 V120 `;
  line(cren, { w: 1 });
  line('M138,120 H1062 V176 H138 Z', { fill: '#fff', w: 1.6 });
  line('M146,127 H1054 M146,169 H1054', { stroke: 'var(--gold-2)', w: 1 });
  out.push(
    <text key={out.length} x={600} y={156} textAnchor="middle" fontSize={25} fill="var(--gold)" direction="rtl" lang="ar" className={s.fade} style={delay(1.1)}>
      إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
    </text>,
  );
  out.push(<rect key={out.length} x={138} y={188} width={924} height={112} fill="url(#fh-lat)" className={s.fade} style={delay(0.9)} />);
  line('M138,176 V580 M1062,176 V580', { w: 1.6 });
  let muq = '';
  for (let x = 138; x < 1062; x += 16) muq += `M${x},176 Q${x + 8},190 ${x + 16},176 `;
  line(muq, { stroke: 'var(--gold-2)', w: 1 });

  // the five bays
  SKIES.forEach((sky, i) => {
    const x0 = bayX(i);
    const L = x0 + 12;
    const R = x0 + 168;
    const C = x0 + 90;
    const arch = `M${L},560 V300 C${L},262 ${C - 28},238 ${C},212 C${C + 28},238 ${R},262 ${R},300 V560 Z`;
    const isNext = next === i;
    out.push(
      <g key={out.length} clipPath={`url(#fh-c${i})`}>
        <rect x={L} y={392} width={156} height={168} fill={isNext ? 'url(#fh-glow)' : '#f5f8f6'} />
        <g className={s.fade} style={delay((1.1 + i * 0.22).toFixed(2))}>
          <rect x={L} y={200} width={156} height={192} fill={`url(#fh-sky${i})`} />
          {i === 0 && (
            <>
              {[[C - 34, 262], [C + 30, 248], [C + 44, 288], [C - 48, 300], [C - 10, 240]].map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={1.4} fill="#fff" opacity={0.85} />)}
              <path d={crescent(C + 18, 272, 9)} fill="#fbeed2" transform={`rotate(-30 ${C + 18} 272)`} />
            </>
          )}
          {i === 1 && (
            <>
              <circle cx={C} cy={256} r={22} fill="#fff" opacity={0.35} />
              <circle cx={C} cy={256} r={13} fill="#fff6d8" />
            </>
          )}
          {i === 2 && (
            <>
              <circle cx={C + 34} cy={320} r={20} fill="#fff" opacity={0.3} />
              <circle cx={C + 34} cy={320} r={12} fill="#ffe6a3" />
            </>
          )}
          {i === 3 && (
            <>
              <circle cx={C - 6} cy={384} r={30} fill="#ffd9a0" opacity={0.35} />
              <circle cx={C - 6} cy={384} r={18} fill="#ffd27a" />
            </>
          )}
          {i === 4 && (
            <>
              {[[C - 40, 300], [C + 34, 262], [C + 44, 330], [C - 20, 340], [C + 6, 236], [C - 44, 254], [C + 20, 300]].map(([x, y], k) => <circle key={`${x},${y}`} cx={x} cy={y} r={k % 2 ? 1.2 : 1.7} fill="#fff" opacity={0.9} />)}
              <path d={crescent(C - 16, 268, 10)} fill="#f4e5b6" transform={`rotate(-30 ${C - 16} 268)`} />
            </>
          )}
          <path d={`M${L},392 V372 C${L + 30},360 ${L + 56},368 ${C},364 C${C + 30},360 ${R - 30},374 ${R},366 V392 Z`} fill={sky.hill} />
        </g>
        <rect x={L} y={200} width={156} height={192} fill="#fff" opacity={past[i] ? 0.55 : 0} className={s.skyfx} />
      </g>,
    );
    line(arch, { w: 1.6, d: (0.3 + i * 0.08).toFixed(2) });
    line(`M${L + 8},392 V302 C${L + 8},268 ${C - 24},246 ${C},222 C${C + 24},246 ${R - 8},268 ${R - 8},302 V392`, { stroke: 'var(--gold-2)', w: 1, d: (0.45 + i * 0.08).toFixed(2) });
    line(`M${L},392 H${R} M${L},398 H${R}`, { stroke: 'var(--gold-2)', w: 1, d: (0.6 + i * 0.08).toFixed(2) });
    out.push(<path key={out.length} d={arch} fill="none" stroke="#d9a640" strokeWidth={4} opacity={isNext ? 1 : 0} className={s.skyfx} />);
  });
  // capitals and bases
  for (let k = 0; k <= 5; k++) {
    const x = bayX(k);
    line(`M${x - 18},300 H${x + 18} M${x - 14},306 H${x + 14} M${x - 16},552 H${x + 16}`, { w: 1.3 });
  }
  line('M40,580 H1160 M60,588 H1140', { w: 1.6 });

  return (
    <svg viewBox="0 -80 1200 660" role="img" aria-label="Moskeens fasade med fem buer. Hver bue viser himmelen ved en av dagens bønner.">
      <defs>
        {SKIES.map((sky, i) => (
          <linearGradient key={i} id={`fh-sky${i}`} x1={0} y1={0} x2={0} y2={1}>
            {sky.stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </linearGradient>
        ))}
        <pattern id="fh-lat" width={24} height={24} patternUnits="userSpaceOnUse">
          <path d={star(12, 12, 7)} fill="none" stroke="var(--gold)" strokeWidth={0.8} strokeOpacity={0.55} />
          <path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke="var(--gold)" strokeWidth={0.8} strokeOpacity={0.4} />
        </pattern>
        <radialGradient id="fh-glow" cx={0.5} cy={0.4} r={0.6}>
          <stop offset={0} stopColor="#ffe9b0" stopOpacity={0.9} />
          <stop offset={1} stopColor="#fff6df" stopOpacity={0.4} />
        </radialGradient>
        {SKIES.map((_, i) => {
          const L = bayX(i) + 12;
          const R = bayX(i) + 168;
          const C = bayX(i) + 90;
          return (
            <clipPath key={i} id={`fh-c${i}`}>
              <path d={`M${L},560 V300 C${L},262 ${C - 28},238 ${C},212 C${C + 28},238 ${R},262 ${R},300 V560 Z`} />
            </clipPath>
          );
        })}
      </defs>
      {out}
    </svg>
  );
}

interface Props {
  schedule: PrayerSchedule;
  /** Whether it is Friday in Oslo when the page was rendered; the browser checks again. */
  friday: boolean;
}

export default function FemHimler({ schedule, friday: renderedFriday }: Props) {
  // Nothing time-dependent is marked until the browser knows the time, so the
  // server and the first client render agree.
  const [clock, setClock] = useState<{ min: number; friday: boolean } | null>(null);
  const [badgeOn, setBadgeOn] = useState(false);
  useEffect(() => {
    const tick = () => {
      const n = osloNow();
      setClock({ min: n.min, friday: n.friday });
    };
    tick();
    const id = setInterval(tick, 30_000);
    // the badge waits until the arches have drawn
    const show = setTimeout(() => setBadgeOn(true), 2200);
    return () => {
      clearInterval(id);
      clearTimeout(show);
    };
  }, []);

  const slots = slotsFor(schedule, clock?.friday ?? renderedFriday);
  const nx = clock ? nextSlot(slots, clock.min, schedule.tomorrowFajr) : null;
  const past = slots.map((slot) => !!clock && !nx?.tomorrow && slot.at <= clock.min);

  return (
    <section className={s.hero} aria-labelledby="forside-h1">
      <div className={s.facade}>
        <Facade next={nx?.index ?? null} past={past} />
        <ul className={s.bays} aria-label="Bønnetider i dag">
          {slots.map((slot, i) => (
            <li
              key={slot.key}
              className={`${s.bay} ${nx?.index === i ? s.next : ''} ${past[i] ? s.past : ''}`}
              style={{
                left: pct(bayX(i) + 12, 1200),
                width: pct(156, 1200),
                top: pct(400, 660, 80),
                height: pct(150, 660),
                ...delay((1.3 + i * 0.22).toFixed(2)),
              }}
            >
              <span className={s.ar} lang="ar">{slot.ar}</span>
              <span className={s.nm}>{slot.name}</span>
              <span className={`${s.tm} ${s.num}`}>{slot.time}</span>
              <span className={`${s.iq} ${s.num}`}>{slot.note}</span>
            </li>
          ))}
        </ul>
        {nx && (
          <span
            className={`${s.badge} ${badgeOn ? s.on : ''}`}
            style={{ left: pct(bayX(nx.index) + 90, 1200), top: pct(204, 660, 80) }}
          >
            Neste, {nx.tomorrow ? 'i morgen om ' : 'om '}
            {until(nx.left)}
          </span>
        )}
      </div>

      <div className={s.name}>
        <h1 id="forside-h1">Center Rahma</h1>
        <div className={s.ctas}>
          <a className={`${s.btn} ${s.primary}`} href="#besok">Finn fram</a>
          <a className={`${s.btn} ${s.quiet}`} href={YEAR_PDF.href} download={YEAR_PDF.filename}>
            <DownloadIcon />
            Bønnetider 2026
          </a>
        </div>
      </div>

      <ul className={s.list} aria-label="Bønnetider i dag">
        {slots.map((slot, i) => (
          <li key={slot.key} className={`${nx?.index === i ? s.next : ''} ${past[i] ? s.past : ''}`}>
            <span
              className={s.sw}
              style={{ background: `linear-gradient(${SKIES[i].stops.map(([o, c]) => `${c} ${Number(o) * 100}%`).join(',')})` }}
            />
            <span>
              <b>{slot.name}</b>
              <small className={s.num}>{slot.note}</small>
            </span>
            <span className={`${s.t} ${s.num}`}>{slot.time}</span>
          </li>
        ))}
      </ul>

      <p className={s.gloss}>
        <q>Bønnen er foreskrevet for de troende til fastsatte tider.</q>
        <span>Koranen 4:103</span>
      </p>
    </section>
  );
}
