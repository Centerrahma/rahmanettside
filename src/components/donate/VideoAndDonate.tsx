'use client';

import { Fragment } from 'react';
import type { DonationProject } from '@/types/donation';
import DonationWidget from './DonationWidget';
import CompactProjectTile from './CompactProjectTile';
import CompactVippsTile from './CompactVippsTile';

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
}

export default function VideoAndDonate({ projects, translations: t }: VideoAndDonateProps) {
    const projectsWithoutMihrab = projects.filter(p => p.id !== 'mihrab');
    const mihrab = projects.find(p => p.id === 'mihrab');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-16">
            {/* Left: Projects Grid & Video Section */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full gap-6">

                {/* 4x2 Grid of Projects (2x4 on mobile) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
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

                {/* Video Container: Fills remaining height on desktop */}
                <div className="glass-panel p-2 md:p-3 flex-grow flex flex-col min-h-[250px] lg:min-h-0">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/5 flex-grow shadow-inner flex items-center justify-center">
                        <video
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/nymoskeoversikt.png"
                        >
                            <source src="/NyRahmavideo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>

            {/* Right: Donation Widget */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 h-full">
                <div className="h-full">
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
            </div>
        </div>
    );
}
