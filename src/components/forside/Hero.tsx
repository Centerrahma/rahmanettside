'use client';

import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import type { PrayerSchedule } from '@/types/prayer';
import { until } from '@/lib/prayer-clock';
import SkyArch from './SkyArch';
import { dates, useClock } from './useClock';
import f from './forside.module.css';
import s from './hero.module.css';

/* The front page's first screen: a column for the name and the day's prayers, the mihrab photo beside it.
   Phones get the upright photo with the name on its carpet, and the five prayers straight under it. */

const ALT = 'Mihraben og minbaren i Masjid Rahma, under verset fra Koranen 72:18, med bønneteppet foran.';
const common = { alt: ALT, fill: true, priority: true, quality: 75 } as const;
const wide = getImageProps({ ...common, src: '/mihrab-forside-lys.webp', sizes: '(max-width: 860px) 100vw, 70vw' }).props;
const tall = getImageProps({ ...common, src: '/mihrab-mobil-lys.webp', sizes: '100vw' }).props;

export default function Hero({ schedule, friday }: { schedule: PrayerSchedule; friday: boolean }) {
  const { clock, slots, nx, past } = useClock(schedule, friday);
  const d = dates(clock?.at);

  return (
    <section className={s.hero} aria-labelledby="forside-h1">
      <div className={s.panel}>
        <Image className={s.logo} src="/rahma-logo.png" alt="" width={601} height={640} sizes="150px" priority />
        <div className={s.head}>
          <h1 id="forside-h1">Center Rahma</h1>
          <p className={s.addr}>Moskeen i Tvetenveien 152A, Oslo</p>
        </div>
        <div className={s.ctas}>
          <Link className={`${f.btn} ${f.primary}`} href="/stott-oss">Støtt oss</Link>
          <Link className={`${f.btn} ${f.quiet}`} href="/blimedlem">Bli medlem</Link>
        </div>

        <p className={s.date}>
          <b>{d.day || 'Bønnetider i dag'}</b>
          {d.hijri && <span> · {d.hijri}</span>}
        </p>
        <ol className={s.list} aria-label="Bønnetider i dag">
          {slots.map((slot, i) => (
            <li key={slot.key} className={`${nx?.index === i ? s.next : ''} ${past[i] ? s.past : ''}`}>
              <span className={s.arch}><SkyArch i={i} next={nx?.index === i} id={`d${i}`} /></span>
              <span className={s.label}>
                {nx?.index === i && <em>Neste, {nx.tomorrow ? 'i morgen om ' : 'om '}{until(nx.left)}</em>}
                <b>{slot.name}</b>
                <small className={f.num}>{slot.note}</small>
              </span>
              <span className={`${s.time} ${f.num}`}>{slot.time}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.photo}>
        <picture>
          <source media="(max-width: 600px)" srcSet={tall.srcSet} sizes={tall.sizes} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- the alt comes from getImageProps */}
          <img {...wide} />
        </picture>
      </div>
    </section>
  );
}
