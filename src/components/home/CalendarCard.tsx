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
                    background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)',
                    animation: 'border-spin 12s linear infinite',
                    opacity: 0.05,
                }}
            />
            {/* Card content */}
            <div className="relative hero-glass-card rounded-2xl p-2 md:p-3 h-full transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)] flex flex-col justify-center">
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
                    <div className="h-4 bg-[var(--color-border)] rounded w-1/2"></div>
                    <div className="h-6 bg-[var(--color-border)] rounded w-3/4"></div>
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
            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[var(--color-bg)] text-lg">calendar_month</span>
                </div>

                <div className="min-w-0 flex-1">
                    {/* Gregorian */}
                    <div className="text-xs md:text-sm font-bold text-[var(--color-text)]">
                        {gregorianFormatter.format(date)}
                    </div>

                    {/* Hijri */}
                    <div className="text-[10px] md:text-xs text-[var(--color-text-muted)] mt-0.5 font-medium">
                        {hijriFormatter.format(date)}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
