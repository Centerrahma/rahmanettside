interface ProgressBarProps {
  percentage: number;
  showGlow?: boolean;
}

export default function ProgressBar({
  percentage,
  showGlow = false,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="h-3 bg-[var(--color-surface)]/50 rounded-full overflow-hidden">
      <div
        className={`h-full bg-[var(--color-primary-val)] rounded-full transition-all duration-1000 ${
          showGlow
            ? 'shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]'
            : ''
        }`}
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
}
