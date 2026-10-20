import { useId } from 'react';
import s from './mobil.module.css';

/** Points of an eight-point star (two squares turned 45° to each other), turned `rotate` degrees. */
function star(cx: number, cy: number, r: number, rotate = 0) {
  return Array.from({ length: 16 }, (_, k) => {
    const a = ((k * 22.5 - 90 + rotate) * Math.PI) / 180;
    const d = k % 2 === 0 ? r : r * 0.7654;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

const DOTS = Array.from({ length: 16 }, (_, k) => {
  const a = (k * 22.5 * Math.PI) / 180;
  return [60 + 32.5 * Math.cos(a), 34 + 32.5 * Math.sin(a)];
});

/** A tapering gold rule with a diamond at its far end; the right one is the left one mirrored. */
function Rule({ right = false }: { right?: boolean }) {
  return (
    <svg className={`${s.rule} ${right ? s.right : ''}`} viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="12,10 120,8.4 120,11.6" fill="#d8b46c" />
      <path d="M40 4.5H116M40 15.5H116" stroke="#d8b46c" strokeWidth=".7" opacity=".55" />
      <polygon points="2,10 7,5 12,10 7,15" fill="#d8b46c" />
    </svg>
  );
}

/** Over each section heading on phones: a gilded eight-fold rosette (a shamsa) between two gold rules.
    When the heading scrolls into view the rosette turns a sixteenth into place and the rules grow outward, once. */
export default function Rosett() {
  const gold = `ro-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div className={s.orn} aria-hidden="true">
      <Rule />
      <svg className={s.rosett} viewBox="0 0 120 68">
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8e2a6" />
            <stop offset=".5" stopColor="#d8b46c" />
            <stop offset="1" stopColor="#9c7533" />
          </linearGradient>
        </defs>
        <g className={s.spin}>
          {DOTS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k % 2 ? 0.9 : 1.4} fill="#d8b46c" />)}
          <circle cx="60" cy="34" r="29.5" fill="none" stroke="#d8b46c" strokeWidth=".8" />
          <polygon points={star(60, 34, 27)} fill={`url(#${gold})`} stroke="#8a6a2f" strokeWidth=".6" />
          <polygon points={star(60, 34, 19.5, 22.5)} fill="#0a4439" stroke="#f3d491" strokeWidth=".8" />
          <polygon points={star(60, 34, 13)} fill="none" stroke="#d8b46c" strokeWidth=".7" />
          <circle cx="60" cy="34" r="7.5" fill={`url(#${gold})`} />
          <polygon points={star(60, 34, 4.4)} fill="#0a4439" />
        </g>
      </svg>
      <Rule right />
    </div>
  );
}
