'use client';

import { Fragment } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import type { DonationProject } from '@/types/donation';
import DonationWidget from './DonationWidget';
import CompactProjectTile from './CompactProjectTile';
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-16">
            {/* Left: Projects Grid & Video Section */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full gap-6">

                {/* 3x2 Grid of Projects (2x3 on mobile) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {projects.map((project, index) => (
                        <Fragment key={project.id}>
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
                </div>

                {/* Announcement Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-[1px]">
                    <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 px-5 py-4 md:px-8 md:py-5">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative flex items-start gap-3 md:gap-4">
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 block">
                                    Alhamdulillah
                                </span>
                                <p className="text-emerald-100 text-sm md:text-[15px] leading-relaxed font-medium">
                                    Ventilasjon, Nytt kjøkken, Belysning og Minbar er nå fullfinansiert! Måtte Allah <span className="text-emerald-300">subhanahu wa ta&apos;ala</span> belønne alle som har bidratt og delt dette prosjektet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Container: Fills remaining height on desktop */}
                <div className="glass-panel p-2 md:p-3 flex-grow flex flex-col min-h-[300px] lg:min-h-[450px]">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/5 flex-grow shadow-inner">
                        <Image
                            src="/RahmaGalleri1.jpg"
                            alt="Nye Masjid Rahma"
                            fill
                            className="object-cover"
                        />
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
