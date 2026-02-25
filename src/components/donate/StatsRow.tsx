interface StatsRowProps {
  transparencyLabel: string;
  transparencyDesc: string;
  taxLabel: string;
  taxDesc: string;
  accessLabel: string;
  accessDesc: string;
  secureLabel: string;
  secureDesc: string;
}

export default function StatsRow({
  transparencyLabel,
  transparencyDesc,
  taxLabel,
  taxDesc,
  accessLabel,
  accessDesc,
  secureLabel,
  secureDesc,
}: StatsRowProps) {
  const stats = [
    {
      icon: 'visibility',
      label: transparencyLabel,
      description: transparencyDesc,
    },
    {
      icon: 'receipt_long',
      label: taxLabel,
      description: taxDesc,
    },
    {
      icon: 'access_time',
      label: accessLabel,
      description: accessDesc,
    },
    {
      icon: 'verified_user',
      label: secureLabel,
      description: secureDesc,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center hover:border-primary/30 transition-colors"
        >
          <span className="material-icons text-primary text-3xl mb-2">
            {stat.icon}
          </span>
          <h3 className="font-bold text-sm mb-1">{stat.label}</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
