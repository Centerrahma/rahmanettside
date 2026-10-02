/* What surrounds the mosque front: a painted sky that follows the time of day, the lawn it
   stands on, a reflecting pool, and on wide screens arcaded wings either side. Drawn in the
   facade's own grid (x 0–1200, ground at y 580); anything beyond x 0–1200 lands in the sides
   of wide screens. Desktop gets the sky across the whole band (`wide`), phones get it inside
   an arch (`narrow`). Everything is static and seeded, so server and browser draw the same. */
import { memo, type CSSProperties, type ReactNode } from 'react';
import s from './forside.module.css';

const delay = (t: number) => ({ '--d': `${t.toFixed(2)}s` }) as CSSProperties;

/** Strokes that draw on once. Keys count from zero on every render, so React keeps the
    same elements when the hero re-renders and the draw-on never replays. */
function pen() {
  let k = 0;
  return function stroke(d: string, o: { fill?: string; stroke?: string; w?: number; t?: number; op?: number } = {}) {
    return (
    <path
      key={k++}
      d={d}
      fill={o.fill ?? 'none'}
      stroke={o.stroke ?? 'var(--emerald)'}
      strokeWidth={o.w ?? 1.3}
      strokeOpacity={o.op}
      strokeLinejoin="round"
      strokeLinecap="round"
      pathLength={1}
      className={s.draw}
      style={delay(o.t ?? 0.3)}
    />
    );
  };
}

/** A seeded random sequence, the same on the server and in the browser. */
function seeded(seed: number) {
  return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
}

const sparkle = (x: number, y: number, r: number) =>
  `M${x},${y - r} Q${x + r * 0.18},${y - r * 0.18} ${x + r},${y} Q${x + r * 0.18},${y + r * 0.18} ${x},${y + r} Q${x - r * 0.18},${y + r * 0.18} ${x - r},${y} Q${x - r * 0.18},${y - r * 0.18} ${x},${y - r} Z`;
