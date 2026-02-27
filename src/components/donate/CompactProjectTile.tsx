import type { DonationProject } from '@/types/donation';
import { formatCurrency } from '@/lib/format';

interface CompactProjectTileProps {
  project: DonationProject;
  title: string;
  targetLabel: string;
  onClick: () => void;
}

export default function CompactProjectTile({
  project,
  title,
  targetLabel,
  onClick,
}: CompactProjectTileProps) {
  return (
    <button
      onClick={onClick}
      className={`glass-panel p-3.5 text-left w-full flex flex-col justify-between h-full
        hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-200
        ${project.badge === 'urgent' ? 'border-l-2 border-l-red-500' : ''}`}
    >
      {/* Top half: Title & Circular Progress */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[13px] md:text-sm font-semibold leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Circular Progress */}
        <div className="flex-shrink-0 relative w-8 h-8 md:w-10 md:h-10 mt-1">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[var(--color-border)]"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-primary transition-all duration-1000 ease-out"
              strokeDasharray={`${project.percentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] font-bold text-primary">
              {project.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Linear progress bar + Target amount */}
      <div className="mt-auto pt-2">
        <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${project.percentage}%` }}
          />
        </div>
        <p className="text-[11px] md:text-xs text-[var(--color-text-muted)]">
          {targetLabel}: {formatCurrency(project.target)} kr
        </p>
      </div>
    </button>
  );
}
