/* Kontakt oss: the four ways to reach the mosque, the frame that places HTML on a drawing in the
   drawing's own units, and the map in a round gold frame. */
import type { CSSProperties, ReactNode } from 'react';
import type { PrayerSchedule } from '@/types/prayer';
import { ADDRESS, EMAIL, FACEBOOK, MAPS } from '@/components/forside/links';
import { FacebookIcon, MailIcon, MoonIcon, PinIcon } from '../icons';
import f from '@/components/forside/forside.module.css';
import k from './kontakt.module.css';
import { delay } from '../kit';

export interface Way { key: string; icon: ReactNode; label: string; body: ReactNode; link?: ReactNode }

export function ways(jummah: PrayerSchedule['jummah']): Way[] {
  return [
    { key: 'besok', icon: <PinIcon />, label: 'Besøk oss', body: <>{ADDRESS.street}<br />{ADDRESS.city}</>, link: <a href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a> },
    { key: 'fredag', icon: <MoonIcon />, label: 'Fredagsbønn', body: <>Khutbah <span className={f.num}>{jummah.khutbah}</span><br />Bønn <span className={f.num}>{jummah.prayer}</span></> },
    { key: 'epost', icon: <MailIcon />, label: 'E-post', body: <>post@<wbr />centerrahma.no</>, link: <a href={`mailto:${EMAIL}`}>Skriv til oss</a> },
    { key: 'facebook', icon: <FacebookIcon />, label: 'Facebook', body: <>Masjid Rahma</>, link: <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">Følg oss</a> },
  ];
}

/** One way to reach us, as icon, label, the details and a link. */
export function WayBody({ w }: { w: Way }) {
  return (
    <>
      {w.icon}
      <small>{w.label}</small>
      <b>{w.body}</b>
      {w.link}
    </>
  );
}

export interface Rect { x: number; y: number; w: number; h: number }
export interface Placed { rect: Rect; node: ReactNode; cls?: string; t?: number }

/** A drawing as big as the screen allows, with HTML placed on it in the drawing's own units. */
export function Frame({ vb, art, items, reserve, max = 1200, label }: { vb: [number, number, number, number]; art: ReactNode; items: Placed[]; reserve: number; max?: number; label: string }) {
  const [vx, vy, vw, vh] = vb;
  const pos = (r: Rect, t: number) =>
    ({
      '--x': `${(((r.x - vx) / vw) * 100).toFixed(3)}%`,
      '--y': `${(((r.y - vy) / vh) * 100).toFixed(3)}%`,
      '--w': `${((r.w / vw) * 100).toFixed(3)}%`,
      '--h': `${((r.h / vh) * 100).toFixed(3)}%`,
      ...delay(t),
    }) as CSSProperties;
  return (
    <div className={k.frame} style={{ '--ar': `${vw}/${vh}`, '--arn': vw / vh, '--res': `${reserve}px`, '--max': `${max}px` } as CSSProperties}>
      <div className={k.art}>
        <svg viewBox={vb.join(' ')} role="img" aria-label={label}>{art}</svg>
      </div>
      {items.map((it, i) => (
        <div key={i} className={`${k.place} ${it.cls ?? ''}`} style={pos(it.rect, it.t ?? 1.2)}>{it.node}</div>
      ))}
    </div>
  );
}

/** The map in a round, scalloped gold frame, with the address and two buttons under it. */
export function RoundMap() {
  let lobes = '';
  const n = 32;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p = (r: number, a: number) => `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
    lobes += `${i ? 'L' : 'M'}${p(97, a0)} Q${p(103, am)} ${p(97, a1)} `;
  }
  return (
    <div className={k.mapWrap}>
      <div className={k.map}>
        <div className={k.mapIn}>
          <iframe title={`Kart som viser ${ADDRESS.street} i Oslo`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={MAPS.embed} />
        </div>
        <svg viewBox="-6 -6 212 212" aria-hidden="true">
          <path d={lobes + 'Z'} fill="none" stroke="var(--gold)" strokeWidth={1.4} />
          <circle cx={100} cy={100} r={93} fill="none" stroke="var(--emerald)" strokeWidth={1.2} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={100 + 101 * Math.cos(a)} cy={100 + 101 * Math.sin(a)} r={2.6} fill="var(--gold)" />;
          })}
        </svg>
      </div>
      <p className={k.addr}><b>{ADDRESS.street}</b><span>{ADDRESS.city}</span></p>
      <div className={k.mapBtns}>
        <a className={`${f.btn} ${f.primary}`} href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a>
        <a className={`${f.btn} ${f.quiet}`} href={MAPS.open} target="_blank" rel="noopener noreferrer">Åpne i Google Maps</a>
      </div>
    </div>
  );
}
