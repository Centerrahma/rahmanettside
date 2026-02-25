interface CompactVippsTileProps {
  onClick: () => void;
}

export default function CompactVippsTile({ onClick }: CompactVippsTileProps) {
  return (
    <button
      onClick={onClick}
      className="glass-panel p-3 text-left w-full flex flex-col justify-center items-center h-full
        hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-200"
    >
      <h3 className="text-base font-bold text-[var(--color-text)] mb-0.5">Vipps</h3>
      <p className="text-xl font-bold text-primary tracking-wider">77811</p>
      <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">Velg kategori</p>
    </button>
  );
}
