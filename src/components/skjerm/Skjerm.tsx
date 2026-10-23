'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Image from 'next/image';
import type { SkjermSlug } from '@/lib/skjerm';
import { MedlemMark, TitleRule, VippsMark, WhatsAppMark } from './marks';
import s from './skjerm.module.css';

export interface SkjermCard {
  slug: SkjermSlug;
  title: string;
  line: string;
  /** The address the code opens, shown under it for anyone who would rather type it. */
  address: string;
  qr: { size: number; d: string };
}

const MARKS: Record<SkjermSlug, ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppMark,
  vipps: VippsMark,
  medlem: MedlemMark,
};

/** With no touch for this long, the code closes and the three buttons come back. */
const IDLE_MS = 45_000;

function QrGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
    </svg>
  );
}

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

  const Mark = card ? MARKS[card.slug] : null;

  return (
    <div className={s.screen} data-skjerm onContextMenu={(e) => e.preventDefault()}>
      <header className={s.head}>
        <Image
          className={s.logo}
          src="/rahma-logo-white.webp"
          alt="Masjid Rahma"
          width={263}
          height={360}
          sizes="18vmin"
          priority
        />
        <h1 className={s.title}>Velkommen til Masjid Rahma</h1>
        <TitleRule className={s.rule} />
      </header>

      <div className={s.cards}>
        {cards.map((c) => {
          const CardMark = MARKS[c.slug];
          return (
            <button
              key={c.slug}
              type="button"
              className={s.card}
              data-slug={c.slug}
              aria-haspopup="dialog"
              onClick={() => setOpen(c.slug)}
            >
              <span className={s.mark}>
                <CardMark />
              </span>
              <span className={s.cardText}>
                <span className={s.cardTitle}>{c.title}</span>
                <span className={s.cardLine}>{c.line}</span>
                <span className={s.cue}>
                  <QrGlyph />
                  Trykk for QR-kode
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {card && Mark && (
        <div className={s.backdrop} onClick={() => setOpen(null)}>
          <div
            className={s.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skjerm-kode"
            data-slug={card.slug}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.band}>
              <span className={s.bandMark}>
                <Mark />
              </span>
              <h2 id="skjerm-kode" className={s.sheetTitle}>{card.title}</h2>
              <p className={s.sheetLine}>{card.line}</p>
            </div>
            <div className={s.body}>
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
        </div>
      )}
    </div>
  );
}
