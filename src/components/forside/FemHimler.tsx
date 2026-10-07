'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import type { PrayerSchedule } from '@/types/prayer';
import { nextSlot, osloNow, slotsFor, until } from '@/lib/prayer-clock';
import { Grand, Lawn, Pool, SceneDefs, Sky, Wings, isDark, type Mood } from './Omgivelser';
import s from './forside.module.css';

/* The mosque front, drawn on a 1200 × 830 grid (y runs from -120; the ground is at 580, the lawn and pool below it).
   The roof is raised so the verse can be read on a phone. Each of the five arches holds the sky of one prayer:
   dawn, high sun, low sun, sunset, night. Around it (Omgivelser.tsx) a painted sky follows the time of day. */

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
/** One half of the flourish under the name: a long tapering line ending in a curl with two leaves. */
const SCROLL =
  'M186,22 C170,22 160,14 146,14 C132,14 126,26 136,30 C144,33 150,24 142,21 ' +
  'M146,14 C122,14 104,22 80,22 C56,22 40,18 14,20 ' +
  'M118,18 C112,8 100,6 94,12 C102,12 110,14 118,18 Z ' +
  'M98,22 C92,30 80,32 74,27 C82,25 90,23 98,22 Z';
const bayX = (i: number) => 150 + 180 * i;
const pct = (v: number, total: number, off = 0) => (((v + off) / total) * 100).toFixed(3) + '%';
const H = 830;
/** The five arch openings, for the clip paths and the reflection in the pool. */
const BAYS = SKIES.map((_, i) => {
  const L = bayX(i) + 12;
  const R = bayX(i) + 168;
  const C = bayX(i) + 90;
  return `M${L},560 V300 C${L},262 ${C - 28},238 ${C},212 C${C + 28},238 ${R},262 ${R},300 V560 Z`;
});
const PIERS = [0, 1, 2, 3, 4, 5].map(bayX);
const REFLECTED = ['#5d6aa0', '#86c0e8', '#a6cde6', '#d8707a', '#243a6c'];
const MOODS: Mood[] = ['night', 'morning', 'day', 'afternoon', 'dusk'];
/** The time of day the scene shows: the period that ends at the next prayer. */
const moodOf = (n: { index: number; tomorrow: boolean }): Mood => (n.tomorrow ? 'night' : MOODS[n.index]);
/** Ivory stone, lighter at the top, for the walls. */
const W = 'url(#fh-stone)';

interface LineOpts { fill?: string; stroke?: string; w?: number; d?: string; op?: number }

/** The whole drawing. `next` and `past` only change fills and opacities, so React
    keeps the same elements and the draw-on never replays. */
