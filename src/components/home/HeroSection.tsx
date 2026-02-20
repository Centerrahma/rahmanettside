'use client';

import { useTranslations } from 'next-intl';
import { useCountdown } from '@/hooks/useCountdown';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { PRAYER_ICONS, PROJECTS, EVENTS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import Badge from '@/components/ui/Badge';
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
      <div className={`hero-glass-card card-glow-border rounded-2xl p-5 h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl p-[1px] overflow-hidden group ${className}`}>
      {/* Spinning conic gradient behind the card */}
      <div
        className="absolute inset-[-50%]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #11d483 15%, transparent 30%, #C6A255 50%, transparent 65%, #047857 80%, transparent 100%)',
          animation: 'border-spin 12s linear infinite',
          opacity: 0.08,
        }}
      />
      {/* Card content */}
      <div className="relative hero-glass-card card-glow-border rounded-2xl p-5 h-full flex flex-col transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(17,212,131,0.15)]">
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
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-primary-val)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ filter: 'drop-shadow(0 0 6px rgba(17, 212, 131, 0.4))' }}
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
        <div className="relative flex-shrink-0 w-24 h-24">
          <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-[rgba(255,255,255,0.1)]"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Progress Circle */}
            <path
              className="text-primary transition-all duration-1000 ease-out"
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
            <span className="text-2xl font-bold text-primary font-mono tracking-tighter">
              {project.percentage}%
            </span>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
            {t('donate.sectionTitle')}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] leading-none mb-2 line-clamp-2">
            {t(project.titleKey)}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-primary font-bold">{project.raised.toLocaleString()}</span>
            <span className="text-xs text-[var(--color-text-muted)]">/ {project.target.toLocaleString()} kr</span>
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
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2 text-center">
          {t('timeUntil')}
        </div>

        <div className="flex items-center justify-center relative">
          <div className="relative">
            <CircularProgress percentage={100} size={110} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-[var(--color-text)] font-mono tabular-nums tracking-tight">
                {countdown.hours}:{countdown.minutes}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] font-mono">
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
          <span className="material-symbols-outlined text-lg">volunteer_activism</span>
          Donate
        </Link>
        <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold text-sm rounded-xl transition-all duration-200">
          <span className="material-symbols-outlined text-lg">mail</span>
          Contact Us
        </Link>
      </div>
    </GlassCard>
  );
}

/* ─── Dashboard: Upcoming Activities ─── */
function UpcomingActivityCard() {
  const t = useTranslations('activities');
  const upcomingEvents = EVENTS.slice(0, 2);

  return (
    <GlassCard className="col-span-12 sm:col-span-6">
      <div className="flex flex-col gap-3 h-full">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[var(--color-bg)] text-lg">event</span>
          </div>
          <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide">
            {t('upcoming')}
          </h3>
        </div>

        {/* Events list */}
        <div className="flex flex-col gap-2 flex-1">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(var(--color-primary-rgb),0.05)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(var(--color-primary-rgb),0.15)] transition-all duration-200 cursor-pointer"
            >
              <Badge variant={event.category === 'education' ? 'community' : event.category}>{event.category}</Badge>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--color-text)] leading-tight mb-1 line-clamp-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {event.day} &bull; {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ─── Dashboard: Jummah Banner ─── */
function JummahCard({ schedule, t }: { schedule: ReturnType<typeof usePrayerTimes>['schedule']; t: ReturnType<typeof useTranslations> }) {
  return (
    <GlassCard className="col-span-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: icon + info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-[var(--color-bg)] text-2xl">groups</span>
          </div>
          <div>
            <h4 className="text-base font-bold text-[var(--color-text)]">
              {t('jummah')}
            </h4>
            <p className="text-sm text-[var(--color-text-muted)]">
              {t('khutbahAt', { time: schedule.jummah.khutbah })} •{' '}
              {t('prayerAt', { time: schedule.jummah.prayer })}
            </p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a
            href="/Rahma_Kalendar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.08)] transition-all font-medium text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">calendar_today</span>
            {t('downloadCalendar')}
          </a>
          <a
            href="https://maps.google.com/?q=Gronland+12,Oslo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[var(--color-bg)] hover:bg-primary-dark transition-colors font-bold text-sm whitespace-nowrap shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]"
          >
            <span className="material-symbols-outlined text-base">location_on</span>
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
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]">
      {/* Subtle Islamic pattern overlay */}
      <div className="absolute inset-0 pattern-islamic opacity-10 pointer-events-none" aria-hidden="true" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-28 pb-8 md:pt-36 md:pb-10">

        {/* ── Hero Text ── */}
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          style={{ animation: 'hero-fade-up 0.8s ease-out both' }}
        >
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-5 leading-[1.1] tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-64 py-4 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_35px_rgba(var(--color-primary-rgb),0.4)]"
            >
              {t('ctaVisit')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/become-member"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-64 py-4 bg-primary hover:bg-primary-dark text-[var(--color-bg)] border border-primary font-semibold rounded-full transition-all duration-300"
            >
              {t('ctaJoin')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
                person_add
              </span>
            </Link>

            <a
              href="/Rahma_Kalendar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-64 py-4 bg-primary hover:bg-primary-dark text-[var(--color-bg)] border border-primary font-semibold rounded-full transition-all duration-300"
            >
              {t('ctaRamadan')}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
                calendar_today
              </span>
            </a>
          </div>
        </div>

        {/* ── Dashboard Composite ── */}
        <div
          className="w-full max-w-5xl mx-auto"
          style={{ animation: 'dashboard-rise 1s ease-out 0.3s both' }}
        >
          {/* Outer glass container with animated border */}
          <div className="relative rounded-3xl p-[1px] overflow-hidden">
            {/* Outer spinning border */}
            <div
              className="absolute inset-[-50%]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, #11d483 10%, transparent 20%, rgba(198,162,85,0.6) 35%, transparent 45%, #047857 60%, transparent 70%, rgba(17,212,131,0.4) 85%, transparent 100%)',
                animation: 'border-spin 16s linear infinite',
                opacity: 0.08,
              }}
            />

            {/* Dashboard inner content */}
            <div className="relative hero-glass rounded-3xl p-4 md:p-6">
              {/* Top glow line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(17,212,131,0.3), rgba(198,162,85,0.2), rgba(17,212,131,0.3), transparent)',
                }}
                aria-hidden="true"
              />

              {/* Bento grid */}
              <div className="grid grid-cols-12 gap-3 md:gap-4">
                {/* Row 1: 5 Prayer Time Cards */}
                <div className="col-span-12 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
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

                {/* Row 2: Jummah full-width */}
                <JummahCard schedule={schedule} t={tPrayer} />

                {/* Row 3: Project Showcase | Calendar | Countdown */}
                <ProjectShowcaseCard />
                <CalendarCard />
                <CountdownCard />

                {/* Row 4: Quick Actions | Upcoming Activities */}
                <QuickActionsCard />
                <UpcomingActivityCard />
              </div>
            </div>
          </div>

          {/* Bottom ambient shadow / glow under the dashboard */}
          <div
            className="mx-auto mt-[-2px] w-3/4 h-16 opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(17,212,131,0.25) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
