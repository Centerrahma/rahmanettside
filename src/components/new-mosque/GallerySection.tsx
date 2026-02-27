'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GallerySectionProps {
    title?: string;
    subtitle?: string;
}

export default function GallerySection({
    title = "Sniktitt av Fremtiden",
    subtitle = "Slik vil nye Masjid Rahma se ut, insha'Allah."
}: GallerySectionProps) {

    // Using the available high-res image and the newly added gallery images
    const images = [
        {
            src: '/RahmaGalleri1.jpg',
            alt: 'Nye Masjid Rahma interiør 1',
        },
        {
            src: '/RahmaGalleri2.jpg',
            alt: 'Nye Masjid Rahma klasserom',
        },
        {
            src: '/RahmaGalleri3.jpg',
            alt: 'Nye Masjid Rahma tak og lys detaljer',
        },
        {
            src: '/RahmaGalleri4.jpg',
            alt: 'Nye Masjid Rahma bønnesal',
        },
        {
            src: '/RahmaGalleri5.jpg',
            alt: 'Nye Masjid Rahma bueganger',
        },
        {
            src: '/RahmaGalleri6.jpg',
            alt: 'Nye Masjid Rahma interiørdetalj',
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    // Auto-play functionality
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <section className="mt-20 mb-16 px-4 md:px-0">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--color-text)]">{title}</h2>
                <p className="text-sm md:text-base text-[var(--color-text-muted)]">{subtitle}</p>
            </div>

            <div className="relative w-full max-w-5xl mx-auto h-[50vh] md:h-[70vh] min-h-[350px] max-h-[800px] rounded-2xl overflow-hidden glass-panel group bg-black/5 dark:bg-white/5">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-4"
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority={currentIndex === 0}
                            />
                        </div>
                        {/* Elegant gradient overlay for text readability if needed in the future */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    onClick={(e) => { e.preventDefault(); handlePrev(); }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 text-white backdrop-blur-md transition-all z-50"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <button
                    onClick={(e) => { e.preventDefault(); handleNext(); }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 dark:bg-white/10 dark:hover:bg-white/20 text-white backdrop-blur-md transition-all z-50"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
