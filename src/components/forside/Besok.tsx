import type { PrayerSchedule } from '@/types/prayer';
import { DownloadIcon } from './icons';
import { ADDRESS, EMAIL, MAPS, YEAR_PDF } from './links';
import s from './forside.module.css';

interface Props {
  jummah: PrayerSchedule['jummah'];
  /** "I dag" on a Friday, otherwise the date of the next one. */
  nextFriday: string;
}

export default function Besok({ jummah, nextFriday }: Props) {
  return (
    <section className={s.block} id="besok">
      <div className={`${s.wrap} ${s.visit}`}>
        <div>
          <div className={s.head}>
            <h2>Besøk oss</h2>
          </div>
          <div className={s.jbox}>
            <div className={s.jrow}>
              <div>
                <h3>Fredagsbønn</h3>
                <span className={s.ar} lang="ar">صلاة الجمعة</span>
              </div>
              <span>{nextFriday}</span>
            </div>
            <div className={`${s.jrow} ${s.num}`}>
              <span>Khutbah</span>
              <b>{jummah.khutbah}</b>
            </div>
            <div className={`${s.jrow} ${s.num}`}>
              <span>Bønn</span>
              <b>{jummah.prayer}</b>
            </div>
          </div>
          <div className={s.addr}>
            <b>{ADDRESS.street}</b>
            <p>
              {ADDRESS.city}. Spørsmål kan sendes til{' '}
              <a className={s.link} href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
            <div className={s.actions}>
              <a className={`${s.btn} ${s.primary}`} href={MAPS.directions} target="_blank" rel="noopener noreferrer">Veibeskrivelse</a>
              <a className={`${s.btn} ${s.quiet}`} href={MAPS.open} target="_blank" rel="noopener noreferrer">Åpne i Google Maps</a>
            </div>
          </div>
          <a className={s.doc} href={YEAR_PDF.href} download={YEAR_PDF.filename}>
            <span className={s.ic}>PDF</span>
            <span>
              <b>Bønnetider for hele 2026</b>
              <span>Alle dager, fra fajr til isha</span>
            </span>
            <DownloadIcon />
          </a>
        </div>
        <div className={s.door}>
          <div className={s.mask}>
            <iframe
              title={`Kart som viser ${ADDRESS.street} i Oslo`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={MAPS.embed}
            />
          </div>
          <svg viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
            <path d="M1,300 V120 C1,62 52,30 100,1 C148,30 199,62 199,120 V300" fill="none" stroke="var(--emerald)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <path d="M9,300 V122 C9,68 56,38 100,10 C144,38 191,68 191,122 V300" fill="none" stroke="var(--gold-2)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className={s.tag}>{ADDRESS.street}</span>
        </div>
      </div>
    </section>
  );
}
