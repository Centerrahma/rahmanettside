import type { ReactNode } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { ADDRESS, EMAIL, FACEBOOK, MAPS } from '@/components/forside/links';
import f from '@/components/forside/forside.module.css';
import { Fade, Lattice, Line, arch, delay } from './draw';
import { ChatIcon, FacebookIcon, MailIcon, MoonIcon, PinIcon } from './icons';
import s from './sider.module.css';

/* An arcade of five arches under the greeting, drawn on a 1200 × 560 grid like the
   front page's five prayers. Each arch holds one way to reach the mosque. */

const bayX = (i: number) => 150 + 180 * i;
const pct = (v: number, total: number) => ((v / total) * 100).toFixed(3) + '%';
const ARCHES = [0, 1, 2, 3, 4].map((i) => arch(bayX(i) + 12, bayX(i) + 168, 250, 128, 520, true));

function Arcade() {
  let cren = '';
  for (let x = 138; x < 1062; x += 14) cren += `M${x + 1},40 V33 L${x + 7},26 L${x + 13},33 V40 `;
  let muq = '';
  for (let x = 138; x < 1062; x += 16) muq += `M${x},112 Q${x + 8},126 ${x + 16},112 `;
  return (
    <svg viewBox="0 0 1200 560" aria-hidden="true">
      <defs>
        <Lattice id="fd-lat" />
        <linearGradient id="fd-in" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="#eef6f2" />
          <stop offset={1} stopColor="#fff8ea" />
        </linearGradient>
      </defs>
      <Line d="M138,540 V40 H1062 V540" fill="#fff" w={1.6} t={0.05} />
      <Line d={cren} w={1} t={0.1} />
      <Line d="M138,40 H1062 V112 H138 Z" w={1.5} t={0.15} />
      <Line d="M146,48 H1054 M146,104 H1054" stroke="var(--gold-2)" w={1} t={0.2} />
      <Fade t={0.9}>
        <text x={600} y={88} textAnchor="middle" fontSize={34} fill="var(--gold)" direction="rtl" lang="ar" fontFamily="var(--font-amiri),serif">
          السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
        </text>
        <path d={`M138,124 H1062 V250 H138 Z ${ARCHES.join(' ')}`} fill="url(#fd-lat)" fillRule="evenodd" />
        {ARCHES.map((d) => <path key={d} d={d} fill="url(#fd-in)" />)}
      </Fade>
      <Line d={muq} stroke="var(--gold-2)" w={1} t={0.25} />
      {ARCHES.map((d, i) => (
        <g key={d}>
          <Line d={d} w={1.6} t={0.3 + i * 0.08} />
          <Line d={arch(bayX(i) + 20, bayX(i) + 160, 254, 140, 520)} stroke="var(--gold-2)" w={1} t={0.45 + i * 0.08} />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Line key={k} d={`M${bayX(k) - 18},250 H${bayX(k) + 18} M${bayX(k) - 14},256 H${bayX(k) + 14} M${bayX(k) - 16},512 H${bayX(k) + 16}`} w={1.3} t={0.6} />
      ))}
      <Line d="M138,520 H1062" w={1.4} t={0.6} />
      <Line d="M40,540 H1160 M60,548 H1140" w={1.6} t={0} />
    </svg>
  );
}

interface Door { icon: ReactNode; label: string; body: ReactNode; link?: ReactNode }

export default function FemDorer({ jummah }: { jummah: PrayerSchedule['jummah'] }) {
  const doors: Door[] = [
    { icon: <PinIcon />, label: 'Besøk', body: <>{ADDRESS.street}<br />{ADDRESS.city}</>, link: <a href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a> },
    { icon: <MoonIcon />, label: 'Fredagsbønn', body: <>Khutbah <span className={f.num}>{jummah.khutbah}</span><br />Bønn <span className={f.num}>{jummah.prayer}</span></> },
    { icon: <MailIcon />, label: 'E-post', body: <>post@<wbr />centerrahma.no</>, link: <a href={`mailto:${EMAIL}`}>Skriv til oss</a> },
    { icon: <ChatIcon />, label: 'Melding', body: <>Send oss en melding</>, link: <a href="#skjema">Til skjemaet</a> },
    { icon: <FacebookIcon />, label: 'Facebook', body: <>Masjid Rahma</>, link: <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">Følg oss</a> },
  ];
  return (
    <section className={s.fem} aria-label="Slik når du oss">
      <div className={s.arcade}>
        <Arcade />
        {/* on phones the arches keep only their icons; the list below carries the text */}
        <ul className={s.doors}>
          {doors.map((d, i) => (
            <li
              key={d.label}
              style={{ left: pct(bayX(i) + 12, 1200), width: pct(156, 1200), top: pct(176, 560), height: pct(330, 560), ...delay((1 + i * 0.15).toFixed(2)) }}
            >
              {d.icon}
              <small>{d.label}</small>
              <b>{d.body}</b>
              {d.link}
            </li>
          ))}
        </ul>
      </div>
      <p className={s.gloss}>
        <q>Fred være med dere, og Guds barmhjertighet og velsignelse.</q>
        <span>Den islamske hilsenen</span>
      </p>
      <ul className={s.doorList}>
        {doors.map((d) => (
          <li key={d.label}>
            <span className={s.sw}>{d.icon}</span>
            <span>
              <small>{d.label}</small>
              <b>{d.body}</b> {d.link}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
