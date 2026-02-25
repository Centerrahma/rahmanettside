interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft: boolean;
  icon: string;
}

export default function TimelineItem({ year, title, description, isLeft, icon }: TimelineItemProps) {
  return (
    <div className={`relative flex items-center mb-16 md:mb-24 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <span className="material-icons text-primary text-3xl">{icon}</span>
            <h3 className="text-2xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
              {title}
            </h3>
          </div>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Center Timeline Point with Year Badge */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg z-10">
          <div className="w-6 h-6 rounded-full bg-[var(--color-bg)]"></div>
        </div>
        <div className="mt-2 bg-primary text-[var(--color-bg)] px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
          {year}
        </div>
      </div>

      {/* Empty space on the other side (desktop only) */}
      <div className="hidden md:block w-5/12"></div>

      {/* Connector Line (desktop only) */}
      <div className={`hidden md:block absolute top-6 ${isLeft ? 'left-1/2 -translate-x-1/2 -ml-px' : 'right-1/2 translate-x-1/2 -mr-px'} w-12 h-0.5 bg-[var(--color-border)]`}></div>
    </div>
  );
}
