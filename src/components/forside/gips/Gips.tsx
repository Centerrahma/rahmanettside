import type { ReactNode } from 'react';
import { ADDRESS, MAPS } from '../links';
import s from './gips.module.css';

export type Shape = 'arch' | 'rect' | 'round';

/** A recess cut into the wall in steps, each a little deeper, with the content at the back. */
export function Recess({ shape = 'arch', steps = 3, tone = 'sand', className = '', children }: { shape?: Shape; steps?: number; tone?: 'sand' | 'green'; className?: string; children: ReactNode }) {
  let inner: ReactNode = <div className={s.back}>{children}</div>;
  for (let i = 1; i < steps; i++) inner = <div className={s.step}>{inner}</div>;
  return <div className={`${s.recess} ${s[shape]} ${tone === 'green' ? s.onGreen : ''} ${className}`}>{inner}</div>;
}

/** Google's map washed to the colour of the plaster, with a green marker of our own on the address. */
export function MapSand({ className = '' }: { className?: string }) {
  return (
    <div className={`${s.map} ${className}`}>
      <iframe title={`Kart som viser ${ADDRESS.street} i Oslo`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={MAPS.embed} />
      <span className={s.tint} aria-hidden="true" />
      <span className={s.pin} aria-hidden="true"><b /><span>Masjid Rahma</span></span>
    </div>
  );
}
