interface LiveTickerProps {
  label: string;
  messages: string[];
}

export default function LiveTicker({ label, messages }: LiveTickerProps) {
  return (
    <div className="w-full overflow-hidden bg-[var(--color-surface)] rounded-full py-2 px-4 border border-[var(--color-border)] flex items-center gap-3">
      {/* Ping dot */}
      <span className="flex h-2 w-2 relative flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>

      {/* Label */}
      <span className="text-xs font-bold text-primary uppercase whitespace-nowrap">
        {label}:
      </span>

      {/* Marquee scrolling text */}
      <div className="flex-1 overflow-hidden relative h-5">
        <div className="absolute whitespace-nowrap animate-marquee flex gap-8 text-sm text-[var(--color-text-muted)]">
          {messages.map((message, index) => (
            <span key={index}>{message}</span>
          ))}
          {/* Duplicate for seamless loop */}
          {messages.map((message, index) => (
            <span key={`duplicate-${index}`}>{message}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
