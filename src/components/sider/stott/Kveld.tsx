/* The evening around the Støtt oss portals: a dusk sky with a few stars and long pink clouds, and on
   wide screens the courtyard's arcades running off either side under small domes. Drawn on the
   front page's scenery grid (x 0–1200, ground at y 580); the portals' drawing moves it into place.
   The sky's colours (#nt-sky) come from SceneDefs mood "dusk"; the rest from KveldDefs. */
import { memo, type ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';
import { arch, delay, hemi, pen, seeded } from '../kit';

/** The stone, dome, glass and glow every drawing on the page shares. */
export function KveldDefs() {
  return (
    <>
      <linearGradient id="kv-stone" gradientUnits="userSpaceOnUse" x1={0} y1={-100} x2={0} y2={630}>
        <stop offset={0} stopColor="#fdf6ea" />
        <stop offset={1} stopColor="#ead6b4" />
      </linearGradient>
      <linearGradient id="kv-shaft" x1={0} y1={0} x2={1} y2={0}>
        <stop offset={0} stopColor="#e6d6b8" />
        <stop offset={0.45} stopColor="#fdf9f0" />
        <stop offset={1} stopColor="#dcc7a2" />
      </linearGradient>
      <linearGradient id="kv-dome" x1={0} y1={0} x2={1} y2={0}>
        <stop offset={0} stopColor="#b9d4c9" />
        <stop offset={0.4} stopColor="#eaf5f0" />
        <stop offset={1} stopColor="#a3c4b6" />
      </linearGradient>
      <linearGradient id="kv-lit" x1={0} y1={0} x2={0} y2={1}>
        <stop offset={0} stopColor="#fff5dc" />
        <stop offset={1} stopColor="#f6d090" />
      </linearGradient>
      <radialGradient id="kv-glow" cx={0.5} cy={0.5} r={0.5}>
        <stop offset={0} stopColor="#fffaf0" stopOpacity={0.85} />
        <stop offset={1} stopColor="#fffaf0" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="kv-sunset" cx={0.5} cy={0.5} r={0.5}>
        <stop offset={0} stopColor="#ffd59a" stopOpacity={0.8} />
        <stop offset={0.5} stopColor="#f6a77a" stopOpacity={0.3} />
        <stop offset={1} stopColor="#f6a77a" stopOpacity={0} />
      </radialGradient>
    </>
  );
}

const streak = (x: number, y: number, w: number) =>
  `M${x},${y} C${x + w * 0.2},${y - 9} ${x + w * 0.7},${y - 10} ${x + w},${y - 2} C${x + w * 0.7},${y + 4} ${x + w * 0.25},${y + 5} ${x},${y} Z`;

/** The dusk sky, far wider than the drawing so it fills wide screens. */
export const Sky = memo(function Sky() {
  const rnd = seeded(5);
  const stars: ReactNode[] = [];
  for (let i = 0; i < 140; i++) {
    const x = -1500 + rnd() * 4200;
    const y = -700 + rnd() * 560;
    stars.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(0.5 + rnd() * 1.1).toFixed(2)} fill="#fff" opacity={(0.25 + rnd() * 0.5).toFixed(2)} />);
  }
  return (
    <>
      <rect x={-2000} y={-1000} width={5400} height={1584} fill="url(#nt-sky)" />
      <circle cx={600} cy={300} r={700} fill="url(#kv-sunset)" className={f.fade} style={delay(0.2)} />
      <g className={f.fade} style={delay(0.6)}>{stars}</g>
      <g className={f.fade} style={delay(0.9)}>
        {[[-700, 120, 420], [-260, 60, 260], [820, 40, 300], [1320, 110, 380], [1700, 30, 260], [-420, 260, 340], [1450, 250, 300]].map(([x, y, w]) => (
          <path key={`${x},${y}`} d={streak(x, y, w)} fill="#f7c6a3" fillOpacity={0.35} />
        ))}
      </g>
    </>
  );
});

/** The courtyard arcades either side, under a row of small domes: only seen on wide screens. */
export const Riwaq = memo(function Riwaq() {
  const { out, line, add } = pen();
  [-1, 1].forEach((m) => {
    const X = (x: number) => (m === -1 ? x : 1200 - x);
    const [a, b] = [X(-60), X(-760)].sort((u, v) => u - v);
    add(<rect x={a} y={420} width={b - a} height={160} fill="url(#kv-stone)" />);
    line(`M${X(-60)},420 H${X(-760)}`, { w: 1.4, t: 0.4 });
    for (let x = -120; x > -760; x -= 90) {
      const cx = X(x);
      line(hemi(cx, 420, 70, 30), { fill: 'url(#kv-dome)', w: 1.1, t: 0.5 });
      line(`M${cx},390 V382`, { w: 0.9, t: 0.6 });
      const d = arch(cx - 30, cx + 30, 480, 448, 580, true);
      add(<path d={d} fill="url(#kv-lit)" className={f.fade} style={delay(1.1)} />);
      line(d, { w: 1.2, t: 0.55 });
    }
  });
  return <>{out}</>;
});
