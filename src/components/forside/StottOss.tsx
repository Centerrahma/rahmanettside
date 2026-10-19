import Image from 'next/image';
import Link from 'next/link';
import { FACEBOOK, VIPPS, YEAR_PDF } from './links';
import f from './forside.module.css';
import s from './stottoss.module.css';

/* Støtt moskeen and Følg med in one green band: Vipps on the left, Facebook, the year's prayer times
   and the other ways to give on a cream card. */

/* line icons on a 48 grid, drawn for this band */
const L = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const GiveIcon = () => (
  <svg viewBox="0 0 48 48" {...L}>
    <path d="M24,22 C17,17 14,14 14,10.5 C14,8 16,6 18.5,6 C20.6,6 22.3,7.3 24,9.6 C25.7,7.3 27.4,6 29.5,6 C32,6 34,8 34,10.5 C34,14 31,17 24,22 Z" />
    <path d="M4,34 L11,28 C13,26.4 15.5,26 18,27 L27,30 C29,30.7 29.6,33.4 27.6,34.4 C26.6,34.9 25.5,34.9 24.5,34.5 L19,32.6" />
    <path d="M28,33.6 L36.5,29.4 C38.6,28.4 41,29.6 41,31.6 C41,32.6 40.4,33.5 39.5,34 L28,40.5 C25.5,41.9 22.5,42.2 19.8,41.2 L11,38 L4,42" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 48 48" {...L}>
    <rect x="6" y="9" width="36" height="33" rx="5" />
    <path d="M6,18 H42 M15,5 V12 M33,5 V12" />
    <path d="M27.5,25 C24.5,25.6 22.5,28 22.5,31 C22.5,34.3 25.2,37 28.5,37 C30.3,37 31.9,36.2 33,35 C29.7,35 27,32.3 27,29 C27,27.5 27.2,26.2 27.5,25 Z" />
  </svg>
);
const BankIcon = () => (
  <svg viewBox="0 0 48 48" {...L}>
    <path d="M6,17 L24,6 L42,17 Z" />
    <path d="M10,21 V36 M18,21 V36 M30,21 V36 M38,21 V36 M6,40 H42" />
    <circle cx="24" cy="13" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const Chevron = () => (<svg viewBox="0 0 24 24" {...L} className={s.chev}><path d="M9,5 L16,12 L9,19" /></svg>);

export default function StottOss() {
  return (
    <section className={s.band} id="stott" aria-labelledby="stott-h2">
      <div className={s.wrap}>
        <div>
          <span className={s.icon}><GiveIcon /></span>
          <h2 id="stott-h2">Støtt moskeen</h2>
          <p className={s.lead}>Moskeen drives av gaver fra menigheten. Gavene går til driften og til undervisningen for barn og unge.</p>
          <div className={s.vrow}>
            <span className={s.qr}><Image src="/vipps-77811.png" alt="QR-kode for å gi med Vipps" width={128} height={128} /></span>
            <div>
              <b className={`${s.vnum} ${f.num}`}>{VIPPS.number}</b>
              <a className={`${f.btn} ${f.vipps} ${s.vbtn}`} href={VIPPS.url} target="_blank" rel="noopener noreferrer">Gi med Vipps</a>
            </div>
          </div>
        </div>
        <div className={s.card} data-paper-surface>
          <div className={s.fbHead}>
            <span className={s.fbMark}><FacebookMark /></span>
            <div>
              <h3>Følg Masjid Rahma</h3>
              <p>Nyheter, arrangementer og beskjeder kommer først på Facebook.</p>
            </div>
          </div>
          <a className={`${f.btn} ${f.primary} ${s.fbBtn}`} href={FACEBOOK} target="_blank" rel="noopener noreferrer">Følg oss på Facebook</a>
          <a className={s.row} href={YEAR_PDF.href} download={YEAR_PDF.filename}>
            <span className={s.rowIc}><CalendarIcon /></span>
            <span><b>Bønnetider for hele 2026</b><small>Last ned som PDF</small></span>
            <Chevron />
          </a>
          <Link className={s.row} href="/stott-oss">
            <span className={s.rowIc}><BankIcon /></span>
            <span><b>Bankoverføring og fast gave</b><small>Flere måter å gi</small></span>
            <Chevron />
          </Link>
        </div>
      </div>
    </section>
  );
}
