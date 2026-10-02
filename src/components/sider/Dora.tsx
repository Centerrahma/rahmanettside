import { ADDRESS } from '@/components/forside/links';
import { Fade, Lattice, Line, Plant, arch } from './draw';

/** The front door at 152A: one leaf open, light on the steps, Koranen 15:46 over it. */
export default function Dora() {
  let cren = '';
  for (let x = 150; x < 710; x += 14) cren += `M${x + 1},60 V53 L${x + 7},46 L${x + 13},53 V60 `;
  const outer = arch(346, 514, 252, 150, 410, true);
  const inner = arch(358, 502, 256, 166, 410, true);
  const win = (x: number) => arch(x, x + 44, 236, 196, 330, true);
  // a lantern on a bracket from the wall, on either side of the door
  const lantern = (x: number) => (
    <>
      <Line d={`M${x + (x < 430 ? 22 : -22)},196 H${x} V206`} w={1.3} t={1} />
      <Line d={`M${x - 9},214 C${x - 9},208 ${x - 4},205 ${x},204 C${x + 4},205 ${x + 9},208 ${x + 9},214 Z`} fill="var(--mint)" w={1.1} t={1.05} />
      <Line d={`M${x - 11},214 H${x + 11} L${x + 14},236 L${x + 7},250 H${x - 7} L${x - 14},236 Z`} fill="#fff0c4" stroke="var(--gold)" w={1.1} t={1.1} />
      <Line d={`M${x - 14},236 H${x + 14} M${x},214 V250`} stroke="var(--gold)" w={0.8} t={1.15} />
    </>
  );
  return (
    <svg viewBox="0 30 860 425" role="img" aria-label={`Inngangen til moskeen i ${ADDRESS.street}, med den ene døra åpen`}>
      <defs>
        <Lattice id="do-lat" />
        <linearGradient id="do-warm" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#fff6e0" />
          <stop offset={1} stopColor="#fbdf9e" />
        </linearGradient>
        <linearGradient id="do-spill" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#fbdf9e" stopOpacity={0.9} />
          <stop offset={1} stopColor="#fbdf9e" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Line d="M150,440 V60 H710 V440" fill="#fff" w={1.6} t={0.05} />
      <Line d={cren} w={1} t={0.1} />
      <Line d="M164,72 H696 V124 H164 Z" w={1.3} t={0.15} />
      <Line d="M172,80 H688 M172,116 H688" stroke="var(--gold-2)" w={1} t={0.2} />
      <Fade t={1}>
        <text x={430} y={107} textAnchor="middle" fontSize={25} fill="var(--gold)" direction="rtl" lang="ar" fontFamily="var(--font-amiri),serif">
          ادْخُلُوهَا بِسَلَامٍ آمِنِينَ
        </text>
      </Fade>
      {/* frame, lattice, the warm hall behind the door, light on the steps */}
      <Fade t={0.8}>
        <path d={`M338,146 H522 V252 H338 Z ${outer}`} fill="url(#do-lat)" fillRule="evenodd" />
        <path d={inner} fill="url(#do-warm)" />
        <path d="M432,424 H500 L560,440 H404 Z" fill="url(#do-spill)" />
      </Fade>
      <Line d="M330,410 V140 H530 V410" w={1.5} t={0.3} />
      <Line d={outer} w={1.8} t={0.35} />
      <Line d={inner} stroke="var(--gold-2)" w={1} t={0.45} />
      {/* left leaf shut with its ring, right leaf open inward, a mihrab arch beyond */}
      <Line d="M358,410 V256 C358,201 404,193 430,166 V410 Z" fill="#fff" w={1.4} t={0.55} />
      <Line d="M368,398 V262 C368,216 402,206 420,186 V398 Z" stroke="var(--gold-2)" w={1} t={0.65} />
      <Line d="M414,300 a6,6 0 1,0 0.01,0" stroke="var(--gold)" w={1.2} t={0.8} />
      <Line d="M502,410 V262 C499,240 492,224 480,210 V396 Z" fill="#fff" w={1.3} t={0.6} />
      <Line d={arch(452, 476, 330, 312, 372)} stroke="var(--gold)" w={1} t={0.9} />
      {/* steps */}
      <Line d="M330,410 H530 V424 H330 Z" fill="#fff" w={1.3} t={0.5} />
      <Line d="M316,424 H544 V440 H316 Z" fill="#fff" w={1.3} t={0.55} />
      {/* windows, lanterns, the house number */}
      {[196, 620].map((x) => (
        <g key={x}>
          <Fade t={1}>
            <path d={win(x)} fill="url(#do-lat)" />
          </Fade>
          <Line d={win(x)} w={1.3} t={0.5} />
          <Line d={`M${x - 6},330 H${x + 50}`} w={1.3} t={0.55} />
        </g>
      ))}
      {lantern(300)}
      {lantern(560)}
      <Line d="M548,290 H600 V320 H548 Z" fill="var(--emerald)" stroke="var(--emerald)" w={1.2} t={0.9} />
      <Fade t={1.3}>
        <text x={574} y={311} textAnchor="middle" fontSize={17} fontWeight={600} fill="#fff" fontFamily="var(--font-geist)">152A</text>
      </Fade>
      <Line d="M30,440 H830 M50,448 H810" w={1.6} t={0} />
      <Plant c={292} ground={440} k={1} t={1.2} />
      <Plant c={568} ground={440} k={-1} t={1.2} />
    </svg>
  );
}
