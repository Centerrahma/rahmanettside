'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function GlassCard({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative rounded-2xl p-[1px] overflow-hidden group ${className}`}>
            {/* Spinning conic gradient behind the card */}
            <div
                className="absolute inset-[-50%]"
                style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, #11d483 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)',
                    animation: 'border-spin 12s linear infinite',
                    opacity: 0.05,
                }}
            />
            {/* Card content */}
            <div className="relative hero-glass-card rounded-2xl p-5 h-full transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(17,212,131,0.15)] flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
}

export default function CalendarCard() {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        // Update date every minute to handle day roll-over if user keeps page open
        const interval = setInterval(() => setDate(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    if (!date) {
        return (
            <GlassCard className="col-span-12 md:col-span-5 min-h-[100px]">
                <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                </div>
            </GlassCard>
        );
    }

    // Formatters
    const gregorianFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <GlassCard className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(var(--color-primary-rgb),0.15)] flex items-center justify-center shrink-0 border border-[rgba(var(--color-primary-rgb),0.2)]">
                    <span className="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                </div>

                <div className="min-w-0 flex-1">
                    {/* Gregorian */}
                    <div className="text-base font-bold text-[var(--color-text)]">
                        {gregorianFormatter.format(date)}
                    </div>

                    {/* Hijri */}
                    <div className="text-sm text-[var(--color-text-muted)] mt-0.5 font-medium">
                        {hijriFormatter.format(date)}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
