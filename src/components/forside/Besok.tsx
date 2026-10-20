import type { PrayerSchedule } from '@/types/prayer';
import KontaktBrev from './KontaktBrev';
import { ADDRESS, MAPS } from './links';
import f from './forside.module.css';
import s from './besok.module.css';

interface Props {
  jummah: PrayerSchedule['jummah'];
}

const L = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const ClockIcon = () => (<svg viewBox="0 0 48 48" {...L}><circle cx="24" cy="24" r="18" /><path d="M24,13 V24 L31,29" /></svg>);
const PinIcon = () => (<svg viewBox="0 0 48 48" {...L}><path d="M24,44 C24,44 38,30 38,19 C38,11 32,5 24,5 C16,5 10,11 10,19 C10,30 24,44 24,44 Z" /><circle cx="24" cy="19" r="5" /></svg>);

/** The coming Friday in Oslo (today, if it is Friday): «23» and «okt». */
function nextFriday(now = new Date()) {
  const oslo = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', ...o }).format(d);
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86_400_000);
    if (oslo(d, { weekday: 'long' }) === 'fredag') {
      return { day: oslo(d, { day: 'numeric' }).replace('.', ''), month: oslo(d, { month: 'short' }).replace('.', '') };
    }
  }
  return null;
}

/** Visit and contact: the Friday prayer and the map beside a letter to the mosque. */
export default function Besok({ jummah }: Props) {
  const fri = nextFriday();
  return (
    <section className={s.sec} id="besok" aria-labelledby="besok-h2">
      <div className={s.wrap}>
        <header className={s.head}>
          <h2 id="besok-h2">Besøk og kontakt oss</h2>
          <p className={s.lead}>Kom innom moskeen, eller skriv et brev til oss her.</p>
        </header>
        <div className={s.visit}>
          <div className={s.event} data-paper-surface>
            {fri && (
              <p className={s.edate} aria-hidden="true">
                <b className={f.num}>{fri.day}</b>
                <span>{fri.month}</span>
              </p>
            )}
            <div>
              <h3>Fredagsbønn{fri ? ` ${fri.day}. ${fri.month}` : ''}</h3>
              <p className={s.erow}><ClockIcon />Khutbah <b className={f.num}>{jummah.khutbah}</b>, bønn <b className={f.num}>{jummah.prayer}</b></p>
              <p className={s.erow}><PinIcon />{ADDRESS.street}, {ADDRESS.city}</p>
            </div>
          </div>
          <div className={s.map}>
            <iframe title={`Kart som viser ${ADDRESS.street} i Oslo`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={MAPS.embed} />
            <a className={s.mapTag} href={MAPS.directions} target="_blank" rel="noopener noreferrer"><PinIcon />Veibeskrivelse</a>
          </div>
        </div>
        <div className={s.desk} data-paper-surface><KontaktBrev /></div>
      </div>
    </section>
  );
}
