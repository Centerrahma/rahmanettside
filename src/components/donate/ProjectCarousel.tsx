'use client';

import { Fragment, useRef, useState, useEffect } from 'react';
import type { DonationProject } from '@/types/donation';
import ProjectCard from './ProjectCard';
import CompactProjectTile from './CompactProjectTile';
import CompactVippsTile from './CompactVippsTile';

interface ProjectCarouselProps {
    projects: DonationProject[];
    translations: {
        projectTitles: Record<string, string>;
        raisedLabel: string;
        targetLabel: string;
        fundedLabel: string;
        donorsLabel: string;
        vsLastMonthLabel: string;
        raisedThisMonthLabel: string;
    };
}

export default function ProjectCarousel({
    projects,
    translations: t,
}: ProjectCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Small buffer for floating point inaccuracies
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        // Initial check
        checkScroll();

        // Add event listener for window resize to re-check scrollability
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            // Scroll by roughly one card width (or more depending on preference)
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const projectsWithoutMihrab = projects.filter(p => p.id !== 'mihrab');
    const mihrab = projects.find(p => p.id === 'mihrab');

    return (
        <div className="relative mb-16">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <span className="material-icons text-primary">foundation</span>
                        Pågående Prosjekter
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1">
                        Sveip eller bruk pilene for å se alle delmål for den nye moskéen.
                    </p>
                </div>

                {/* Desktop Navigation Arrows */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${canScrollLeft
                                ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary text-[var(--color-text)]'
                                : 'bg-transparent border-[var(--color-border)] opacity-30 cursor-not-allowed'
                            }`}
                        aria-label="Scroll left"
                    >
                        <span className="material-icons">chevron_left</span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${canScrollRight
                                ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary text-[var(--color-text)]'
                                : 'bg-transparent border-[var(--color-border)] opacity-30 cursor-not-allowed'
                            }`}
                        aria-label="Scroll right"
                    >
                        <span className="material-icons">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* MOBILE: Compact 2-col Grid (kept similar to before but contained) */}
            <div className="grid grid-cols-2 gap-2.5 md:hidden">
                {projectsWithoutMihrab.map((project, index) => (
                    <Fragment key={project.id}>
                        {/* Insert Vipps tile after first project */}
                        {index === 1 && (
                            <CompactVippsTile onClick={() => { }} />
                        )}
                        <CompactProjectTile
                            project={project}
                            title={t.projectTitles[project.id] ?? project.titleKey}
                            targetLabel={t.targetLabel}
                            onClick={() => { }}
                        />
                    </Fragment>
                ))}
                {mihrab && (
                    <CompactProjectTile
                        project={mihrab}
                        title={t.projectTitles[mihrab.id] ?? mihrab.titleKey}
                        targetLabel={t.targetLabel}
                        onClick={() => { }}
                    />
                )}
            </div>

            {/* DESKTOP: Horizontal Scrollable Area */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="hidden md:flex overflow-x-auto gap-5 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {projectsWithoutMihrab.map((project, index) => (
                    <Fragment key={project.id}>
                        {index === 1 && (
                            <div className="snap-start shrink-0 w-[300px] lg:w-[340px]">
                                <div className="glass-panel bento-card p-4 relative overflow-hidden flex flex-col justify-center items-center h-full group hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-300 text-center">
                                    <div className="flex flex-col items-center justify-center flex-1">
                                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-1.5">Vipps</h3>
                                        <p className="text-4xl font-bold text-primary tracking-wider">77811</p>
                                    </div>
                                    <p className="text-xs font-medium text-[var(--color-text-muted)] mt-3">
                                        Velg kategori du ønsker å donere til
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="snap-start shrink-0 w-[300px] lg:w-[340px] h-[220px]">
                            <ProjectCard
                                project={project}
                                title={t.projectTitles[project.id] ?? project.titleKey}
                                raisedLabel={t.raisedLabel}
                                targetLabel={t.targetLabel}
                                fundedLabel={t.fundedLabel}
                                donorsLabel={t.donorsLabel}
                                vsLastMonthLabel={t.vsLastMonthLabel}
                                raisedThisMonthLabel={t.raisedThisMonthLabel}
                            />
                        </div>
                    </Fragment>
                ))}
                {mihrab && (
                    <div className="snap-start shrink-0 w-[300px] lg:w-[340px] h-[220px]">
                        <ProjectCard
                            project={mihrab}
                            title={t.projectTitles[mihrab.id] ?? mihrab.titleKey}
                            raisedLabel={t.raisedLabel}
                            targetLabel={t.targetLabel}
                            fundedLabel={t.fundedLabel}
                            donorsLabel={t.donorsLabel}
                            vsLastMonthLabel={t.vsLastMonthLabel}
                            raisedThisMonthLabel={t.raisedThisMonthLabel}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
