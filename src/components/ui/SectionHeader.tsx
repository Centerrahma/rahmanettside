import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string | ReactNode;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  centered = false,
}: SectionHeaderProps) {
  const alignment = centered ? 'text-center' : '';

  return (
    <div className={alignment}>
      {eyebrow && (
        <p className="text-[var(--color-text)] text-sm font-bold tracking-widest uppercase mb-2">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="text-[var(--color-text)]">
              {titleHighlight}
            </span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className={`text-[var(--color-text-muted)] mt-4 max-w-2xl ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
