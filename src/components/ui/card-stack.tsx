'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

export interface CardStackItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  href?: string;
  ctaText?: string;
  icon?: React.ReactNode;
}

export interface CardStackProps {
  cards: CardStackItem[];
  className?: string;
  onCardChange?: (index: number) => void;
}

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const OFFSET = 10; // % offset per stacked card
const SCALE_STEP = 0.06;
const DIM_STEP = 0.15;
const SWIPE_THRESHOLD = 50;

const SPRING = {
  type: 'spring' as const,
  stiffness: 170,
  damping: 26,
};

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function CardStack({
  cards,
  className,
  onCardChange,
}: CardStackProps) {
  const [orderedCards, setOrderedCards] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | null>(
    null,
  );
  const [showInfo, setShowInfo] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-200, 0, 200], [15, 0, -15]);

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Notify parent of card change
  useEffect(() => {
    onCardChange?.(currentIndex);
  }, [currentIndex, onCardChange]);

  const moveToEnd = useCallback(() => {
    setOrderedCards((prev) => [...prev.slice(1), prev[0]]);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const moveToStart = useCallback(() => {
    setOrderedCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        moveToStart();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        moveToEnd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveToEnd, moveToStart]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
        if (offset < 0 || velocity < 0) {
          setDragDirection('up');
          setTimeout(() => {
            moveToEnd();
            setDragDirection(null);
          }, 150);
        } else {
          setDragDirection('down');
          setTimeout(() => {
            moveToStart();
            setDragDirection(null);
          }, 150);
        }
      }
      dragY.set(0);
    },
    [dragY, moveToEnd, moveToStart],
  );

  return (
    <div
      className={`relative ${className ?? ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Showcase cards"
    >
      {/* Navigation arrows */}
      <button
        onClick={moveToStart}
        aria-label="Previous card"
        className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                   border transition-colors
                   bg-[var(--glass-card-bg)] border-[var(--glass-card-border)]
                   backdrop-blur-md text-[var(--color-text)]
                   hover:border-[var(--color-primary-val)]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={moveToEnd}
        aria-label="Next card"
        className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                   border transition-colors
                   bg-[var(--glass-card-bg)] border-[var(--glass-card-border)]
                   backdrop-blur-md text-[var(--color-text)]
                   hover:border-[var(--color-primary-val)]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Card stack */}
      <div className="relative w-full aspect-[16/10] overflow-visible">
        <ul className="relative w-full h-full m-0 p-0">
          <AnimatePresence>
            {orderedCards.map((card, i) => {
              const isFront = i === 0;
              const brightness = Math.max(0.3, 1 - i * DIM_STEP);
              const baseZ = orderedCards.length - i;

              return (
                <motion.li
                  key={card.id}
                  className="absolute w-full h-full list-none overflow-hidden rounded-2xl
                             border border-[var(--glass-card-border)]"
                  style={{
                    cursor: isFront ? 'grab' : 'auto',
                    touchAction: 'none',
                    boxShadow: isFront
                      ? '0 25px 50px rgba(0, 0, 0, 0.3)'
                      : '0 15px 30px rgba(0, 0, 0, 0.15)',
                    rotateX: isFront && !reducedMotion ? rotateX : 0,
                    transformPerspective: 1000,
                  }}
                  animate={{
                    top: `${i * -OFFSET}%`,
                    scale: 1 - i * SCALE_STEP,
                    filter: `brightness(${brightness})`,
                    zIndex: baseZ,
                    opacity: dragDirection && isFront ? 0 : 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  transition={reducedMotion ? { duration: 0 } : SPRING}
                  drag={isFront && !reducedMotion ? 'y' : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.7}
                  onDrag={(_, info) => {
                    if (isFront) dragY.set(info.offset.y);
                  }}
                  onDragEnd={isFront ? handleDragEnd : undefined}
                  whileDrag={
                    isFront
                      ? {
                          zIndex: orderedCards.length + 1,
                          cursor: 'grabbing',
                          scale: 1.02,
                        }
                      : {}
                  }
                  onHoverStart={() => isFront && setShowInfo(true)}
                  onHoverEnd={() => setShowInfo(false)}
                >
                  {/* Card image */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover pointer-events-none select-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                    priority={isFront}
                    draggable={false}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Card content overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isFront && showInfo ? 1 : 0,
                      y: isFront && showInfo ? 0 : 20,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.icon && <div className="mb-2">{card.icon}</div>}
                    {card.subtitle && (
                      <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-1">
                        {card.subtitle}
                      </p>
                    )}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2 mb-4 max-w-lg">
                      {card.description}
                    </p>
                    {card.href && card.ctaText && (
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                                   bg-[var(--color-primary-val)] text-white
                                   font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {card.ctaText}
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          arrow_forward
                        </span>
                      </Link>
                    )}
                  </motion.div>

                  {/* Always-visible title (when info overlay is hidden) */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5 sm:p-8"
                    animate={{
                      opacity: isFront && !showInfo ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.icon && <div className="mb-2">{card.icon}</div>}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-sm text-white/70">{card.subtitle}</p>
                    )}
                  </motion.div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex % cards.length
                ? 'bg-[var(--color-primary-val)] w-8'
                : 'bg-[var(--color-border)] w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
