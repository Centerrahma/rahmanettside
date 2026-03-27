'use client';

import { useTranslations } from 'next-intl';
import { useCountdown } from '@/hooks/useCountdown';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PRAYER_ICONS, PROJECTS } from '@/lib/constants';
import { HeartHandshake, Mail, Users, Download, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import CalendarCard from './CalendarCard';
import PrayerCard from './PrayerCard';
import type { PrayerName } from '@/types/prayer';
import { useEffect, useState } from 'react';

/* ─── Animated border wrapper ─── */
function GlassCard({
  children,
  className = '',
  animatedBorder = true,
}: {
  children: React.ReactNode;
  className?: string;
  animatedBorder?: boolean;
}) {
  if (!animatedBorder) {
    return (
      <div className={`hero-glass-card rounded-2xl p-3 md:p-5 h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl p-[1px] overflow-hidden group ${className}`}>
      {/* Spinning conic gradient behind the card (desktop only) */}
      <div
        className="hidden md:block absolute inset-[-50%]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)',
          animation: 'border-spin 12s linear infinite',
          opacity: 0.25,
        }}
      />
      {/* Static gradient border fallback (mobile only) */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-br from-[rgba(var(--color-primary-rgb),0.3)] via-transparent to-[rgba(198,162,85,0.2)]" />

      {/* Card content */}
      <div className="relative hero-glass-card rounded-2xl p-2 md:p-3 h-full flex flex-col transition-all duration-300 md:group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.15)]">
        {children}
      </div>
    </div>
  );
}

/* ─── Circular SVG Progress ─── */
function CircularProgress({ percentage, size = 64 }: { percentage: number; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Invert the offset so it fills up or empties based on percentage
  // If we want it to act as a countdown (emptying), we can adjustments here.
  // For time passed: fills up. For time remaining: empties.
  // Let's make it "time remaining" style (starts full, goes to empty) or "time passed" (starts empty, goes full).
  // Usually countdowns "drain". Let's assume drain.
  // If percentage is "percent of time passed", then drain = 100 - passed.
  // Let's stick to: input percentage is "how much to show".
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-text)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ filter: 'none' }}
      />
    </svg>
  );
}

