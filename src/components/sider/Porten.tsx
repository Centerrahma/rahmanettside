import { Fade, Lattice, Line, Plant, arch, crescent, star } from './draw';

/** The mosque's gate with both doors open and a lantern lit inside; Koranen 9:18 in the frieze. */
export default function Porten() {
  let cren = '';
  for (let x = 150; x < 650; x += 14) cren += `M${x + 1},150 V143 L${x + 7},136 L${x + 13},143 V150 `;
  const outer = arch(236, 564, 384, 252, 548, true);
  const inner = arch(250, 550, 388, 268, 548, true);
  const win = (x: number) => arch(x, x + 32, 352, 318, 446, true);
  return (
    <svg viewBox="0 10 800 590" role="img" aria-label="Moskeens port med åpne dører og en tent lykt innenfor">
      <defs>
        <Lattice id="po-lat" />
        <linearGradient id="po-warm" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#fff7e6" />
          <stop offset={1} stopColor="#fbe3b2" />
        </linearGradient>
        <radialGradient id="po-glow" cx={0.5} cy={0.5} r={0.5}>
          <stop offset={0} stopColor="#ffd88a" stopOpacity={0.75} />
          <stop offset={1} stopColor="#ffd88a" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* dome behind the wall */}
      <Line d="M340,136 V118 H460 V136" fill="#fff" t={0.05} />
      <Line d="M332,118 C318,90 340,62 400,42 C460,62 482,90 468,118 Z" fill="var(--mint)" w={1.7} t={0.1} />
      <Line d="M400,42 V30" w={1.3} t={0.2} />
      <Line d={crescent(400, 25, 6)} fill="var(--gold)" stroke="var(--gold)" w={1} t={0.25} />
      <Line d={star(400, 92, 11)} stroke="var(--gold)" fill="#fff" w={1.1} t={0.3} />
      {/* wall, crenellation, frieze with the verse */}
      <Line d="M150,580 V150 H650 V580" fill="#fff" w={1.6} t={0.15} />
      <Line d={cren} w={1} t={0.2} />
      <Line d="M158,158 H642 V228 H158 Z" w={1.4} t={0.25} />
      <Line d="M166,166 H634 M166,220 H634" stroke="var(--gold-2)" w={1} t={0.3} />
      <Fade t={1}>
        <text x={400} y={202} textAnchor="middle" fontSize={27} fill="var(--gold)" direction="rtl" lang="ar" fontFamily="var(--font-amiri),serif">
          إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ
        </text>
      </Fade>
      {/* frame round the gate, lattice in the spandrels, the warm room inside */}
      <Fade t={0.8}>
        <path d={`M222,248 H578 V384 H222 Z ${outer}`} fill="url(#po-lat)" fillRule="evenodd" />
      </Fade>
      <Line d="M214,548 V240 H586 V548" w={1.5} t={0.35} />
      <Fade t={0.9}>
        <path d={inner} fill="url(#po-warm)" />
        <circle cx={400} cy={330} r={70} fill="url(#po-glow)" />
      </Fade>
      <Line d={outer} w={1.8} t={0.4} />
      <Line d={inner} stroke="var(--gold-2)" w={1} t={0.5} />
      {/* inside: floor, back wall, mihrab */}
      <Line d="M290,548 L352,500 H448 L510,548" stroke="var(--gold-2)" w={1} t={0.9} />
      <Line d={arch(382, 418, 470, 440, 500)} stroke="var(--gold)" w={1} t={1} />
      <Line d="M340,524 H460 M322,538 H478" stroke="var(--gold-2)" w={0.8} op={0.6} t={1.1} />
      {/* the lantern on its chain */}
      <Line d="M400,268 V298" w={1} t={1} />
      <Line d="M388,306 C388,298 394,294 400,292 C406,294 412,298 412,306 Z" fill="var(--mint)" w={1.1} t={1.05} />
      <Line d="M386,306 H414 L419,330 L408,350 H392 L381,330 Z" fill="#fff1c9" stroke="var(--gold)" w={1.1} t={1.1} />
      <Line d="M394,310 V340 M406,310 V340 M386,330 H414" stroke="var(--gold)" w={0.8} t={1.15} />
      <Line d="M400,350 V358" stroke="var(--gold)" w={1} t={1.2} />
      {/* the doors, opened inward */}
      <Line d="M250,548 V392 C256,376 270,364 290,356 V528 Z" fill="#fff" w={1.4} t={0.7} />
      <Line d="M258,520 V398 C262,388 270,380 282,374 V512 Z" stroke="var(--gold-2)" w={1} t={0.8} />
      <Line d="M550,548 V392 C544,376 530,364 510,356 V528 Z" fill="#fff" w={1.4} t={0.7} />
      <Line d="M542,520 V398 C538,388 530,380 518,374 V512 Z" stroke="var(--gold-2)" w={1} t={0.8} />
      {/* windows */}
      {[168, 600].map((x) => (
        <g key={x}>
          <Fade t={1}>
            <path d={win(x)} fill="url(#po-lat)" />
          </Fade>
          <Line d={win(x)} w={1.3} t={0.6} />
          <Line d={`M${x - 6},446 H${x + 38}`} w={1.3} t={0.65} />
        </g>
      ))}
      {/* steps, ground, plants */}
      <Line d="M228,548 H572 V564 H228 Z" fill="#fff" w={1.3} t={0.55} />
      <Line d="M212,564 H588 V580 H212 Z" fill="#fff" w={1.3} t={0.6} />
      <Line d="M40,580 H760 M60,588 H740" w={1.6} t={0.05} />
      <Plant c={186} ground={580} k={1} t={1.3} />
      <Plant c={614} ground={580} k={-1} t={1.3} />
    </svg>
  );
}