function Facade({ next, past, mood }: { next: number | null; past: boolean[]; mood: Mood }) {
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
  line('M528,64 V30 H672 V64', { fill: W });
  [548, 574, 600, 626, 652].forEach((c) => line(`M${c - 4},56 V44 C${c - 4},40 ${c},36 ${c},34 C${c},36 ${c + 4},40 ${c + 4},44 V56`, { w: 1 }));
  line('M520,30 C498,10 504,-26 540,-46 C568,-62 594,-68 600,-90 C606,-68 632,-62 660,-46 C696,-26 702,10 680,30 Z', { fill: 'var(--mint)', w: 1.8 });
  line('M600,-90 C590,-50 572,-6 562,30 M600,-90 C610,-50 628,-6 638,30 M600,-90 V30', { w: 1, op: 0.35 });
  line('M512,30 H688', { w: 1.5 });
  line('M600,-90 V-102', { w: 1.4 });
  line(crescent(600, -108, 7), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
  line(star(600, -18, 12), { stroke: 'var(--gold)', fill: W, w: 1.1 });
  // side domes
  [240, 960].forEach((c) => {
    line(`M${c - 34},64 C${c - 42},44 ${c - 26},28 ${c},14 C${c + 26},28 ${c + 42},44 ${c + 34},64 Z`, { fill: 'var(--mint)' });
    line(`M${c},14 V4`, { w: 1.2 });
    line(crescent(c, -1, 4.5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
  });
  // minarets, each tied to the arcade by a wall
  [90, 1110].forEach((x) => {
    line(`M${x - 30},580 V548 H${x + 30} V580`, { fill: W });
    line(`M${x - 18},548 V56 H${x + 18} V548`, { fill: W });
    line(`M${x - 30},250 H${x + 30} M${x - 28},258 H${x + 28} M${x - 26},258 L${x - 18},268 M${x + 26},258 L${x + 18},268 M${x - 10},258 V266 M${x + 10},258 V266`, { w: 1.2 });
    line(`M${x - 29},56 H${x + 29} M${x - 25},63 H${x + 25}`, { w: 1.2 });
    line(`M${x - 11},56 V18 H${x + 11} V56`, { fill: W });
    line(`M${x - 15},18 C${x - 16},2 ${x},-8 ${x},-30 C${x},-8 ${x + 16},2 ${x + 15},18 Z`, { fill: 'var(--mint)' });
    line(`M${x},-30 V-42`, { w: 1.2 });
    line(crescent(x, -47, 5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1 });
    [170, 330, 430].forEach((y) => line(`M${x - 6},${y + 16} V${y + 4} C${x - 6},${y} ${x},${y - 5} ${x},${y - 8} C${x},${y - 5} ${x + 6},${y} ${x + 6},${y + 4} V${y + 16}`, { w: 1 }));
    const a = x < 600 ? x + 18 : 1062;
    const b = x < 600 ? 138 : x - 18;
    line(`M${a},580 V330 H${b} V580`, { fill: W });
    const c = (a + b) / 2;
    line(`M${c - 8},560 V470 C${c - 8},458 ${c},450 ${c},446 C${c},450 ${c + 8},458 ${c + 8},470 V560`, { w: 1.1 });
  });
  // crenellation, frieze with the verse, lattice in the spandrels, muqarnas
  let cren = '';
  for (let x = 138; x < 1062; x += 14) cren += `M${x + 1},80 V73 L${x + 7},66 L${x + 13},73 V80 `;
  line(cren, { w: 1 });
  line('M138,80 H1062 V176 H138 Z', { fill: W, w: 1.6 });
  line('M146,88 H1054 M146,168 H1054', { stroke: 'var(--gold-2)', w: 1 });
  out.push(
    <text key={out.length} x={600} y={143} textAnchor="middle" fontSize={44} fill="var(--gold)" direction="rtl" lang="ar" className={s.fade} style={delay(1.1)}>
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
        <rect x={L} y={392} width={156} height={168} fill={isNext ? 'url(#fh-glow)' : '#fbf6ea'} />
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
    <svg viewBox={`0 -120 1200 ${H}`} role="img" aria-label="Moskeens fasade med fem buer. Hver bue viser himmelen ved en av dagens bønner.">
      <defs>
        <linearGradient id="fh-stone" gradientUnits="userSpaceOnUse" x1={0} y1={-100} x2={0} y2={590}>
          <stop offset={0} stopColor="#fdf9f0" />
          <stop offset={1} stopColor="#ecdcbd" />
        </linearGradient>
        <SceneDefs mood={mood} />
        {/* deep gold leaf for the name round the arch on phones, where it sits on white */}
        <linearGradient id="fh-leaf" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#e2bd68" />
          <stop offset={0.45} stopColor="#a8772a" />
          <stop offset={0.7} stopColor="#c99a45" />
          <stop offset={1} stopColor="#7a5520" />
        </linearGradient>
        <path id="fh-name-arc" d="M-136,712 V194 C-136,-8 252,-106 600,-198 C948,-106 1336,-8 1336,194 V712" />
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
        {BAYS.map((d, i) => (
          <clipPath key={i} id={`fh-c${i}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>
      {/* the sky across the band on wide screens, inside an arch on phones */}
      <g className={s.wide}><Sky arch={false} mood={mood} /></g>
      <g className={s.narrow}><Sky arch mood={mood} /></g>
      {/* the arcade wall is solid, so the sky does not show through the lattice */}
      <rect x={138} y={176} width={924} height={404} fill={W} />
      <g className={s.wide}><Wings wall={W} /></g>
      {out}
      <Grand />
      <g className={s.wide}><Lawn arch={false} /></g>
      <g className={s.narrow}><Lawn arch /></g>
      <Pool bays={BAYS} piers={PIERS} colours={REFLECTED} />
      {/* phones: the name follows the arch round the sky, «Center» up one side, «Rahma» down the other */}
      <g className={s.narrow} aria-hidden="true">
        <text className={`${s.arcName} ${s.fade}`} style={delay(1.2)} fontSize={160} textAnchor="middle" fill="url(#fh-leaf)">
          <textPath href="#fh-name-arc" startOffset="50%">Center Rahma</textPath>
        </text>
      </g>
    </svg>
  );
}

interface Props {
  schedule: PrayerSchedule;
  /** Whether it is Friday in Oslo when the page was rendered; the browser checks again. */
  friday: boolean;
  /** Minutes past midnight in Oslo when the page was rendered, for the first sky; the browser checks again. */
  minute: number;
  /** Fixes the time of day, for previews; otherwise it follows the next prayer. */
  sky?: Mood;
}

export default function FemHimler({ schedule, friday: renderedFriday, minute: renderedMinute, sky }: Props) {
  // Nothing time-dependent is marked until the browser knows the time, so the
  // server and the first client render agree.
  const [clock, setClock] = useState<{ min: number; friday: boolean } | null>(null);
  const [badgeOn, setBadgeOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const tick = () => {
      const n = osloNow();
      setClock({ min: n.min, friday: n.friday });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // The drawing holds its first frame until the page has booted and is on screen. Otherwise a phone
  // plays it unseen: while the browser preloads the page as the address is typed or a link is about
  // to be tapped, or while a first visit is still busy starting up its scripts.
  useEffect(() => {
    let frame = 0;
    let show: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if (document.visibilityState !== 'visible' || (document as { prerendering?: boolean }).prerendering) return;
      document.removeEventListener('visibilitychange', go);
      document.removeEventListener('prerenderingchange', go);
      // two frames on, so the first frame of the drawing has been painted
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          setPlaying(true);
          // the badge waits until the arches have drawn
          show = setTimeout(() => setBadgeOn(true), 2200);
        });
      });
    };
    document.addEventListener('visibilitychange', go);
    document.addEventListener('prerenderingchange', go);
    go();
    return () => {
      document.removeEventListener('visibilitychange', go);
      document.removeEventListener('prerenderingchange', go);
      cancelAnimationFrame(frame);
      clearTimeout(show);
    };
  }, []);

  const slots = slotsFor(schedule, clock?.friday ?? renderedFriday);
  const nx = clock ? nextSlot(slots, clock.min, schedule.tomorrowFajr) : null;
  const past = slots.map((slot) => !!clock && !nx?.tomorrow && slot.at <= clock.min);
  // the sky can use the rendered minute straight away: server and first client render agree on it
  const mood = sky ?? moodOf(nx ?? nextSlot(slots, renderedMinute, schedule.tomorrowFajr));

  return (
    <section className={s.hero} data-sky={isDark(mood) ? 'dark' : 'light'} data-play={playing ? '' : undefined} aria-labelledby="forside-h1">
      {/* without scripts nothing would start the drawing, so it plays straight away */}
      <noscript>
        <style>{`.${s.hero} .${s.draw},.${s.hero} .${s.fade},.${s.hero} .${s.bay}{animation-play-state:running!important}`}</style>
      </noscript>
      {/* the name comes first, above the drawing: Corinthia in gold leaf over a flourish that draws itself
          in once. On phones it is only read out; the drawing writes it round its arch instead. */}
      <div className={s.name}>
        <h1 id="forside-h1" className={s.wordmark}>Center Rahma</h1>
        <svg className={s.flourish} viewBox="0 0 400 40" aria-hidden="true">
          <defs>
            <linearGradient id="fl-leaf" x1={0} y1={0} x2={0} y2={1}>
              <stop offset={0} stopColor="#fff4cf" />
              <stop offset={0.32} stopColor="#e9c672" />
              <stop offset={0.52} stopColor="#b7873a" />
              <stop offset={0.7} stopColor="#f1d68b" />
              <stop offset={1} stopColor="#a5762a" />
            </linearGradient>
            <linearGradient id="fl-leaf-day" x1={0} y1={0} x2={0} y2={1}>
              <stop offset={0} stopColor="#13805c" />
              <stop offset={1} stopColor="#064a35" />
            </linearGradient>
          </defs>
          <path d={SCROLL} pathLength={1} className={`${s.scroll} ${s.draw}`} style={delay(0.6)} />
          <path d={SCROLL} transform="translate(400,0) scale(-1,1)" pathLength={1} className={`${s.scroll} ${s.draw}`} style={delay(0.6)} />
          <path d={star(200, 21, 9)} className={s.leafFill} />
          <circle cx={200} cy={21} r={2.6} fill="#0b5f45" />
        </svg>
      </div>

      <div className={s.facade}>
        <Facade next={nx?.index ?? null} past={past} mood={mood} />
        <ul className={s.bays} aria-label="Bønnetider i dag">
          {slots.map((slot, i) => (
            <li
              key={slot.key}
              className={`${s.bay} ${nx?.index === i ? s.next : ''} ${past[i] ? s.past : ''}`}
              style={{
                left: pct(bayX(i) + 12, 1200),
                width: pct(156, 1200),
                top: pct(400, H, 120),
                height: pct(150, H),
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
            style={{ left: pct(bayX(nx.index) + 90, 1200), top: pct(204, H, 120) }}
          >
            Neste, {nx.tomorrow ? 'i morgen om ' : 'om '}
            {until(nx.left)}
          </span>
        )}
      </div>

      <div className={s.ctas}>
        <Link className={`${s.btn} ${s.primary}`} href="/stott-oss">Støtt oss</Link>
        <Link className={`${s.btn} ${s.quiet}`} href="/become-member">Bli medlem</Link>
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
