'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GIFT, MONTHLY } from './gaver';
import s from './velger.module.css';

/**
 * Phone only: one card and one choice. A switch picks a single gift or monthly giving,
 * and the card opens the matching Vipps number. The QR code is tucked away, since it
 * can only be scanned with another phone.
 */
export default function Velger({ carved = false }: { carved?: boolean }) {
  const [monthly, setMonthly] = useState(false);
  const way = monthly ? MONTHLY : GIFT;
  return (
    <section className={`${s.card} ${monthly ? s.warm : ''} ${carved ? s.carved : ''}`} aria-label="Gi med Vipps">
      <div className={s.switch} role="radiogroup" aria-label="Hvor ofte vil du gi?">
        <button type="button" role="radio" aria-checked={!monthly} onClick={() => setMonthly(false)}>Én gang</button>
        <button type="button" role="radio" aria-checked={monthly} onClick={() => setMonthly(true)}>Hver måned</button>
        <span className={s.thumb} data-right={monthly} aria-hidden="true" />
      </div>
      <div className={s.body} key={way.vipps.number}>
        <h2>{way.title}</h2>
        <p className={s.line}>{way.line}</p>
        {way.source && <p className={s.source}>{way.source}</p>}
        <p className={s.number}>{way.vipps.number}<span>på Vipps</span></p>
        <a className={s.go} href={way.vipps.url} target="_blank" rel="noopener noreferrer">Åpne Vipps<span aria-hidden="true">↗</span></a>
        <details className={s.qrBox}>
          <summary>Vis QR-kode, for å skanne med en annen telefon</summary>
          <Image src={way.vipps.qr} width={492} height={492} unoptimized alt={`QR-kode til Vipps ${way.vipps.number}`} />
        </details>
      </div>
    </section>
  );
}
