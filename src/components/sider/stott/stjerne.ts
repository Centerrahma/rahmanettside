/** Points of an eight-point star (two squares turned 45° to each other) for an SVG polygon. */
export function starPoints(cx: number, cy: number, r: number, rotate = 0) {
  const inner = r * 0.7654;
  return Array.from({ length: 16 }, (_, k) => {
    const a = ((k * 22.5 + rotate) * Math.PI) / 180;
    const d = k % 2 === 0 ? r : inner;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}
