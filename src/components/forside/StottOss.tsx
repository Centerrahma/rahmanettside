'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FACEBOOK, VIPPS } from './links';
import s from './forside.module.css';

/** Same breakpoint as the phone layout in forside.module.css. */
const PHONE = '(max-width: 860px)';

/* Facebook's page plugin shows posts only to visitors logged in to Facebook in a
   browser that lets it set cookies; everyone else gets a blank frame or a login
   wall. The owner's call: phones get the feed anyway, desktops get a plain card. */
function FacebookCard() {
  return (
    <div className={s.fbcard}>
      <svg className={s.fblogo} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      <b>Masjid Rahma på Facebook</b>
      <p>Nyheter, arrangementer og beskjeder fra moskeen.</p>
      <a className={`${s.btn} ${s.fb}`} href={FACEBOOK} target="_blank" rel="noopener noreferrer">Følg oss på Facebook</a>
    </div>
  );
}

/** On phones only: mounts the page plugin when the panel comes close to the screen. */
function FacebookFeed() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !matchMedia(PHONE).matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const w = Math.min(500, Math.max(180, Math.round(el.clientWidth)));
        const h = Math.max(380, Math.round(el.clientHeight));
        const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK)}&tabs=timeline&width=${w}&height=${h}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;
        const frame = document.createElement('iframe');
        Object.assign(frame, { title: 'Masjid Rahma på Facebook', src, width: String(w), height: String(h) });
        frame.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
        el.replaceChildren(frame);
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div className={s.fbbox} ref={box} />;
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
        </div>
        <div className={s.duo}>
          <article className={`${s.panel} ${s.follow}`}>
            <header>
              <h3>Følg med</h3>
              <a className={`${s.link} ${s.phoneOnly}`} href={FACEBOOK} target="_blank" rel="noopener noreferrer">Åpne siden</a>
            </header>
            <FacebookCard />
            <FacebookFeed />
          </article>
          <article className={`${s.panel} ${s.give}`}>
            <header>
              <h3>Støtt moskeen</h3>
              <Link className={s.link} href="/stott-oss">Flere måter å gi</Link>
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
