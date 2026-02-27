interface CompactVippsTileProps {
  onClick: () => void;
}

export default function CompactVippsTile({ onClick }: CompactVippsTileProps) {
  return (
    <button
      onClick={onClick}
      className="glass-panel p-3.5 text-left w-full flex flex-col justify-center items-center h-full min-h-[140px]
        hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-200"
    >
      <h3 className="text-base font-bold text-[var(--color-text)] mb-2">Vipps</h3>
      <p className="text-2xl font-bold text-[#ff5b24] tracking-wider mb-2">77811</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1.5">Velg kategori</p>
    </button>
  );
}
