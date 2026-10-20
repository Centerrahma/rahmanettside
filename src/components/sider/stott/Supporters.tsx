'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { BANK_ACCOUNT, EMAIL, MONTHLY_VIPPS, VIPPS } from '@/components/forside/links';
import { createLightArch, type LightArch } from './light-arch';
import s from './supporters.module.css';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const readMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => true;

const methods = [
  { title: 'Gi en gave', description: 'En gave, når det passer deg.', action: 'Gi med Vipps', vipps: VIPPS },
  { title: 'Bli fast giver', description: 'Litt hver måned. Mye over tid.', action: 'Bli fast giver', vipps: MONTHLY_VIPPS },
];

function BankDoor() {
  return (
    <div className={s.bankArt} aria-hidden="true">
      <svg viewBox="0 0 164 164" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M25 145V70a57 57 0 0 1 114 0v75" />
        <path opacity=".6" d="M40 145V71a42 42 0 0 1 84 0v74" />
        <path opacity=".35" d="M55 145V72a27 27 0 0 1 54 0v73" />
        <path d="M13 145h138M20 154h124" />
        <path opacity=".5" d="M82 62v75" />
        <circle cx="90" cy="108" r="2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

export default function Supporters() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const hero = useRef<HTMLElement>(null);
  const arch = useRef<LightArch | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const paused = reducedMotion;

  useEffect(() => {
    if (!canvas.current || !hero.current) return;
    const controller = createLightArch(canvas.current, hero.current);
    arch.current = controller;
    return () => { controller.destroy(); arch.current = null; };
  }, []);

  // Read the browser preference here as well: the hydration snapshot defaults
  // to reduced motion and must not briefly paint the completed arch on mount.
  useEffect(() => { arch.current?.setPaused(readMotion()); }, [reducedMotion]);

  return (
    <div className={s.page} data-supporters data-paused={paused}>
      <div className={s.composition}>
        <section className={s.hero} ref={hero} aria-labelledby="supporters-title">
          <div className={s.lightStage} aria-hidden="true">
            <div className={s.staticArch} />
            <canvas ref={canvas} className={s.canvas} />
          </div>
          <div className={s.heroCopy}>
            <h1 id="supporters-title" data-light-mask>Det gode lever videre.</h1>
            <p className={s.intro} data-light-mask>Et fellesskap bæres av mange.<br />Takk for at din gave er en del av Rahma.</p>
            <blockquote className={s.verse} data-light-mask>
              <p className={s.arabic} lang="ar" dir="rtl">لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ</p>
              <p className={s.meaning}>«Dere når ikke det gode før dere gir av det dere er glad i.»</p>
              <p className={s.reference}>Koranen 3:92</p>
            </blockquote>
          </div>
        </section>
        <section className={s.giving} aria-label="Tre måter å gi">
          {methods.map(({ title, description, action, vipps }, index) => (
            <article className={`${s.panel} ${index === 1 ? s.monthly : ''}`} key={vipps.number}>
              <header className={s.heading}><h2>{title}</h2><p>{description}</p></header>
              <div className={s.panelBody}>
                <div className={s.number}><span>Vipps</span><strong>{vipps.number}</strong><span className={s.scanNote}>Skann QR-koden<br />eller åpne Vipps</span></div>
                <a className={s.qr} href={vipps.url} target="_blank" rel="noopener noreferrer" aria-label={`${action}, Vipps ${vipps.number}`}>
                  <Image src={`/vipps-${vipps.number}.png`} width={492} height={492} unoptimized alt={`QR-kode til Vipps ${vipps.number}`} />
                </a>
              </div>
              <a className={s.action} href={vipps.url} target="_blank" rel="noopener noreferrer">{action}<span aria-hidden="true">↗</span></a>
            </article>
          ))}
          <article className={s.panel}>
            <header className={s.heading}><h2>Bankoverføring</h2><p>En annen måte å gjøre godt på.</p></header>
            <div className={s.panelBody}>
              <div className={s.bankInfo}><span>Kontonummer</span><strong>{BANK_ACCOUNT ?? 'kommer'}</strong></div>
              <BankDoor />
            </div>
            <a className={s.action} href={`mailto:${EMAIL}?subject=Kontonummer%20for%20gave`}>Kontakt oss<span aria-hidden="true">↗</span></a>
          </article>
        </section>
      </div>
    </div>
  );
}
