/* Kontakt oss on wide screens: one beige tadelakt wall with three cuts in it. The map sits deep in the
   left arch, the envelope (the form) stands in a wide arched cut in the middle, and Friday prayer in the
   green right arch. Under the side arches, plates carved into the wall: the address on the left,
   Facebook on the right. */
import type { PrayerSchedule } from '@/types/prayer';
import { MapSand, Recess } from '@/components/forside/gips/Gips';
import { ADDRESS, FACEBOOK, MAPS } from '@/components/forside/links';
import { FacebookIcon, MoonIcon } from '../icons';
import { starPoints } from '../stott/stjerne';
import Konvolutt from './Konvolutt';
import s from './nisjene.module.css';

export default function Nisjene({ jummah }: { jummah: PrayerSchedule['jummah'] }) {
  return (
    <div className={s.wall}>
      <div className={s.row}>
        <div className={s.side}>
          <Recess shape="arch" steps={3} className={s.niche}><MapSand /></Recess>
          <div className={s.plate}>
            <b>Kom innom</b>
            <span>{ADDRESS.street}, {ADDRESS.city}</span>
            <span className={s.links}>
              <a href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a>
              <a href={MAPS.open} target="_blank" rel="noopener noreferrer">Google Maps</a>
            </span>
          </div>
        </div>

        <div className={s.panel}>
          <svg className={s.star} viewBox="0 0 40 40" aria-hidden="true">
            <polygon points={starPoints(20, 20, 16)} />
            <polygon points={starPoints(20, 20, 6)} />
          </svg>
          <Konvolutt wide hint="Skriv et brev til oss. Trykk på seglet for å åpne konvolutten." />
        </div>

        <div className={s.side}>
          <Recess shape="arch" steps={3} className={s.niche}>
            <div className={s.friday}>
              <span className={s.icon}><MoonIcon /></span>
              <b>Fredagsbønn</b>
              <dl>
                <div><dt>Khutbah</dt><dd>{jummah.khutbah}</dd></div>
                <div><dt>Bønn</dt><dd>{jummah.prayer}</dd></div>
              </dl>
            </div>
          </Recess>
          <a className={`${s.plate} ${s.plateLink}`} href={FACEBOOK} target="_blank" rel="noopener noreferrer">
            <b><FacebookIcon /> Facebook</b>
            <span>Følg oss</span>
          </a>
        </div>
      </div>
    </div>
  );
}
