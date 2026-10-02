import type { Metadata } from 'next';
import { Geist, Amiri, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// only for the name on the plaque under the drawing
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: '600',
  style: 'italic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.centerrahma.no'),
  title: {
    template: '%s | Masjid Rahma',
    default: 'Masjid Rahma — Moske i Oslo | Bønn, Fellesskap og Utdanning',
  },
  description:
    'Masjid Rahma er en moske i Oslo som tilbyr daglige bønner, koranundervisning, ungdomsaktiviteter og fellesskap. Besøk oss på Tvetenveien 152A.',
  openGraph: {
    title: 'Masjid Rahma — Moske i Oslo',
    description:
      'Masjid Rahma er en moske i Oslo som tilbyr daglige bønner, koranundervisning, ungdomsaktiviteter og fellesskap. Besøk oss på Tvetenveien 152A.',
    url: 'https://www.centerrahma.no',
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    images: [
      {
        url: '/og-forside.png',
        width: 1200,
        height: 630,
        alt: 'Masjid Rahma — Moske i Oslo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masjid Rahma — Moske i Oslo',
    description:
      'Masjid Rahma er en moske i Oslo som tilbyr daglige bønner, koranundervisning, ungdomsaktiviteter og fellesskap.',
    images: ['/og-forside.png'],
  },
  alternates: {
    canonical: 'https://www.centerrahma.no',
  },
};

function OrganizationJsonLd() {
  // All values are hardcoded constants — no user input, safe from XSS
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Masjid Rahma',
    alternateName: 'Masjid Rahma Oslo',
    url: 'https://www.centerrahma.no',
    logo: 'https://www.centerrahma.no/logo.png',
    email: 'post@centerrahma.no',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tvetenveien 152A',
      addressLocality: 'Oslo',
      postalCode: '0671',
      addressCountry: 'NO',
    },
    sameAs: [
      'https://www.facebook.com/masjidrahmaoslo',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="no">
      <head>
        <OrganizationJsonLd />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geist.variable} ${amiri.variable} ${cormorant.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-[var(--color-bg)] focus:rounded-lg focus:font-semibold"
          >
            Hopp til innhold
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
