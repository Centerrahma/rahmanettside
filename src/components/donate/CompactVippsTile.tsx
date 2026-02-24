interface CompactVippsTileProps {
  onClick: () => void;
}

export default function CompactVippsTile({ onClick }: CompactVippsTileProps) {
  return (
    <button
      onClick={onClick}
      className="glass-panel p-4 text-left w-full flex flex-col justify-center items-center h-full
        hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-200"
    >
      <h3 className="text-lg font-bold text-white mb-1">Vipps</h3>
      <p className="text-2xl font-bold text-primary tracking-wider">77811</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-2">Velg kategori</p>
    </button>
  );
}
