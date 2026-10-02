/* Drawing helpers for the Støtt oss and Kontakt drawings: the same line style as the
   mosque front on the front page, drawn on once at load. */
import type { CSSProperties, ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';

export const delay = (d: number | string) => ({ '--d': `${d}s` }) as CSSProperties;

export const star = (cx: number, cy: number, r0: number) => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? r0 * 0.7654 : r0;
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};

export const crescent = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r * 1.3},${r * 1.3} 0 0 1 ${cx - r},${cy} Z`;

/** A pointed arch from x0 to x1 that springs at `spring`, peaks at `top` and runs down to `yb`. */
export const arch = (x0: number, x1: number, spring: number, top: number, yb: number, close = false) => {
  const c = (x0 + x1) / 2;
  const h = spring - top;
  const k = (x1 - x0) / 2;
  return `M${x0},${yb} V${spring} C${x0},${spring - h * 0.62} ${c - k * 0.36},${top + h * 0.3} ${c},${top} C${c + k * 0.36},${top + h * 0.3} ${x1},${spring - h * 0.62} ${x1},${spring} V${yb}${close ? ' Z' : ''}`;
};

interface LineProps { d: string; w?: number; fill?: string; stroke?: string; t?: number; op?: number }

/** One stroke that draws itself on, `t` seconds after load. */
export function Line({ d, w = 1.5, fill = 'none', stroke = 'var(--emerald)', t = 0.1, op }: LineProps) {
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={w}
      strokeOpacity={op}
      strokeLinejoin="round"
      strokeLinecap="round"
      pathLength={1}
      className={f.draw}
      style={delay(t.toFixed(2))}
    />
  );
}

/** Fades its children in once, `t` seconds after load. */
export function Fade({ t, children }: { t: number; children: ReactNode }) {
  return <g className={f.fade} style={delay(t)}>{children}</g>;
}

/** The gold star lattice of the front page's spandrels. */
export function Lattice({ id }: { id: string }) {
  return (
    <pattern id={id} width={24} height={24} patternUnits="userSpaceOnUse">
      <path d={star(12, 12, 7)} fill="none" stroke="var(--gold)" strokeWidth={0.8} strokeOpacity={0.55} />
      <path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke="var(--gold)" strokeWidth={0.8} strokeOpacity={0.4} />
    </pattern>
  );
}

/** A potted plant beside the steps; `k` is 1 or -1 to mirror it. */
export function Plant({ c, ground, k, t }: { c: number; ground: number; k: 1 | -1; t: number }) {
  const top = ground - 22;
  return (
    <>
      <Line d={`M${c - 15},${ground} L${c - 12},${top} H${c + 12} L${c + 15},${ground} Z`} fill="#fff" t={t} />
      <Line
        d={`M${c},${top} C${c - 6 * k},${top - 20} ${c - 16 * k},${top - 30} ${c - 28 * k},${top - 34} M${c},${top} C${c + 2 * k},${top - 22} ${c + 6 * k},${top - 36} ${c + 14 * k},${top - 48} M${c},${top} C${c + 8 * k},${top - 16} ${c + 18 * k},${top - 22} ${c + 30 * k},${top - 24} M${c},${top} C${c - 4 * k},${top - 14} ${c - 4 * k},${top - 28} ${c},${top - 42}`}
        w={1.2}
        t={t + 0.1}
      />
    </>
  );
}
