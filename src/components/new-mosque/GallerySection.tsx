'use client';

import Image from 'next/image';

interface GallerySectionProps {
    title?: string;
    subtitle?: string;
}

export default function GallerySection({
    title = "Sniktitt av Fremtiden",
    subtitle = "Slik vil nye Masjid Rahma se ut, insha'Allah."
}: GallerySectionProps) {

    // Using the available high-res image and some placeholders to demonstrate a beautiful masonry layout
    const images = [
        {
            src: '/nymoskeoversikt.png',
            alt: 'Nye Masjid Rahma oversikt',
            className: 'md:col-span-2 md:row-span-2 h-64 md:h-[500px]'
        },
        {
            src: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop', // Beautiful Mosque Interior
            alt: 'Mosque Interior details placeholder',
            className: 'h-48 md:h-[240px]'
        },
        {
            src: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800&auto=format&fit=crop', // Mosque Architecture
            alt: 'Architecture details',
            className: 'h-48 md:h-[240px]'
        },
        {
            src: 'https://images.unsplash.com/photo-1519817914152-2a640c547cba?q=80&w=800&auto=format&fit=crop', // Islamic Geometry
            alt: 'Islamic geometry details',
            className: 'md:col-span-2 h-48 md:h-[240px]'
        }
    ];

    return (
        <section className="mt-20 mb-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--color-text)]">{title}</h2>
                <p className="text-sm md:text-base text-[var(--color-text-muted)]">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={`relative rounded-xl overflow-hidden glass-panel group ${img.className}`}
                    >
                        {/* Conditional handling for Unsplash URLs vs Local URLs since Next.js Image component needs configured domains */}
                        {img.src.startsWith('http') ? (
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}

                        {/* Elegant vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                ))}
            </div>
        </section>
    );
}
