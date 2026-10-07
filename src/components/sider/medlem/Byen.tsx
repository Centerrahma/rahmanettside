/* Bli medlem: Oslo at dusk, the hills behind, blocks and houses with lit windows, and the mosque in
   the middle. Gold threads run from windows all over the city to the dome: every light a member.
   The title sits in the sky. Grid 1400 × 600; phones see the middle 700. */
import type { CSSProperties, ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';
import { arch, crescent, delay, n1, onion, pen, seeded } from '../kit';
import m from './medlem.module.css';

const W = 1400;
const H = 600;
const GROUND = 560;
const DOME_TOP: [number, number] = [700, 352];

interface Lit { x: number; y: number }

/** The city: blocks, houses and trees on either side of the mosque, and the windows that are lit. */
function city() {
  const rnd = seeded(11);
  const back: ReactNode[] = [];
  const front: ReactNode[] = [];
  const lit: Lit[] = [];
  const win = (x: number, y: number, w: number, h: number, key: string, into: ReactNode[], chance: number) => {
    const on = rnd() < chance;
    if (on) lit.push({ x: x + w / 2, y: y + h / 2 });
    into.push(<rect key={key} x={n1(x)} y={n1(y)} width={w} height={h} fill={on ? '#ffd27a' : '#454a7e'} />);
  };
  // the back row: apartment blocks
  for (let x = -10; x < W; ) {
    const w = 50 + rnd() * 60;
    const h = 60 + rnd() * 90;
    if (x + w > 500 && x < 900) { x = 900; continue; }
    const y = GROUND - 26 - h;
    back.push(<rect key={`b${x}`} x={n1(x)} y={n1(y)} width={n1(w)} height={n1(h + 26)} fill="#2b2d5c" />);
    for (let wy = y + 10; wy < GROUND - 34; wy += 15) for (let wx = x + 8; wx < x + w - 10; wx += 13) win(wx, wy, 6, 8, `bw${wx},${wy}`, back, 0.22);
    x += w + 6 + rnd() * 18;
  }
  // the front row: houses with pitched roofs, and trees between them
  for (let x = -20; x < W; ) {
    const w = 46 + rnd() * 30;
    if (x + w > 540 && x < 860) { x = 860; continue; }
    const h = 26 + rnd() * 16;
    const y = GROUND - h;
    front.push(<path key={`h${x}`} d={`M${n1(x)},${GROUND} V${n1(y)} L${n1(x + w / 2)},${n1(y - 20)} L${n1(x + w)},${n1(y)} V${GROUND} Z`} fill="#20224a" />);
    win(x + 8, y + 8, 8, 9, `hw1${x}`, front, 0.55);
    win(x + w - 16, y + 8, 8, 9, `hw2${x}`, front, 0.55);
    x += w + 4;
    if (rnd() < 0.6) {
      const r = 12 + rnd() * 10;
      front.push(<circle key={`t${x}`} cx={n1(x + r)} cy={n1(GROUND - r * 1.1)} r={n1(r)} fill="#1a2a40" />);
      x += r * 2 + 4;
    }
  }
  return { back, front, lit };
}

function Mosque() {
  const { out, line, add } = pen();
  const st = { stroke: '#b98a3c', w: 1.1 };
  add(<ellipse cx={700} cy={500} rx={260} ry={150} fill="url(#by-warm)" className={f.fade} style={delay(0.4)} />);
  // the minarets
  [598, 802].forEach((x, i) => {
    line(`M${x - 10},${GROUND} V392 H${x + 10} V${GROUND} Z`, { fill: 'url(#by-stone)', ...st, t: 0.3 + i * 0.1 });
    line(`M${x - 15},404 h30 v6 h-30 Z M${x - 13},458 h26 v5 h-26 Z`, { fill: '#f3e3c1', ...st, t: 0.5 });
    line(`M${x - 10},392 L${x},350 L${x + 10},392 Z`, { fill: '#0b6a4c', ...st, t: 0.6 });
    line(`M${x},350 V340`, { ...st, t: 0.7 });
    add(<path d={arch(x - 4, x + 4, 430, 422, 444, true)} fill="#ffd27a" className={f.fade} style={delay(1)} />);
  });
  // the hall and its dome
  line(`M624,${GROUND} V488 H776 V${GROUND} Z`, { fill: 'url(#by-stone)', ...st, t: 0.2 });
  line('M618,488 H782 V480 H618 Z', { fill: '#f3e3c1', ...st, t: 0.3 });
  line(onion(700, 480, 112, 72), { fill: 'url(#by-dome)', ...st, t: 0.35 });
  line(`M700,408 V396`, { ...st, t: 0.6 });
  line(crescent(700, 390, 6), { fill: '#f3d58a', stroke: 'none', t: 0.7 });
  [646, 676, 724, 754].forEach((x) => add(<path key={x} d={arch(x - 7, x + 7, 512, 498, 536, true)} fill="#ffd27a" className={f.fade} style={delay(1)} />));
  line(arch(686, 714, 520, 500, GROUND, true), { fill: '#ffe2a0', ...st, t: 0.6 });
  return out;
}

function Scene() {
  const { back, front, lit } = city();
  const rnd = seeded(3);
  const stars: ReactNode[] = [];
  for (let i = 0; i < 130; i++) {
    stars.push(<circle key={i} cx={n1(rnd() * W)} cy={n1(rnd() * 300)} r={n1(0.5 + rnd() * 1.1)} fill="#fff" opacity={n1(0.25 + rnd() * 0.55)} />);
  }
  // threads from a spread of lit windows to the dome
  const picked = lit.filter((_, i) => i % 3 === 0).slice(0, 26);
  const threads = picked.map((p, i) => {
    const [dx, dy] = DOME_TOP;
    const cx = (p.x + dx) / 2;
    const cy = Math.min(p.y, dy) - 70 - Math.abs(p.x - dx) * 0.12;
    return (
      <g key={i}>
        <path d={`M${n1(p.x)},${n1(p.y)} Q${n1(cx)},${n1(cy)} ${dx},${dy}`} fill="none" stroke="#f3d58a" strokeWidth={1} strokeOpacity={0.7} pathLength={1} className={f.draw} style={delay(1.4 + (i % 9) * 0.12)} />
        <circle cx={n1(p.x)} cy={n1(p.y)} r={2.6} fill="#fff1c4" className={f.fade} style={delay(1.4)} />
      </g>
    );
  });
  return (
    <>
      <rect width={W} height={GROUND} fill="url(#by-sky)" />
      <circle cx={700} cy={560} r={720} fill="url(#by-sunset)" />
      <g className={f.fade} style={delay(0.4)}>{stars}</g>
      <circle cx={1150} cy={120} r={70} fill="url(#by-moonglow)" className={f.fade} style={delay(0.6)} />
      <path d={crescent(1150, 120, 26)} transform="rotate(-35 1150 120)" fill="#fff3c9" className={f.fade} style={delay(0.6)} />
      {/* far hills */}
      <path d={`M0,440 C120,420 220,392 300,398 C380,404 460,430 560,428 C700,424 820,404 960,410 C1100,416 1220,436 1400,424 V${GROUND} H0 Z`} fill="#5b5287" opacity={0.75} />
      <path d={`M0,486 C160,470 300,474 420,488 C560,504 640,470 760,474 C900,478 1040,500 1180,488 C1280,480 1350,476 1400,480 V${GROUND} H0 Z`} fill="#3d3a6e" />
      {back}
      <g transform="translate(700,560) scale(1.38) translate(-700,-560)">
        <Mosque />
      </g>
      {front}
      {threads}
      <rect y={GROUND} width={W} height={H - GROUND} fill="url(#by-ground)" />
      <path d={`M0,${GROUND} H${W}`} stroke="#3d3a6e" strokeWidth={2} />
    </>
  );
}

const Defs = () => (
  <defs>
    <linearGradient id="by-sky" x1={0} y1={0} x2={0} y2={1}>
      <stop offset={0} stopColor="#232a63" />
      <stop offset={0.55} stopColor="#6b4f86" />
      <stop offset={0.85} stopColor="#d77d76" />
      <stop offset={1} stopColor="#f6b26b" />
    </linearGradient>
    <radialGradient id="by-sunset">
      <stop offset={0} stopColor="#ffd59a" stopOpacity={0.55} />
      <stop offset={0.5} stopColor="#f6a77a" stopOpacity={0.2} />
      <stop offset={1} stopColor="#f6a77a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="by-moonglow">
      <stop offset={0} stopColor="#fff3c9" stopOpacity={0.45} />
      <stop offset={1} stopColor="#fff3c9" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="by-warm">
      <stop offset={0} stopColor="#ffe2a0" stopOpacity={0.55} />
      <stop offset={1} stopColor="#ffe2a0" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="by-stone" x1={0} y1={0} x2={0} y2={1}>
      <stop offset={0} stopColor="#fff8ea" />
      <stop offset={1} stopColor="#ecd9b4" />
    </linearGradient>
    <linearGradient id="by-dome" x1={0} y1={0} x2={1} y2={0}>
      <stop offset={0} stopColor="#d9b56b" />
      <stop offset={0.45} stopColor="#fbe7b0" />
      <stop offset={1} stopColor="#c69a4a" />
    </linearGradient>
    <linearGradient id="by-ground" x1={0} y1={0} x2={0} y2={1}>
      <stop offset={0} stopColor="#1d2148" />
      <stop offset={1} stopColor="#151836" />
    </linearGradient>
  </defs>
);

/** The scene with the title in its sky. Phones crop it to the middle, round the mosque. */
export default function Byen() {
  return (
    <div className={m.scene} style={{ '--ar': W / H, '--cw': W / 700, '--cx': 350 / 700 } as CSSProperties}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Oslo i skumringen med åsene bak, opplyste vinduer over hele byen og gylne tråder fra vinduene til moskeens kuppel">
        <Defs />
        <Scene />
      </svg>
      <div className={`${m.sky} ${f.fade}`} style={delay(0.8)}>
        <h1>Bli medlem</h1>
      </div>
    </div>
  );
}
