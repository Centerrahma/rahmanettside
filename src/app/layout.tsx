import type { Metadata } from 'next';
import { Source_Serif_4, Plus_Jakarta_Sans, Amiri } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DeferredIconFonts } from '@/components/layout/DeferredIconFonts';
import './globals.css';

const sourceSerif = Source_Serif_4({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://masjidrahma.no'),
  title: {
    template: '%s | Masjid Rahma',
    default: 'Masjid Rahma — Moske i Oslo | Bønn, Fellesskap og Utdanning',
  },
  description:
    'Masjid Rahma er en moske i Oslo som tilbyr daglige bønner, koranundervisning, ungdomsaktiviteter og fellesskap. Besøk oss på Tvetenveien 154.',
  openGraph: {
    title: 'Masjid Rahma — Moske i Oslo',
    description:
      'Masjid Rahma er en moske i Oslo som tilbyr daglige bønner, koranundervisning, ungdomsaktiviteter og fellesskap. Besøk oss på Tvetenveien 154.',
    url: 'https://masjidrahma.no',
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    images: [
      {
        url: '/nymoskeoversikt_opt.jpg',
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
    images: ['/nymoskeoversikt_opt.jpg'],
  },
  alternates: {
    canonical: 'https://masjidrahma.no',
  },
};

function OrganizationJsonLd() {
  // All values are hardcoded constants — no user input, safe from XSS
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Masjid Rahma',
    alternateName: 'Masjid Rahma Oslo',
    url: 'https://masjidrahma.no',
    logo: 'https://masjidrahma.no/logo.png',
    telephone: '+47 22 12 34 56',
    email: 'contact@masjidrahma.no',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tvetenveien 154',
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
    <html lang="no" className="dark" suppressHydrationWarning>
      <head>
        {/* Blocking script to apply saved theme before first paint — prevents light flash.
            All values are hardcoded string literals — no user input, safe from XSS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <OrganizationJsonLd />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#047857" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#060b0e" media="(prefers-color-scheme: dark)" />
      </head>
      <body
        className={`${sourceSerif.variable} ${plusJakarta.variable} ${amiri.variable} antialiased`}
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
          <DeferredIconFonts />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
