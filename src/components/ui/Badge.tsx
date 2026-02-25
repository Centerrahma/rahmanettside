import { ReactNode } from 'react';

type BadgeVariant = 'urgent' | 'ongoing' | 'youth' | 'halaqa' | 'community';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent:
    'px-3 py-1 bg-[var(--color-primary-val)]/20 text-[var(--color-primary-val)] rounded-full text-xs',
  ongoing:
    'px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs',
  youth:
    'px-2 py-1 bg-[var(--color-primary-val)] text-[var(--color-bg)] text-xs rounded',
  halaqa:
    'px-2 py-1 bg-purple-500/20 text-purple-500 text-xs rounded',
  community:
    'px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded',
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-block font-bold uppercase tracking-wide ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
