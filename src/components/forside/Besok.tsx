import type { PrayerSchedule } from '@/types/prayer';
import BesokForm from './BesokForm';
import MapDoor from './MapDoor';
import { ADDRESS, EMAIL, MAPS } from './links';
import s from './forside.module.css';

interface Props {
  jummah: PrayerSchedule['jummah'];
}

/** Visit and contact in one: address, Friday prayer and a message form, with the map beside them. */
export default function Besok({ jummah }: Props) {
  return (
    <section className={s.block} id="besok">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2>Besøk og kontakt oss</h2>
        </div>
        <div className={s.visit}>
          <div>
            <div className={s.addr}>
              <b>{ADDRESS.street}</b>
              <span>{ADDRESS.city}</span>
            </div>
            <div className={s.actions}>
              <a className={`${s.btn} ${s.primary}`} href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a>
              <a className={`${s.btn} ${s.quiet}`} href={MAPS.open} target="_blank" rel="noopener noreferrer">Åpne i Google Maps</a>
            </div>
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
