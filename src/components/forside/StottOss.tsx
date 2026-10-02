'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FACEBOOK, VIPPS } from './links';
import s from './forside.module.css';

/** Mounts the Facebook page plugin only when the panel is close to the screen. */
function FacebookPanel() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const w = Math.min(500, Math.max(180, Math.round(el.clientWidth)));
        const h = Math.max(380, Math.round(el.clientHeight));
        const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK)}&tabs=timeline&width=${w}&height=${h}&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`;
        const frame = document.createElement('iframe');
        Object.assign(frame, { title: 'Masjid Rahma på Facebook', src, width: String(w), height: String(h), loading: 'lazy' });
        frame.allow = 'encrypted-media';
        el.replaceChildren(frame);
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={s.fbbox} ref={box}>
      Laster innlegg …
    </div>
  );
}

/** The orange ring round the QR code fills once, the first time it is seen. */
function VippsRing() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '100%');
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (ts: number) => {
          const k = Math.min(1, (ts - t0) / 1400);
          el.style.setProperty('--p', (100 * (1 - Math.pow(1 - k, 3))).toFixed(1) + '%');
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className={s.qr} ref={ring}>
      <div className={s.in}>
        <Image src="/vippsdonasjon.png" alt="QR-kode for å gi med Vipps" width={150} height={150} />
      </div>
    </div>
  );
}

export default function StottOss() {
  return (
    <section className={s.block} id="stott">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2>Følg med og støtt oss</h2>
          <p>Nyheter og arrangementer legges ut på Facebook. Moskeen drives av gaver fra fellesskapet.</p>
        </div>
        <div className={s.duo}>
          <article className={s.panel}>
            <header>
              <h3>Fra Facebook</h3>
              <a className={s.link} href={FACEBOOK} target="_blank" rel="noopener noreferrer">Åpne siden</a>
            </header>
            <FacebookPanel />
          </article>
          <article className={`${s.panel} ${s.give}`}>
            <header>
              <h3>Støtt moskeen</h3>
              <Link className={s.link} href="/donate">Flere måter å gi</Link>
            </header>
            <p>Gavene går til driften av moskeen og undervisningen for barn og unge.</p>
            <VippsRing />
            <div className={s.vnum}>
              <span>Vipps-nummer</span>
              <b className={s.num}>{VIPPS.number}</b>
              <a className={`${s.btn} ${s.vipps}`} href={VIPPS.url} target="_blank" rel="noopener noreferrer">Gi med Vipps</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
