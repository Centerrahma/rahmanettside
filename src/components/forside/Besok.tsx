import type { PrayerSchedule } from '@/types/prayer';
import BesokForm from './BesokForm';
import MapDoor from './MapDoor';
import { EMAIL } from './links';
import s from './forside.module.css';

interface Props {
  jummah: PrayerSchedule['jummah'];
}

/** Visit and contact in one: Friday prayer and a message form, with the map and its address beside them. */
export default function Besok({ jummah }: Props) {
  return (
    <section className={s.block} id="besok">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2>Besøk og kontakt oss</h2>
        </div>
        <div className={s.visit}>
          <div>
            <p className={s.fri}>
              <span>Fredagsbønn</span> Khutbah <b className={s.num}>{jummah.khutbah}</b> · Bønn <b className={s.num}>{jummah.prayer}</b>
            </p>
            <h3 className={s.formTitle}>Send oss en melding</h3>
            <BesokForm />
            <p className={s.alt}>
              Eller skriv til <a className={s.link} href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
          <MapDoor />
        </div>
      </div>
    </section>
  );
}
