import type { PrayerName } from '@/types/prayer';

interface PrayerCardProps {
  name: PrayerName;
  time: string;
  iqamah?: string;
  icon: string;
  isActive: boolean;
  label: string;
}

export default function PrayerCard({
  name,
  time,
  iqamah,
  icon,
  isActive,
  label,
}: PrayerCardProps) {
  if (isActive) {
    return (
      <div className="prayer-card-active rounded-lg p-1.5 md:p-3 flex flex-col items-center justify-center md:transform md:scale-[1.03] z-10 relative">
        <h4 className="text-[var(--color-text)] text-[9px] md:text-xs font-bold uppercase tracking-wider mb-0.5">
          {label}
        </h4>
        <p className="text-xs md:text-lg font-bold text-[var(--color-text)]">{time}</p>
        {iqamah && (
          <p className="text-[8px] md:text-[10px] text-[var(--color-text-muted)] mt-0.5">Iqamah {iqamah}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] card-glow-border rounded-lg p-1.5 md:p-3 flex flex-col items-center justify-center transition-all duration-300 hover:border-[var(--color-primary-val)] group">
      <h4 className="text-[var(--color-text)] text-[9px] md:text-xs font-medium uppercase tracking-wider mb-0.5">
        {label}
      </h4>
      <p className="text-xs md:text-lg font-bold text-[var(--color-text)] group-hover:scale-110 transition-transform">
        {time}
      </p>
      {iqamah && (
        <p className="text-[8px] md:text-[10px] text-[var(--color-text-muted)] mt-0.5">Iqamah {iqamah}</p>
      )}
    </div>
  );
}
