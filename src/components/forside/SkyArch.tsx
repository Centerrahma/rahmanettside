/* One prayer's sky, drawn inside a round arch like the mihrab's own: dawn with the last stars,
   the high sun, the low sun, sunset on the hill, and night with the crescent. */

export const SKIES = [
  { stops: [['0', '#22305b'], ['.55', '#5d6aa0'], ['1', '#f2c3b0']], hill: '#2a2f55' },
  { stops: [['0', '#6fb2e2'], ['1', '#e3f3fc']], hill: '#7fa392' },
  { stops: [['0', '#8fc0e2'], ['1', '#fbe2b0']], hill: '#a69a6a' },
  { stops: [['0', '#4b4789'], ['.55', '#d8707a'], ['1', '#f7b46c']], hill: '#3d2340' },
  { stops: [['0', '#0a1633'], ['1', '#243a6c']], hill: '#0b1226' },
];

const crescent = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r * 1.3},${r * 1.3} 0 0 1 ${cx - r},${cy} Z`;

const ARCH = 'M6,128 V54 A44,44 0 0 1 94,54 V128 Z';
const INNER = 'M12,128 V56 A38,38 0 0 1 88,56 V128';

export default function SkyArch({ i, next = false, id }: { i: number; next?: boolean; id: string }) {
  const sky = SKIES[i];
  return (
    <svg viewBox="0 0 100 130" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}-g`} x1={0} y1={0} x2={0} y2={1}>
          {sky.stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
        <clipPath id={`${id}-c`}><path d={ARCH} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        <rect x={0} y={0} width={100} height={130} fill={`url(#${id}-g)`} />
        {i === 0 && (
          <>
            {[[30, 40], [70, 32], [78, 60], [24, 70], [52, 26]].map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={1.1} fill="#fff" opacity={0.85} />)}
            <path d={crescent(62, 50, 7)} fill="#fbeed2" transform="rotate(-30 62 50)" />
          </>
        )}
        {i === 1 && (
          <>
            <circle cx={50} cy={40} r={15} fill="#fff" opacity={0.35} />
            <circle cx={50} cy={40} r={9} fill="#fff6d8" />
          </>
        )}
        {i === 2 && (
          <>
            <circle cx={68} cy={72} r={13} fill="#fff" opacity={0.3} />
            <circle cx={68} cy={72} r={8} fill="#ffe6a3" />
          </>
        )}
        {i === 3 && (
          <>
            <circle cx={44} cy={106} r={20} fill="#ffd9a0" opacity={0.35} />
            <circle cx={44} cy={106} r={12} fill="#ffd27a" />
          </>
        )}
        {i === 4 && (
          <>
            {[[22, 64], [72, 38], [80, 76], [40, 84], [56, 30], [26, 40], [66, 60]].map(([x, y], k) => <circle key={`${x},${y}`} cx={x} cy={y} r={k % 2 ? 0.9 : 1.3} fill="#fff" opacity={0.9} />)}
            <path d={crescent(36, 52, 8)} fill="#f4e5b6" transform="rotate(-30 36 52)" />
          </>
        )}
        <path d="M0,130 V112 C20,104 36,110 50,107 C66,104 80,113 100,108 V130 Z" fill={sky.hill} />
      </g>
      {/* the ivory frame with a gold line inside it, as on the mihrab; gold all round for the next prayer */}
      <path d={ARCH} fill="none" stroke={next ? '#e0b354' : '#f3ead6'} strokeWidth={next ? 4 : 3.5} strokeLinejoin="round" />
      <path d={INNER} fill="none" stroke="#c9a35b" strokeWidth={1} opacity={0.9} />
    </svg>
  );
}
