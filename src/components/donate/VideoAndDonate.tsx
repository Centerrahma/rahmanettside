'use client';

import { Fragment, useState, useRef } from 'react';
import { Play } from 'lucide-react';
import type { DonationProject } from '@/types/donation';
import DonationWidget from './DonationWidget';
import CompactProjectTile from './CompactProjectTile';
import CompactVippsTile from './CompactVippsTile';
import StatsRow from './StatsRow';

interface VideoAndDonateProps {
    projects: DonationProject[];
    translations: {
        makeADonation: string;
        donationSubtitle: string;
        oneTimeLabel: string;
        monthlyLabel: string;
        customAmountLabel: string;
        confirmLabel: string;
        securityNote: string;
        processingLabel: string;
        projectTitles: Record<string, string>;
        targetLabel: string;
    };
    statsRowProps: {
        transparencyLabel: string;
        transparencyDesc: string;
        taxLabel: string;
        taxDesc: string;
        accessLabel: string;
        accessDesc: string;
        secureLabel: string;
        secureDesc: string;
    };
}

export default function VideoAndDonate({ projects, translations: t, statsRowProps }: VideoAndDonateProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const projectsWithoutMihrab = projects.filter(p => p.id !== 'mihrab');
    const mihrab = projects.find(p => p.id === 'mihrab');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-16">
            {/* Left: Projects Grid & Video Section */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full gap-6">

                {/* 4x2 Grid of Projects (2x4 on mobile) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    {projectsWithoutMihrab.map((project, index) => (
                        <Fragment key={project.id}>
                            {/* Insert Vipps tile after first project */}
                            {index === 1 && (
                                <CompactVippsTile onClick={() => { }} />
                            )}
                            <div className="min-h-0 lg:min-h-[150px]">
                                <CompactProjectTile
                                    project={project}
                                    title={t.projectTitles[project.id] ?? project.titleKey}
                                    targetLabel={t.targetLabel}
                                    onClick={() => { }}
                                />
                            </div>
                        </Fragment>
                    ))}
                    {mihrab && (
                        <div className="min-h-0 lg:min-h-[150px]">
                            <CompactProjectTile
                                project={mihrab}
                                title={t.projectTitles[mihrab.id] ?? mihrab.titleKey}
                                targetLabel={t.targetLabel}
                                onClick={() => { }}
                            />
                        </div>
                    )}
                </div>

                {/* Video Container: Fills remaining height on desktop */}
                <div className="glass-panel p-2 md:p-3 flex-grow flex flex-col min-h-[300px] lg:min-h-[450px]">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/5 flex-grow shadow-inner flex items-center justify-center group">
                        <video
                            ref={videoRef}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/nymoskeoversikt.png"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                        >
                            <source src="/NyRahmavideo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Custom Play Button Overlay */}
                        {!isPlaying && (
                            <button
                                onClick={handlePlayClick}
                                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-10"
                                aria-label="Play video"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                    <Play className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1.5" fill="currentColor" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Donation Widget and StatsRow */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-24 h-full">
                <div className="">
                    <DonationWidget
                        title={t.makeADonation}
                        subtitle={t.donationSubtitle}
                        oneTimeLabel={t.oneTimeLabel}
                        monthlyLabel={t.monthlyLabel}
                        customAmountLabel={t.customAmountLabel}
                        confirmLabel={t.confirmLabel}
                        securityNote={t.securityNote}
                        processingLabel={t.processingLabel}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    {/* Embedded StatsRow under payment system configured as 2x2 grid */}
                    <StatsRow {...statsRowProps} className="col-span-2 !grid-cols-2" />
                </div>
            </div>
        </div>
    );
}
