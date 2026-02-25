import type { DonationProject } from '@/types/donation';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';

interface ProjectCardProps {
  project: DonationProject;
  raisedLabel: string;
  targetLabel: string;
  fundedLabel: string;
  donorsLabel: string;
  vsLastMonthLabel?: string;
  raisedThisMonthLabel?: string;
}

export default function ProjectCard({
  project,
  title, // New prop for the translated title
  raisedLabel,
  targetLabel,
  fundedLabel,
  donorsLabel,
  vsLastMonthLabel,
  raisedThisMonthLabel,
}: ProjectCardProps & { title: string }) {
  // Calculate remaining amount
  const remaining = project.target - project.raised;

  // Get the first letter of the title for the big initial
  const initial = title.charAt(0).toUpperCase();

  return (
    <div className="glass-panel bento-card p-6 relative overflow-hidden flex flex-col justify-between h-full group hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-300">

      {/* Top Section: Circular Progress & Title */}
      <div className="flex items-start gap-4 mb-6">
        {/* Circular Progress */}
        <div className="flex-shrink-0 relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              className="text-[var(--color-border)]"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4" // Thicker stroke
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
              strokeWidth="4" // Thicker stroke
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {project.percentage}%
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="pt-1 flex-1">
          <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          {/* Progress Line - Larger */}
          <div className="w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${project.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Stats */}
      <div className="mt-auto">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm text-[var(--color-text-muted)] font-medium mb-1">
              {targetLabel}
            </div>
            {/* Target Amount in Green/Primary */}
            <div className="text-2xl font-bold text-primary text-glow">
              {formatCurrency(project.target)} kr
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-[var(--color-text-muted)] font-medium mb-1">
              Remaining
            </div>
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">
              {formatCurrency(remaining)} kr
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
