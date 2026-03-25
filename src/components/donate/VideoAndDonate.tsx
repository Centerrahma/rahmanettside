'use client';

import { Fragment, useState, useRef } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import type { DonationProject } from '@/types/donation';
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

const VIPPS_DONATION_URL = 'https://qr.vipps.no/donations/43392';

export default function VideoAndDonate({ projects, translations: t, statsRowProps }: VideoAndDonateProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-16">
            {/* Left: Projects Grid & Video Section */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full gap-6">

                {/* 3x2 Grid of Projects (hidden on mobile) */}
                <div className="hidden md:grid md:grid-cols-3 gap-2 md:gap-4">
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

                        <div className="relative">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 block">
                                Alhamdulillah
                            </span>
                            <p className="text-emerald-100 text-sm md:text-[15px] leading-relaxed font-medium">
                                Ventilasjon, Nytt kjøkken, Belysning og Minbar er nå fullfinansiert! Måtte Allah <span className="text-emerald-300">subhanahu wa ta&apos;ala</span> belønne alle som har bidratt og delt dette prosjektet.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video Container: Fills remaining height on desktop */}
                <div className="glass-panel p-2 md:p-3 flex-grow flex flex-col min-h-[300px] lg:min-h-[450px]">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/5 flex-grow shadow-inner flex items-center justify-center group">
                        <video
                            ref={videoRef}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/nymoskeoversikt_opt.jpg"
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
                {/* Vipps Donation Section */}
                <div className="glass-panel p-4 md:p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                        <span className="material-icons text-primary text-2xl md:text-3xl">
                            volunteer_activism
                        </span>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold">{t.makeADonation}</h2>
                            <p className="text-[10px] md:text-xs text-[var(--color-text-muted)]">{t.donationSubtitle}</p>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3.5 mb-5">
                        <div className="flex items-start gap-2.5">
                            <span className="material-icons text-primary text-lg mt-0.5 flex-shrink-0">info</span>
                            <p className="text-sm leading-relaxed text-[var(--color-text)]">
                                Bruk QR-koden eller knappen nedenfor for å donere via Vipps. Du kan velge mellom <span className="font-bold">engangsbetaling</span> eller <span className="font-bold">månedlig trekk</span> med valgfritt beløp.
                            </p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-5">
                        <div className="rounded-2xl bg-white p-3 shadow-md">
                            <Image
                                src="/vippsdonasjon.png"
                                alt="Vipps donasjon QR-kode"
                                width={220}
                                height={220}
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Vipps button */}
                    <a
                        href={VIPPS_DONATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#ff5b24] hover:bg-[#e64f1e] text-white py-3 px-6 rounded-xl text-base font-bold flex items-center justify-center gap-2.5 transition-colors shadow-md"
                    >
                        <span>Doner med Vipps</span>
                        <span className="material-icons text-lg">open_in_new</span>
                    </a>
                </div>

                {/* Vipps numbers */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wide text-center mb-3">Send via Vipps</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-3 px-3 text-center">
                            <p className="text-2xl md:text-3xl font-black text-[#ff5b24] tracking-wide">77811</p>
                            <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] mt-1 font-medium">Vipps nr. 1</p>
                        </div>
                        <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-3 px-3 text-center">
                            <p className="text-2xl md:text-3xl font-black text-[#ff5b24] tracking-wide">43392</p>
                            <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] mt-1 font-medium">Vipps nr. 2</p>
                        </div>
                    </div>
                </div>

                {/* Legal info */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
                    <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="material-icons text-[var(--color-text-muted)] text-lg">info</span>
                        <span className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide">Juridisk informasjon</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-text)]">
                        Mottaker er <span className="font-bold">Center Rahma</span>. Org. nr: <span className="font-bold">974 444 216</span>.
                        Det er ingen bindingstid på avtaler om faste trekk. Enhver avtale kan sies opp ved å kontakte oss på{' '}
                        <a href="mailto:post@centerrahma.no" className="font-bold text-primary hover:underline">post@centerrahma.no</a>.
                    </p>
                </div>

                {/* Motivational message */}
                <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 border border-primary/20 px-5 py-5 text-center">
                    <p className="text-sm italic leading-relaxed text-[var(--color-text)] font-bold">
                        &ldquo;Den som bygger en moské for Allahs skyld, Allah vil bygge et hus for ham i Paradis.&rdquo;
                    </p>
                    <p className="text-xs text-[var(--color-text)] mt-1.5 font-bold">
                        — Sahih al-Bukhari &amp; Muslim
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <StatsRow {...statsRowProps} className="col-span-2 !grid-cols-2" />
                </div>
            </div>
        </div>
    );
}
