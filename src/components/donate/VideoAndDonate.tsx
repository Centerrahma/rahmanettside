'use client';

import DonationWidget from './DonationWidget';

interface VideoAndDonateProps {
    translations: {
        makeADonation: string;
        donationSubtitle: string;
        oneTimeLabel: string;
        monthlyLabel: string;
        customAmountLabel: string;
        confirmLabel: string;
        securityNote: string;
        processingLabel: string;
    };
}

export default function VideoAndDonate({ translations: t }: VideoAndDonateProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left: Video Section */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
                <div className="glass-panel p-2 md:p-4 h-full flex flex-col">
                    <div className="relative w-full rounded-lg overflow-hidden bg-black/5 aspect-video flex-grow shadow-inner flex items-center justify-center group cursor-pointer">
                        {/* Placeholder for video. In real life, replace with an iframe or HTML5 video */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/80 z-10 transition-opacity duration-300 group-hover:from-black/30 group-hover:to-black/70" />

                        {/* Optional background image for video thumbnail, using the Moske hero image as placeholder */}
                        <img
                            src="/nymoskeoversikt.png"
                            alt="Video Thumbnail"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Play Button Overlay */}
                        <div className="relative z-20 flex flex-col items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 backdrop-blur-md border border-white/20 mb-4">
                                <span className="material-icons text-3xl md:text-4xl ml-2">play_arrow</span>
                            </div>
                            <p className="text-white font-medium text-sm md:text-base tracking-wide text-glow">Se presentasjon</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Donation Widget */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
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
    );
}
