import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string; // Material icon name
  imageUrl: string;
  ctaText: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  imageUrl,
  ctaText,
}: ServiceCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden h-96 cursor-pointer">
      {/* Full background image */}
      <Image
        className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/50 to-transparent opacity-90"></div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        {/* Icon circle */}
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-[var(--color-bg)]">
          <span className="material-icons">{icon}</span>
        </div>

        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{title}</h3>

        {/* Description hidden, revealed on hover */}
        <p className="text-[var(--color-text-muted)] text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {description}
        </p>

        <span className="text-[var(--color-text)] text-sm font-bold flex items-center gap-2">
          {ctaText} <span className="material-icons text-xs">arrow_forward</span>
        </span>
      </div>
    </div>
  );
}
