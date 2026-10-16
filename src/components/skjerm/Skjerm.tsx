'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { HeartHandshake, MessageCircle, UserPlus, type LucideIcon } from 'lucide-react';
import type { SkjermSlug } from '@/lib/skjerm';
import s from './skjerm.module.css';

export interface SkjermCard {
  slug: SkjermSlug;
  title: string;
  line: string;
  /** The address the code opens, shown under it for anyone who would rather type it. */
  address: string;
  qr: { size: number; d: string };
}

const ICONS: Record<SkjermSlug, LucideIcon> = {
  whatsapp: MessageCircle,
  vipps: HeartHandshake,
  medlem: UserPlus,
};

/** With no touch for this long, the code closes and the three buttons come back. */
const IDLE_MS = 45_000;

export function Skjerm({ cards }: { cards: SkjermCard[] }) {
  const [open, setOpen] = useState<SkjermSlug | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const card = cards.find((c) => c.slug === open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    let timer = window.setTimeout(() => setOpen(null), IDLE_MS);
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(null), IDLE_MS);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else restart();
    };
    window.addEventListener('pointerdown', restart);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', restart);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={s.screen} data-skjerm onContextMenu={(e) => e.preventDefault()}>
      <header className={s.head}>
        <Image className={s.logo} src="/hvit_rahma_300.png" alt="Masjid Rahma" width={219} height={300} priority />
        <div>
          <h1 className={s.title}>Velkommen til Masjid Rahma</h1>
          <p className={s.lead}>Trykk på en knapp, og skann koden med mobilen.</p>
        </div>
      </header>

      <div className={s.cards}>
        {cards.map((c) => {
          const Icon = ICONS[c.slug];
          return (
            <button
              key={c.slug}
              type="button"
              className={s.card}
              data-slug={c.slug}
              aria-haspopup="dialog"
              onClick={() => setOpen(c.slug)}
            >
              <span className={s.icon} aria-hidden="true">
                <Icon strokeWidth={1.75} />
              </span>
              <span className={s.cardText}>
                <span className={s.cardTitle}>{c.title}</span>
                <span className={s.cardLine}>{c.line}</span>
              </span>
            </button>
          );
        })}
      </div>

      {card && (
        <div className={s.backdrop} onClick={() => setOpen(null)}>
          <div
            className={s.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skjerm-kode"
            data-slug={card.slug}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="skjerm-kode" className={s.sheetTitle}>{card.title}</h2>
            <p className={s.sheetLine}>{card.line}</p>
            <svg
              className={s.qr}
              viewBox={`-2 -2 ${card.qr.size + 4} ${card.qr.size + 4}`}
              shapeRendering="crispEdges"
              role="img"
              aria-label={`QR-kode til ${card.address}`}
            >
              <rect x="-2" y="-2" width={card.qr.size + 4} height={card.qr.size + 4} fill="#fff" />
              <path d={card.qr.d} fill="#0f1d18" />
            </svg>
            <p className={s.how}>Åpne kameraet på mobilen og pek det mot koden.</p>
            <p className={s.address}>{card.address}</p>
            <button ref={closeRef} type="button" className={s.back} onClick={() => setOpen(null)}>
              Tilbake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
