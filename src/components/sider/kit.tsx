/* Drawing kit for the Støtt oss and Kontakt oss drawings: strokes that draw on once, domes,
   muqarnas, star tiles and lattice, in the line style of the front page's mosque. */
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import f from '@/components/forside/forside.module.css';

export const delay = (t: number) => ({ '--d': `${t.toFixed(2)}s` }) as CSSProperties;

export interface LineOpts { fill?: string; stroke?: string; w?: number; t?: number; op?: number; fop?: number }

/** Collects strokes and nodes in drawing order, each with its own key. */
export function pen() {
  const out: ReactNode[] = [];
  const line = (d: string, o: LineOpts = {}) => {
    out.push(
      <path
        key={out.length}
        d={d}
        fill={o.fill ?? 'none'}
        fillOpacity={o.fop}
        stroke={o.stroke ?? 'var(--emerald)'}
        strokeWidth={o.w ?? 1.4}
        strokeOpacity={o.op}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className={f.draw}
        style={delay(o.t ?? 0.2)}
      />,
    );
  };
  const add = (node: ReactNode) => out.push(<Fragment key={out.length}>{node}</Fragment>);
  const fade = (t: number, node: ReactNode) => out.push(<g key={out.length} className={f.fade} style={delay(t)}>{node}</g>);
  return { out, line, add, fade };
}

export const n1 = (v: number) => v.toFixed(1);

export const star = (cx: number, cy: number, r0: number, k = 0.7654) => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? r0 * k : r0;
    d += (i ? 'L' : 'M') + n1(cx + r * Math.cos(a)) + ',' + n1(cy + r * Math.sin(a));
  }
  return d + 'Z';
};

export const crescent = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r * 1.3},${r * 1.3} 0 0 1 ${cx - r},${cy} Z`;

/** The four control points of the left half of a pointed arch; the right half mirrors it. */
const archCtl = (x0: number, x1: number, spring: number, top: number) => {
  const c = (x0 + x1) / 2;
  const h = spring - top;
  const k = (x1 - x0) / 2;
  return { c, p: [[x0, spring], [x0, spring - h * 0.62], [c - k * 0.36, top + h * 0.3], [c, top]] as [number, number][] };
};

/** A pointed arch from x0 to x1 that springs at `spring`, peaks at `top` and runs down to `yb`. */
export const arch = (x0: number, x1: number, spring: number, top: number, yb: number, close = false) => {
  const { c, p } = archCtl(x0, x1, spring, top);
  const m = (x: number) => 2 * c - x;
  return `M${x0},${yb} V${spring} C${p[1][0]},${p[1][1]} ${p[2][0]},${p[2][1]} ${c},${top} C${m(p[2][0])},${p[2][1]} ${m(p[1][0])},${p[1][1]} ${x1},${spring} V${yb}${close ? ' Z' : ''}`;
};

/** A bulbous dome on a base line: the Timurid melon dome. */
export const onion = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2},${base} C${cx - w * 0.62},${base - h * 0.42} ${cx - w * 0.3},${base - h * 0.78} ${cx},${base - h} C${cx + w * 0.3},${base - h * 0.78} ${cx + w * 0.62},${base - h * 0.42} ${cx + w / 2},${base} Z`;

/** The ribs of an onion dome, from the apex down to the base. */
export function onionRibs(cx: number, base: number, w: number, h: number, n: number) {
  let d = '';
  for (let i = 1; i < n; i++) {
    const s = -1 + (2 * i) / n; // -1..1 across the base
    const xb = cx + s * w * 0.5;
    const bulge = cx + s * w * 0.6;
    d += `M${cx},${base - h} C${n1(cx + s * w * 0.28)},${n1(base - h * 0.8)} ${n1(bulge)},${n1(base - h * 0.42)} ${n1(xb)},${base} `;
  }
  return d;
}

/** A shallow Ottoman dome. */
export const hemi = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2},${base} C${cx - w / 2},${base - h * 0.56} ${cx - w * 0.28},${base - h} ${cx},${base - h} C${cx + w * 0.28},${base - h} ${cx + w / 2},${base - h * 0.56} ${cx + w / 2},${base} Z`;

/** Rows of small niches filling the hood of an arch: the muqarnas. Clip it to the arch. */
export function muqarnas(x0: number, x1: number, yTop: number, yBot: number, rows: number, fills: [string, string]) {
  const out: ReactNode[] = [];
  const rh = (yBot - yTop) / rows;
  for (let r = 0; r < rows; r++) {
    const yb = yTop + rh * (r + 1);
    const cells = 3 + r * 2;
    const cw = (x1 - x0) / cells;
    const off = r % 2 ? cw / 2 : 0;
    for (let k = -1; k <= cells; k++) {
      const a = x0 + k * cw + off;
      const d = arch(a, a + cw, yb - rh * 0.42, yb - rh * 0.98, yb, true);
      out.push(<path key={`${r},${k}`} d={d} fill={fills[(r + k) % 2 === 0 ? 0 : 1]} stroke="var(--gold-2)" strokeWidth={0.8} />);
    }
  }
  return out;
}

/** A row of eight-pointed star tiles, alternating mint and cream. */
export function tiles(x0: number, x1: number, y: number, size: number) {
  const out: ReactNode[] = [];
  let i = 0;
  for (let x = x0; x + size <= x1 + 0.1; x += size, i++) {
    out.push(
      <path
        key={x}
        d={star(x + size / 2, y, size * 0.38, 0.72)}
        fill={i % 2 ? 'var(--mint)' : '#f6e7c4'}
        stroke={i % 2 ? 'var(--emerald)' : 'var(--gold)'}
        strokeWidth={0.7}
      />,
    );
  }
  return out;
}

/** A column of star tiles. */
export function tilesV(x: number, y0: number, y1: number, size: number) {
  const out: ReactNode[] = [];
  let i = 0;
  for (let y = y0; y + size <= y1 + 0.1; y += size, i++) {
    out.push(
      <path
        key={y}
        d={star(x, y + size / 2, size * 0.38, 0.72)}
        fill={i % 2 ? 'var(--mint)' : '#f6e7c4'}
        stroke={i % 2 ? 'var(--emerald)' : 'var(--gold)'}
        strokeWidth={0.7}
      />,
    );
  }
  return out;
}

/** A seeded random sequence, the same on the server and in the browser. */
export function seeded(seed: number) {
  return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
}

/** Small arched windows in a row. */
export function windows(x0: number, x1: number, n: number, yb: number, h: number, w: number) {
  let d = '';
  const step = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const c = x0 + step * (i + 0.5);
    d += arch(c - w / 2, c + w / 2, yb - h + w * 0.7, yb - h, yb, true) + ' ';
  }
  return d;
}

/** The gold star lattice of the front page's spandrels, as an SVG pattern. */
export function Lattice({ id, colour = 'var(--gold)' }: { id: string; colour?: string }) {
  return (
    <pattern id={id} width={24} height={24} patternUnits="userSpaceOnUse">
      <path d={star(12, 12, 7)} fill="none" stroke={colour} strokeWidth={0.8} strokeOpacity={0.55} />
      <path d="M0,0 L5,5 M24,0 L19,5 M0,24 L5,19 M24,24 L19,19" stroke={colour} strokeWidth={0.8} strokeOpacity={0.4} />
    </pattern>
  );
}

/** An SVG as a CSS url(), for border-image and backgrounds. */
export const svgUrl = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