/* ─── Dashboard: Rotating Project Showcase ─── */
/* ─── Dashboard: Rotating Project Showcase ─── */
function ProjectShowcaseCard() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Longer interval to let users read
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const project = PROJECTS[currentIndex];

  return (
    <GlassCard className="col-span-12 md:col-span-4 relative group overflow-hidden">
      {/* Background progress fill (subtle) */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-[5000ms] ease-linear"
        key={project.id} // Reset animation on change
        style={{ width: '100%' }}
      />

      <div
        className={`flex items-center justify-center gap-5 flex-1 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Large Circular Progress */}
        <div className="relative flex-shrink-0 w-10 h-10 md:w-16 md:h-16">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-[var(--color-border)]"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Progress Circle */}
            <path
              className="text-[var(--color-text)] transition-all duration-1000 ease-out"
              strokeDasharray={`${project.percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs md:text-sm font-bold text-[var(--color-text)] font-mono tracking-tighter">
              {project.percentage}%
            </span>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-[8px] uppercase tracking-widest text-[var(--color-text)] opacity-60 mb-0.5">
            {t('donate.sectionTitle')}
          </div>
          <h3 className="text-sm md:text-base font-bold text-[var(--color-text)] leading-none mb-1 line-clamp-2">
            {t(project.titleKey)}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[var(--color-text)] font-bold">{project.raised.toLocaleString()}</span>
            <span className="text-xs text-[var(--color-text)] opacity-60">/ {project.target.toLocaleString()} kr</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}



/* ─── Dashboard: Countdown Progress ─── */
function CountdownCard() {
  const t = useTranslations('prayer');
  const { schedule } = usePrayerTimes();
  const nextPrayer = useNextPrayer(schedule);
  const countdown = useCountdown(nextPrayer?.time ?? null);
  const [progress, setProgress] = useState(0);

  // Calculate progress for the circular indicator
  useEffect(() => {
    if (!nextPrayer) return;

    const now = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const nextTime = new Date();
    nextTime.setHours(hours, minutes, 0, 0);

    // If next prayer is tomorrow (e.g. Fajr), add a day
    if (nextTime < now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    // We need a reference point for "start time" to calculate percentage.
    // For simplicity, let's assume a fixed window or calculate from previous prayer.
    // But since we don't have previous prayer easily, let's just make it a visual indicator 
    // that pulses or fills based on seconds remaining within the last hour/minute?
    // OR: Just make it a full circle that acts as a decorative frame for the countdown.
    // Let's try to estimate "percentage remaining of the current hour" or something dynamic?
    // Actually, users usually like "time passed since last prayer" vs "total time".
    // For now, let's just set it to a static "75%" or animate it purely for visual effect if we can't derive exact start.
    // BETTER: Use (Total Seconds - Seconds Remaining) / Total Seconds.
    // Let's just make it "seconds" based for a smooth animation or just fixed 100% with pulse.
    // Actually, the user asked to "put it in the same box that has the new mask thing to adjust the size".
    // I'll make it fill based on: 100% at 00:00:00 left. 
    // But that's hard without a start time.
    // Let's just use a visual effect. A full circle is fine.

    // Let's use seconds to drive a subtle animation?
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();
    // distinct pulse
    setProgress(100);

  }, [nextPrayer]);

  return (
    <GlassCard className="col-span-12 md:col-span-3 relative">
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="text-[8px] uppercase tracking-widest text-[var(--color-text)] opacity-60 mb-1 text-center">
          {t('timeUntil')}
        </div>

        <div className="flex items-center justify-center relative">
          <div className="relative">
            <div className="hidden md:block">
              <CircularProgress percentage={100} size={64} />
            </div>
            <div className="md:hidden">
              <CircularProgress percentage={100} size={48} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-sm md:text-base font-bold text-[var(--color-text)] font-mono tabular-nums tracking-tight">
                {countdown.hours}:{countdown.minutes}
              </div>
              <div className="text-[8px] md:text-[10px] text-[var(--color-text)] opacity-60 font-mono">
                {countdown.seconds}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}



/* ─── Dashboard: Quick Actions ─── */
function QuickActionsCard() {
  return (
    <GlassCard className="col-span-12 sm:col-span-6">
      <div className="flex items-center gap-3 h-full">
        <Link href="/donate" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-semibold text-sm rounded-xl transition-all duration-200 hover:shadow-glow-lg">
          <HeartHandshake className="w-[18px] h-[18px]" />
          Donate
        </Link>
        <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[rgba(var(--color-primary-rgb),0.1)] hover:bg-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-text)] border border-[rgba(var(--color-primary-rgb),0.2)] font-semibold text-sm rounded-xl transition-all duration-200">
          <Mail className="w-[18px] h-[18px]" />
          Contact Us
        </Link>
      </div>
    </GlassCard>
  );
}

/* ─── Dashboard: Jummah Banner ─── */
function JummahCard({ schedule, t }: { schedule: ReturnType<typeof usePrayerTimes>['schedule']; t: ReturnType<typeof useTranslations> }) {
  return (
    <GlassCard className="col-span-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: icon + info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[rgba(var(--color-primary-rgb),0.12)] flex items-center justify-center flex-shrink-0 border border-[rgba(var(--color-primary-rgb),0.2)]">
            <Users className="w-[18px] h-[18px] md:w-5 md:h-5 text-[var(--color-text)]" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-[var(--color-text)]">
              {t('jummah')}
            </h4>
            <p className="text-[10px] md:text-xs text-[var(--color-text)] opacity-60">
              {t('khutbahAt', { time: schedule.jummah.khutbah })} •{' '}
              {t('prayerAt', { time: schedule.jummah.prayer })}
            </p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <a
            href="/Rahma_Kalendar.pdf"
            download="Rahma Kalendar.pdf"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-[var(--color-bg)] hover:bg-primary-dark transition-colors font-bold text-xs whitespace-nowrap shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            {t('ramadanCalendar')}
          </a>
          <a
            href="/Bonnetider_2026.xlsx"
            download="Bønnetider 2026.xlsx"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all font-medium text-xs whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            {t('downloadCalendar')}
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Tvetenveien+154,+Oslo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all font-medium text-xs whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5" />
            {t('getDirections')}
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

/* ─── Main Hero Section ─── */
export default function HeroSection() {
  const t = useTranslations('hero');
  const tPrayer = useTranslations('prayer');
  const { schedule } = usePrayerTimes();
  const nextPrayer = useNextPrayer(schedule);
  const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  return (
    <section className="relative lg:min-h-screen overflow-hidden">
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-8 md:pt-24 md:pb-6 lg:pt-36 lg:pb-10">

        {/* ── Hero Text ── */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-16">
          {/* Label */}
          <p
            className="text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]"
            style={{ fontFamily: 'var(--font-jakarta)', animation: 'hero-fade-up 0.8s ease-out both' }}
          >
            {t('label')}
          </p>

          {/* Decorative gold line with diamond */}
          <div
            className="flex items-center justify-center my-4 md:my-5"
            style={{ animation: 'hero-fade-up 0.8s ease-out 0.15s both' }}
            aria-hidden="true"
          >
            <div className="relative w-24 md:w-32 h-[1px]">
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
                style={{ backgroundColor: 'var(--color-gold)' }}
              />
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-[1.1] tracking-tight mb-5 md:mb-10"
            style={{ fontFamily: 'var(--font-display)', animation: 'hero-fade-up 0.8s ease-out 0.3s both' }}
          >
            {t('headline')}
          </h1>

          {/* CTA Buttons */}
          <div
            className="flex items-center gap-3 justify-center"
            style={{ animation: 'hero-fade-up 0.8s ease-out 0.45s both' }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-semibold text-sm rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.4)]"
            >
              {t('ctaVisit')}
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-[rgba(var(--color-primary-rgb),0.3)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[rgba(var(--color-primary-rgb),0.6)] font-semibold text-sm rounded-full transition-all duration-300"
            >
              {t('ctaSupport')}
            </Link>
          </div>
        </div>

        {/* ── Mobile-only: Project Showcase above dashboard ── */}
        <div className="md:hidden w-full max-w-sm mx-auto mb-4 px-2">
          <ProjectShowcaseCard />
        </div>

        {/* ── Dashboard Composite ── */}
        <div
          className="w-full max-w-5xl mx-auto"
          style={{ animation: 'dashboard-rise 1s ease-out 0.3s both' }}
        >
          {/* Outer glass container with animated border */}
          <div className="relative rounded-3xl p-[1px] overflow-hidden">
            {/* Outer spinning border (desktop only) */}
            <div
              className="hidden md:block absolute inset-[-50%]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, var(--color-primary-val) 10%, transparent 20%, rgba(198,162,85,0.6) 35%, transparent 45%, #047857 60%, transparent 70%, rgba(var(--color-primary-rgb),0.4) 85%, transparent 100%)',
                animation: 'border-spin 16s linear infinite',
                opacity: 0.25,
              }}
            />
            {/* Static outer border (mobile only) */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-tr from-[rgba(var(--color-primary-rgb),0.4)] via-[rgba(0,0,0,0.05)] to-[rgba(198,162,85,0.3)] opacity-40" />

            {/* Dashboard inner content */}
            <div className="relative hero-glass rounded-3xl p-2 md:p-3">
              {/* Top glow line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.3), rgba(198,162,85,0.2), rgba(var(--color-primary-rgb),0.3), transparent)',
                }}
                aria-hidden="true"
              />

              {/* Bento grid */}
              <div className="grid grid-cols-12 gap-1.5 md:gap-2.5">
                {/* Row 1: 5 Prayer Time Cards */}
                <div className="col-span-12 grid grid-cols-5 gap-1 md:gap-2.5">
                  {PRAYER_ORDER.map((name) => (
                    <PrayerCard
                      key={name}
                      name={name}
                      time={schedule.prayers[name].time}
                      iqamah={schedule.prayers[name].iqamah}
                      icon={PRAYER_ICONS[name]}
                      isActive={nextPrayer?.name === name}
                      label={tPrayer(name)}
                    />
                  ))}
                </div>

                {/* Row 1b: Mobile-only Iqamah row */}
                <div className="col-span-12 grid grid-cols-5 gap-1 md:hidden">
                  {PRAYER_ORDER.map((name) => (
                    <div
                      key={`iq-${name}`}
                      className="bg-[var(--color-surface)] card-glow-border rounded-lg p-2 flex flex-col items-center justify-center min-h-[48px] overflow-visible"
                    >
                      <span className="text-[7px] uppercase tracking-wide text-[var(--color-text)] opacity-60 leading-none mb-1">
                        Iqamah
                      </span>
                      <span className="text-sm font-bold text-[var(--color-text)] leading-none">
                        {schedule.prayers[name].iqamah || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Row 2: Jummah full-width */}
                <JummahCard schedule={schedule} t={tPrayer} />

                {/* Row 3: Project Showcase (desktop only) | Calendar | Countdown */}
                <div className="hidden md:block md:col-span-4">
                  <ProjectShowcaseCard />
                </div>
                <div className="hidden md:block md:col-span-5">
                  <CalendarCard />
                </div>
                <div className="hidden md:block md:col-span-3">
                  <CountdownCard />
                </div>

              </div>
            </div>
          </div>

          {/* Bottom ambient shadow / glow under the dashboard */}
          <div
            className="mx-auto mt-[-2px] w-3/4 h-16 opacity-30 pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(var(--color-primary-rgb),0.25) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