const crescent = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r * 1.3},${r * 1.3} 0 0 1 ${cx - r},${cy} Z`;

/** The phones' sky: a great pointed arch behind the mosque. */
export const ARCH = 'M-60,712 V200 C-60,40 300,-40 600,-118 C900,-40 1260,40 1260,200 V712 Z';

/** The five times of day the scene can show, following the next prayer. */
export type Mood = 'night' | 'morning' | 'day' | 'afternoon' | 'dusk';

interface Palette {
  sky: [string, string, string, string];
  grass: [string, string];
  water: [string, string];
  /** how strongly the floodlights, lamps and lit windows glow, 0–1 */
  glow: number;
  stars: number;
  /** where the sun or moon sits, on the band and inside the arch; y 580 is the horizon */
  orb: { kind: 'moon' | 'sun'; band: [number, number]; arch: [number, number] };
  /** the sun's fill and outline */
  sun?: [string, string];
  clouds: boolean;
}

const PALETTES: Record<Mood, Palette> = {
  night: {
    sky: ['#060e26', '#14244d', '#2a3d6e', '#3f5385'],
    grass: ['#24523f', '#112c22'],
    water: ['#2a3d6e', '#14244d'],
    glow: 1,
    stars: 1,
    orb: { kind: 'moon', band: [1030, -70], arch: [360, 8] },
    clouds: false,
  },
  morning: {
    sky: ['#5a76b0', '#a9b9d8', '#f1cfc0', '#fbe3c4'],
    grass: ['#4f8a5e', '#2f6247'],
    water: ['#9fb8d8', '#d9e4f0'],
    glow: 0.25,
    stars: 0.15,
    orb: { kind: 'sun', band: [-110, 240], arch: [360, 24] },
    sun: ['#ffe3a8', '#f3c477'],
    clouds: true,
  },
  day: {
    sky: ['#3f8fcf', '#7db8e3', '#bfe0f4', '#e8f5fc'],
    grass: ['#5c9a62', '#3c7449'],
    water: ['#8fc4e2', '#d3ebf6'],
    glow: 0,
    stars: 0,
    orb: { kind: 'sun', band: [300, -80], arch: [360, 12] },
    sun: ['#fff6d8', '#f3d88f'],
    clouds: true,
  },
  afternoon: {
    sky: ['#5a9ccc', '#9ec8e2', '#e4e3cf', '#f8dfb0'],
    grass: ['#5a9058', '#3a6c43'],
    water: ['#9cc3d8', '#e6eadc'],
    glow: 0,
    stars: 0,
    orb: { kind: 'sun', band: [1030, -70], arch: [850, 20] },
    sun: ['#ffeec4', '#f1cf85'],
    clouds: true,
  },
  dusk: {
    sky: ['#232a63', '#6b4f86', '#d77d76', '#f6b26b'],
    grass: ['#2f5a45', '#183829'],
    water: ['#6b5a8a', '#2d2f5e'],
    glow: 0.85,
    stars: 0.35,
    orb: { kind: 'sun', band: [1300, 250], arch: [860, 30] },
    sun: ['#ffc27a', '#ef9c4f'],
    clouds: false,
  },
};

/** Whether the sky is dark enough for light lettering on the name plaque. */
export const isDark = (mood: Mood) => mood === 'night' || mood === 'dusk';

/** Gradients the scene shares, coloured for the time of day; rendered inside the facade's <defs>.
    The colours are set as styles so they ease from one time of day to the next (see .stop). */
export function SceneDefs({ mood }: { mood: Mood }) {
  const p = PALETTES[mood];
  return (
    <>
      <linearGradient id="nt-sky" x1={0} y1={0} x2={0} y2={1}>
        {[0, 0.55, 0.85, 1].map((o, i) => <stop key={o} offset={o} className={s.stop} style={{ stopColor: p.sky[i] }} />)}
      </linearGradient>
      <radialGradient id="nt-moon" cx={0.5} cy={0.5} r={0.5}>
        <stop offset={0} className={s.stop} style={{ stopColor: p.orb.kind === 'moon' ? '#fff3c9' : '#fff6d8', stopOpacity: p.orb.kind === 'moon' ? 0.45 : 0.7 }} />
        <stop offset={1} className={s.stop} style={{ stopColor: "#fff3c9", stopOpacity: 0 }} />
      </radialGradient>
      <linearGradient id="nt-grass" x1={0} y1={0} x2={0} y2={1}>
        <stop offset={0} className={s.stop} style={{ stopColor: p.grass[0] }} />
        <stop offset={1} className={s.stop} style={{ stopColor: p.grass[1] }} />
      </linearGradient>
      <radialGradient id="nt-flood" cx={0.5} cy={1} r={1}>
        <stop offset={0} className={s.stop} style={{ stopColor: "#ffd88a", stopOpacity: 0.55 * p.glow }} />
        <stop offset={1} className={s.stop} style={{ stopColor: "#ffd88a", stopOpacity: 0 }} />
      </radialGradient>
      <linearGradient id="nt-lit" x1={0} y1={0} x2={0} y2={1}>
        <stop offset={0} className={s.stop} style={{ stopColor: p.glow > 0.5 ? '#ffe9b8' : '#efe6d3' }} />
        <stop offset={1} className={s.stop} style={{ stopColor: p.glow > 0.5 ? '#f2c06c' : '#d9c8a6' }} />
      </linearGradient>
      <linearGradient id="nt-water" x1={0} y1={0} x2={0} y2={1}>
        <stop offset={0} className={s.stop} style={{ stopColor: p.water[0] }} />
        <stop offset={1} className={s.stop} style={{ stopColor: p.water[1] }} />
      </linearGradient>
      <clipPath id="nt-arch"><path d={ARCH} /></clipPath>
      <clipPath id="nt-pool"><path d="M40,594 H1160 L1180,690 H20 Z" /></clipPath>
      <clipPath id="nt-above"><rect x={-2000} y={-1000} width={5200} height={1582} /></clipPath>
    </>
  );
}

const cloud = (x: number, y: number, w: number) =>
  `M${x},${y} H${x + w} a${w * 0.16},${w * 0.16} 0 0,0 ${-w * 0.22},${-w * 0.16} a${w * 0.22},${w * 0.22} 0 0,0 ${-w * 0.4},${-w * 0.06} a${w * 0.16},${w * 0.16} 0 0,0 ${-w * 0.28},${w * 0.12} a${w * 0.1},${w * 0.1} 0 0,0 ${-w * 0.1},${w * 0.1} Z`;

/** Stars and a faint Milky Way (fewer as the light comes), the moon or the sun, and clouds by day,
    across the band or inside the arch. */
export const Sky = memo(function Sky({ arch, mood }: { arch: boolean; mood: Mood }) {
  const pal = PALETTES[mood];
  const rnd = seeded(11);
  const area = arch ? { x0: -60, x1: 1260, y0: -118, y1: 560 } : { x0: -1400, x1: 2600, y0: -560, y1: 560 };
  const stars: ReactNode[] = [];
  const total = Math.round((arch ? 200 : 380) * pal.stars);
  for (let i = 0; i < total; i++) {
    const x = area.x0 + rnd() * (area.x1 - area.x0);
    // with only a few stars left (dawn, dusk), keep them high in the sky
    const y = area.y0 + rnd() * (area.y1 - area.y0) * (pal.stars < 1 ? 0.45 : 1);
    const r = rnd();
    stars.push(
      r > 0.95
        ? <path key={i} d={sparkle(x, y, 4 + rnd() * 5)} fill="#f6e7b8" opacity={0.95} />
        : <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(0.6 + rnd() * 1.3).toFixed(2)} fill="#fff" opacity={(0.35 + rnd() * 0.6).toFixed(2)} />,
    );
  }
  const milky: ReactNode[] = [];
  if (mood === 'night') {
    for (let i = 0; i < 220; i++) {
      const t = rnd();
      const x = area.x0 + t * (area.x1 - area.x0);
      const y = area.y0 + 60 + t * 260 + (rnd() - 0.5) * 120;
      milky.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(0.4 + rnd() * 0.7).toFixed(2)} fill="#fff" opacity={(0.15 + rnd() * 0.3).toFixed(2)} />);
    }
  }
  const [ox, oy] = arch ? pal.orb.arch : pal.orb.band;
  const p = pen();
  return (
    <>
      <g clipPath={arch ? 'url(#nt-arch)' : undefined}>
        {arch ? <path d={ARCH} fill="url(#nt-sky)" /> : <rect x={-1400} y={-1200} width={4000} height={1912} fill="url(#nt-sky)" />}
        {milky.length > 0 && <g className={s.fade} style={delay(0.4)}>{milky}</g>}
        {stars.length > 0 && <g className={s.fade} style={delay(0.8)}>{stars}</g>}
        <circle cx={ox} cy={oy} r={pal.orb.kind === 'moon' ? 70 : 90} fill="url(#nt-moon)" />
        {pal.orb.kind === 'moon'
          ? p(crescent(ox, oy, 24), { fill: '#fbf0cf', stroke: '#f1dc9c', w: 1, t: 1.2 })
          : p(`M${ox + 26},${oy} a26,26 0 1,0 0.01,0`, { fill: pal.sun?.[0], stroke: pal.sun?.[1], w: 1.2, t: 1.2 })}
        {pal.clouds && (
          <g className={s.fade} style={delay(1.3)}>
            {[[-330, -20, 150], [1290, 30, 120], [330, -80, 90], [820, -96, 80], [-700, 60, 130], [1600, -40, 110]].map(([x, y, w]) => (
              <path key={`${x},${y}`} d={cloud(x, y, w)} fill="#fff" fillOpacity={0.9} />
            ))}
          </g>
        )}
      </g>
      {arch && p('M-60,712 V200 C-60,40 300,-40 600,-118 C900,-40 1260,40 1260,200 V712', { stroke: 'var(--gold)', w: 1.6, t: 0.2 })}
      {arch && p('M-74,712 V198 C-74,32 292,-52 600,-132 C908,-52 1274,32 1274,198 V712', { w: 1.4, t: 0.25 })}
    </>
  );
});

/** Wide screens only: two arcaded wings and a domed corner pavilion each side of the minarets. */
export const Wings = memo(function Wings({ wall }: { wall: string }) {
  const p = pen();
  const side = (m: 1 | -1) => {
    // the left wing is drawn at x < 0; the right one mirrors it
    const X = (x: number) => (m === -1 ? x : 1200 - x);
    const span = (a: number, b: number) => [X(a), X(b)].sort((u, v) => u - v);
    const out: ReactNode[] = [];
    const [w0, w1] = span(-205, 60);
    out.push(<rect key="wall" x={w0} y={330} width={w1 - w0} height={250} fill={wall} />);
    out.push(p(`M${X(60)},330 H${X(-205)} V580`, { w: 1.5, t: 0.4 }));
    let cren = '';
    for (let x = -205; x < 60; x += 14) cren += `M${X(x + 1)},330 V323 L${X(x + 7)},316 L${X(x + 13)},323 V330 `;
    out.push(p(cren, { w: 1, t: 0.5 }));
    out.push(p(`M${X(40)},344 H${X(-205)} M${X(40)},370 H${X(-205)}`, { stroke: 'var(--gold-2)', w: 1, t: 0.55 }));
    [[-95, -25], [-180, -110]].forEach(([a, b], i) => {
      const [l, r] = span(a, b);
      const c = (l + r) / 2;
      const d = `M${l},580 V450 C${l},420 ${c - 18},404 ${c},388 C${c + 18},404 ${r},420 ${r},450 V580 Z`;
      out.push(<path key={`lit${i}`} d={d} fill="url(#nt-lit)" className={s.fade} style={delay(1.1)} />);
      out.push(p(d, { w: 1.5, t: 0.6 + i * 0.08 }));
      out.push(p(`M${c},392 V430 M${c - 7},436 C${c - 7},430 ${c - 3},428 ${c},427 C${c + 3},428 ${c + 7},430 ${c + 7},436 Z M${c - 8},436 H${c + 8} L${c + 10},452 L${c + 4},462 H${c - 4} L${c - 10},452 Z`, { stroke: 'var(--gold)', fill: '#fff1c9', w: 1, t: 1.2 }));
    });
    const t = X(-240);
    const win = `M${t - 14},420 V372 C${t - 14},360 ${t - 6},352 ${t},348 C${t + 6},352 ${t + 14},360 ${t + 14},372 V420 Z`;
    out.push(<rect key="tower" x={t - 36} y={300} width={72} height={280} fill={wall} />);
    out.push(p(`M${t - 36},580 V300 H${t + 36} V580 M${t - 40},300 H${t + 40} M${t - 40},292 H${t + 40}`, { w: 1.5, t: 0.45 }));
    out.push(p(`M${t - 32},292 C${t - 38},262 ${t - 18},238 ${t},226 C${t + 18},238 ${t + 38},262 ${t + 32},292 Z`, { fill: 'var(--mint)', w: 1.4, t: 0.5 }));
    out.push(p(`M${t},226 V214`, { w: 1.1, t: 0.6 }));
    out.push(p(crescent(t, 209, 4.5), { fill: 'var(--gold)', stroke: 'var(--gold)', w: 1, t: 0.65 }));
    out.push(<path key="twin" d={win} fill="url(#nt-lit)" />);
    out.push(p(win, { w: 1.2, t: 0.7 }));
    out.push(p(`M${t - 30},500 H${t + 30} M${t - 30},506 H${t + 30}`, { w: 1.1, t: 0.7 }));
    return out;
  };
  return (
    <>
      <g>{side(-1)}</g>
      <g>{side(1)}</g>
    </>
  );
});

/** The grand details on the front itself: dome ribs and band, second balconies, a zellige dado. */
export const Grand = memo(function Grand() {
  const p = pen();
  const tiles: ReactNode[] = [];
  for (let x = 138, i = 0; x < 1062; x += 16, i++) {
    const cx = x + 8;
    let d = '';
    for (let j = 0; j < 16; j++) {
      const a = -Math.PI / 2 + (j * Math.PI) / 8;
      const r = j % 2 ? 4.6 : 6;
      d += `${j ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(570 + r * Math.sin(a)).toFixed(1)}`;
    }
    tiles.push(<path key={x} d={d + 'Z'} fill={i % 2 ? 'var(--mint)' : '#f6e7c4'} stroke={i % 2 ? 'var(--emerald)' : 'var(--gold)'} strokeWidth={0.7} />);
  }
  return (
    <>
      {p('M138,562 H1062 M138,578 H1062', { w: 1, t: 0.7 })}
      <g className={s.fade} style={delay(1)}>{tiles}</g>
      {[90, 1110].map((x) => p(`M${x - 30},410 H${x + 30} M${x - 28},418 H${x + 28} M${x - 26},418 L${x - 18},428 M${x + 26},418 L${x + 18},428 M${x - 10},418 V426 M${x + 10},418 V426`, { w: 1.2, t: 0.8 }))}
      {p('M522,24 H678 M526,18 H674', { stroke: 'var(--gold)', w: 1, t: 0.9 })}
      {p('M600,-90 C580,-50 556,-6 548,30 M600,-90 C620,-50 644,-6 652,30 M600,-90 C570,-50 536,-10 528,30 M600,-90 C630,-50 664,-10 672,30', { w: 0.9, op: 0.3, t: 0.9 })}
    </>
  );
});

const bush = (x: number, y: number, r: number) =>
  `M${x - r},${y} a${r},${r * 0.8} 0 0,1 ${r * 0.9},${-r * 0.7} a${r * 0.8},${r * 0.8} 0 0,1 ${r * 1.2},${r * 0.1} a${r * 0.6},${r * 0.6} 0 0,1 ${r * 0.9},${r * 0.6} Z`;

/** The lawn, across the band or inside the arch, with grass tufts and bushes. */
export const Lawn = memo(function Lawn({ arch }: { arch: boolean }) {
  const rnd = seeded(3);
  const [x0, x1] = arch ? [-60, 1260] : [-1400, 2600];
  let tufts = '';
  for (let x = x0; x < x1; x += 14 + rnd() * 18) {
    const y = 586 + rnd() * 4;
    tufts += `M${x.toFixed(0)},${y.toFixed(0)} l2,-${(5 + rnd() * 5).toFixed(0)} l2,${(5 + rnd() * 3).toFixed(0)} l2,-${(6 + rnd() * 6).toFixed(0)} l2,${(6 + rnd() * 4).toFixed(0)} `;
  }
  for (let i = 0; i < (arch ? 60 : 160); i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = 600 + rnd() * 105;
    if (x > 30 && x < 1170 && y < 694) continue; // not on the pool
    tufts += `M${x.toFixed(0)},${y.toFixed(0)} l2,-6 l2,6 l2,-8 l2,8 `;
  }
  const bushes = [[-30, 588, 30], [1230, 588, 30], [-330, 590, 44], [1530, 590, 44], [-470, 588, 34], [1670, 588, 34], [10, 704, 26], [1190, 704, 26], [-420, 704, 30], [1620, 704, 30]]
    .filter(([x]) => !arch || (x > -50 && x < 1250));
  return (
    <g clipPath={arch ? 'url(#nt-arch)' : undefined}>
      <rect x={x0} y={582} width={x1 - x0} height={130} fill="url(#nt-grass)" className={s.fade} style={delay(0.3)} />
      <path d={tufts} fill="none" stroke="#4f9478" strokeWidth={1} strokeLinejoin="round" className={s.fade} style={delay(0.9)} />
      <g className={s.fade} style={delay(0.8)}>
        {bushes.map(([x, y, r]) => <path key={`${x},${y}`} d={bush(x, y, r)} fill="#1b4536" stroke="#3f7f64" strokeWidth={1} />)}
      </g>
    </g>
  );
});

/** Warm floodlight up the wall at every pier and minaret, the pool with the arcade mirrored
    in it, and lamp posts at its corners. `bays` are the five arch paths. */
export const Pool = memo(function Pool({ bays, piers, colours }: { bays: string[]; piers: number[]; colours: string[] }) {
  const p = pen();
  const posts = [[34, 600], [1166, 600], [10, 690], [1190, 690]];
  const far = [[-290, 690], [1490, 690], [-420, 690], [1620, 690]];
  const lamp = (x: number, y: number) => (
    <g key={`${x},${y}`}>
      <circle cx={x} cy={y - 26} r={22} fill="url(#nt-flood)" className={s.fade} style={delay(1.5)} />
      {p(`M${x},${y} V${y - 20} M${x - 5},${y} H${x + 5}`, { stroke: '#c9a35b', w: 1.4, t: 1.2 })}
      {p(`M${x - 5},${y - 20} H${x + 5} L${x + 6},${y - 30} L${x},${y - 36} L${x - 6},${y - 30} Z`, { fill: '#ffe8b0', stroke: '#c9a35b', w: 1, t: 1.3 })}
    </g>
  );
  return (
    <>
      <g clipPath="url(#nt-above)" className={s.fade} style={delay(1.4)}>
        {piers.map((x) => <ellipse key={x} cx={x} cy={580} rx={34} ry={120} fill="url(#nt-flood)" />)}
        {[90, 1110].map((x) => <ellipse key={x} cx={x} cy={580} rx={30} ry={150} fill="url(#nt-flood)" />)}
      </g>
      <path d="M40,594 H1160 L1180,690 H20 Z" fill="url(#nt-water)" className={s.fade} style={delay(0.6)} />
      <g clipPath="url(#nt-pool)" className={s.fade} style={delay(1.2)}>
        <g transform="matrix(1,0,0,-0.3,0,768)">
          {bays.map((d, i) => <path key={i} d={d} fill={colours[i]} fillOpacity={0.32} stroke="var(--emerald)" strokeOpacity={0.45} />)}
          <path d="M72,580 V56 H108 V580 M1092,580 V56 H1128 V580 M138,580 V80 H1062 V580" fill="none" stroke="var(--emerald)" strokeOpacity={0.4} />
        </g>
      </g>
      {p('M40,594 H1160 L1180,690 H20 Z', { w: 1.3, t: 0.5 })}
      {p('M220,624 H330 M520,640 H660 M840,622 H950 M380,664 H480 M700,670 H820 M110,650 H170 M1030,652 H1100', { stroke: '#fff', w: 2.4, t: 1.4 })}
      {posts.map(([x, y]) => lamp(x, y))}
      <g className={s.wide}>{far.map(([x, y]) => lamp(x, y))}</g>
    </>
  );
});
