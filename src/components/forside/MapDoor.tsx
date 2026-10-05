import { ADDRESS, MAPS } from './links';
import s from './forside.module.css';

/** The map in a pointed-arch doorway, with the address on a tag below it that opens Google Maps. */
export default function MapDoor() {
  return (
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
      <a className={s.tag} href={MAPS.open} target="_blank" rel="noopener noreferrer" aria-label={`${ADDRESS.street}, ${ADDRESS.city}: åpne i Google Maps`}>
        {ADDRESS.street}
      </a>
    </div>
  );
}
