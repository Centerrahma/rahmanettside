import Image from 'next/image';

const VIPPS_DONATION_URL = 'https://qr.vipps.no/donations/43392';

export default function VippsDonationCard() {
  return (
    <div className="glass-panel p-4 md:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-4">
        <span className="material-symbols-outlined text-primary text-2xl">
          volunteer_activism
        </span>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text)]">Støtt Masjid Rahma</h3>
          <p className="text-[10px] md:text-xs text-[var(--color-text-muted)]">Doner enkelt via Vipps</p>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 mb-4">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-primary text-lg mt-0.5 flex-shrink-0">info</span>
          <p className="text-sm leading-relaxed text-[var(--color-text)]">
            Bruk QR-koden eller knappen nedenfor for å donere via Vipps. Du kan velge mellom{' '}
            <span className="font-bold">engangsbetaling</span> eller{' '}
            <span className="font-bold">månedlig trekk</span> med valgfritt beløp.
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="rounded-2xl bg-white p-3 shadow-md">
          <Image
            src="/vippsdonasjon.png"
            alt="Vipps donasjon QR-kode"
            width={220}
            height={220}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Vipps button */}
      <a
        href={VIPPS_DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#ff5b24] hover:bg-[#e64f1e] text-white py-3 px-6 rounded-xl
                   text-base font-bold flex items-center justify-center gap-2.5
                   transition-colors shadow-md mb-4"
      >
        <span>Doner med Vipps</span>
        <span className="material-symbols-outlined text-lg">open_in_new</span>
      </a>

      {/* Vipps numbers */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 mt-auto">
        <p className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wide text-center mb-2">
          Send via Vipps
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-2 px-2 text-center">
            <p className="text-xl font-black text-[#ff5b24] tracking-wide">77811</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-medium">Vipps nr. 1</p>
          </div>
          <div className="rounded-lg bg-[#ff5b24]/10 border border-[#ff5b24]/25 py-2 px-2 text-center">
            <p className="text-xl font-black text-[#ff5b24] tracking-wide">43392</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-medium">Vipps nr. 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
