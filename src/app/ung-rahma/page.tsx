import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ung Rahma — Ungdomsprogram for Muslimsk Ungdom i Oslo',
  description:
    'Ung Rahma styrker neste generasjon gjennom tro, læring og lederskap. Sport, aktiviteter, turer og mentorordning for ungdom 13–25 år i Oslo.',
  alternates: { canonical: 'https://masjidrahma.no/ung-rahma' },
  openGraph: {
    title: 'Ung Rahma — Ungdomsprogram i Oslo',
    description:
      'Aktiviteter, turer og mentorordning for ungdom 13–25 år ved Masjid Rahma i Oslo. Styrker neste generasjon gjennom tro og fellesskap.',
    url: 'https://masjidrahma.no/ung-rahma',
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    images: [{ url: '/UngRahma_opt.jpg', width: 1200, height: 630, alt: 'Ung Rahma ungdomsprogram' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ung Rahma — Ungdomsprogram i Oslo',
    description:
      'Aktiviteter, turer og mentorordning for ungdom 13–25 år ved Masjid Rahma.',
    images: ['/UngRahma_opt.jpg'],
  },
};

export default function UngRahmaPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-val)]/10 text-[var(--color-primary-val)] text-sm font-medium mb-6">
            <span className="material-symbols-outlined text-lg">group</span>
            Ungdomsprogram
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] font-[family-name:var(--font-display)] mb-4">
            Ung Rahma
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            Styrker neste generasjon gjennom tro, læring og lederskap.
            Aktiviteter, turer og mentorordning for ungdom.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300 mb-8">
          <span className="material-symbols-outlined text-xl shrink-0">info</span>
          <p className="text-sm font-medium">Oppdatert informasjon kommer snart!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: 'sports_soccer',
              title: 'Aktiviteter',
              desc: 'Sport, utflukter og sosiale arrangementer som bygger vennskap og fellesskap.',
            },
            {
              icon: 'menu_book',
              title: 'Læring',
              desc: 'Islamske studier, koran og personlig utvikling i et trygt og støttende miljø.',
            },
            {
              icon: 'star',
              title: 'Mentorordning',
              desc: 'Veiledning fra erfarne mentorer som hjelper deg å vokse som person og muslim.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary-val)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-val)]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[var(--color-primary-val)] text-2xl">
                  {item.icon}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">
                {item.title}
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary-val)] text-white font-bold hover:opacity-90 transition-opacity"
          >
            Kontakt oss for mer info
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
