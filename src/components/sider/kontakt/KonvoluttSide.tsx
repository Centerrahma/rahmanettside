/* Kontakt oss on phones and tablets: a sealed envelope is the hero. Scrolling opens it and the letter,
   which is the form, rises out; sending seals it and turns it over to its stamped front. Under it, three
   medallions: visit, Friday prayer, Facebook. */
import type { PrayerSchedule } from '@/types/prayer';
import { ADDRESS, FACEBOOK, MAPS } from '@/components/forside/links';
import { FacebookIcon, MoonIcon, PinIcon } from '../icons';
import Konvolutt from './Konvolutt';
import s from './side.module.css';

export default function KonvoluttSide({ jummah }: { jummah: PrayerSchedule['jummah'] }) {
  return (
    <div className={s.side}>
      <Konvolutt />

      <nav className={s.medals} aria-label="Finn oss">
        <a className={s.medal} href={MAPS.directions} target="_blank" rel="noopener noreferrer">
          <span className={s.disc}><PinIcon /></span>
          <span className={s.label}>Kom innom</span>
          <span className={s.small}>{ADDRESS.street}</span>
        </a>
        <div className={`${s.medal} ${s.friday}`}>
          <span className={s.disc}><MoonIcon /></span>
          <span className={s.label}>Fredagsbønn</span>
          <span className={s.small}>Khutbah {jummah.khutbah}<br />Bønn {jummah.prayer}</span>
        </div>
        <a className={s.medal} href={FACEBOOK} target="_blank" rel="noopener noreferrer">
          <span className={s.disc}><FacebookIcon /></span>
          <span className={s.label}>Facebook</span>
          <span className={s.small}>Følg oss</span>
        </a>
      </nav>
    </div>
  );
}
