import { starPoints } from './stjerne';
import s from './portalen.module.css';

/** Pointed (Ottoman) arch window between x0 and x1, springing at ys and resting on yb. */
function archWindow(x0: number, x1: number, ys: number, yb: number) {
  const w = x1 - x0;
  const mid = x0 + w / 2;
  const apex = ys - w * 0.78;
  return `M${x0} ${yb}V${ys}C${x0} ${ys - w * 0.42} ${mid - w * 0.12} ${apex + w * 0.18} ${mid} ${apex}C${mid + w * 0.12} ${apex + w * 0.18} ${x1} ${ys - w * 0.42} ${x1} ${ys}V${yb}Z`;
}

const gold = '#d9b46a';
const deep = '#b08a45';

/** A brass lantern drawn in SVG; its windows warm up once as the page loads. */
export default function Lykt() {
  const panels: [number, number][] = [[112, 146], [160, 240], [254, 288]];
  return (
    <svg className={s.lantern} viewBox="0 0 400 780" aria-hidden="true">
      <defs>
        <pattern id="lykt-fret" width="26" height="26" patternUnits="userSpaceOnUse">
          <polygon points={starPoints(13, 13, 13)} fill="none" stroke={deep} strokeWidth="1.6" />
          <polygon points={starPoints(13, 13, 5.5, 22.5)} fill="none" stroke={deep} strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* chain */}
      <g fill="none" stroke={gold} strokeWidth="3.4">
        {Array.from({ length: 6 }, (_, i) => (
          i % 2 === 0
            ? <ellipse key={i} cx="200" cy={-6 + i * 18} rx="6" ry="11" />
            : <line key={i} x1="200" y1={-6 + i * 18 - 9} x2="200" y2={-6 + i * 18 + 9} />
        ))}
        <circle cx="200" cy="112" r="11" />
      </g>

      {/* dome and finial */}
      <path d="M200 124 L208 142 C232 176 290 188 296 246 H104 C110 188 168 176 192 142 Z" fill="#0d4d40" stroke={gold} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M150 210 C170 196 190 186 200 160 C210 186 230 196 250 210" fill="none" stroke={deep} strokeWidth="2.2" />
      <rect x="92" y="246" width="216" height="22" fill={gold} />
      <path d="M92 268 h216 l-8 12 h-200 Z" fill={deep} />

      {/* body: three panels, centre one facing us */}
      <path d="M100 280 H300 L292 580 H108 Z" fill="#0b3f35" stroke={gold} strokeWidth="3.4" strokeLinejoin="round" />
      <line x1="150" y1="280" x2="152" y2="580" stroke={gold} strokeWidth="3" />
      <line x1="250" y1="280" x2="248" y2="580" stroke={gold} strokeWidth="3" />
      {panels.map(([x0, x1], i) => {
        const d = archWindow(x0, x1, i === 1 ? 372 : 384, 556);
        return (
          <g key={i}>
            <path d={d} className={s.glow} fill="#f3d491" />
            <path d={d} fill="url(#lykt-fret)" />
            <path d={d} fill="none" stroke={gold} strokeWidth="2.6" />
          </g>
        );
      })}

      {/* base and drop */}
      <rect x="100" y="580" width="200" height="20" fill={gold} />
      <path d="M108 600 H292 C280 640 236 668 200 676 C164 668 120 640 108 600 Z" fill="#0d4d40" stroke={gold} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M150 620 C176 640 224 640 250 620" fill="none" stroke={deep} strokeWidth="2.2" />
      <path d="M200 676 C210 694 210 712 200 730 C190 712 190 694 200 676 Z" fill={gold} />
      <circle cx="200" cy="742" r="7" fill={gold} />
    </svg>
  );
}
