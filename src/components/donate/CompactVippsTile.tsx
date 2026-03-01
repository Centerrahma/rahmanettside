interface CompactVippsTileProps {
  onClick: () => void;
}

export default function CompactVippsTile({ onClick }: CompactVippsTileProps) {
  return (
    <button
      onClick={onClick}
      className="glass-panel p-2.5 md:p-3.5 text-left w-full flex flex-col justify-center items-center h-full
        hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-200"
    >
      <h3 className="text-sm md:text-base font-bold text-[var(--color-text)] mb-1 md:mb-2">Vipps</h3>
      <p className="text-xl md:text-2xl font-bold text-[#ff5b24] tracking-wider mb-1 md:mb-2">77811</p>
      <p className="text-[11px] md:text-xs text-[var(--color-text-muted)] mt-1">Velg kategori</p>
    </button>
  );
}
