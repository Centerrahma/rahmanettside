import type { Metadata, Viewport } from 'next';
import QRCode from 'qrcode';
import { SKJERM_LINKS, qrAddress } from '@/lib/skjerm';
import { Skjerm, type SkjermCard } from '@/components/skjerm/Skjerm';
import { VIPPS } from '@/components/forside/links';

// the touch screen in the mosque; reached through skjerm.centerrahma.no
export const metadata: Metadata = {
  title: 'Skjerm',
  robots: { index: false, follow: false },
};

// a finger on the glass should never zoom the page
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/** The QR code as one SVG path of 1×1 squares, drawn here at build time. */
function qrPath(text: string) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
  let d = '';
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(y, x)) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size: modules.size, d };
}

export default function SkjermPage() {
  const cards: SkjermCard[] = SKJERM_LINKS.map((link) => {
    const address = link.slug === 'vipps' ? VIPPS.url : qrAddress(link.slug);
    return {
      slug: link.slug,
      title: link.title,
      line: link.line,
      address: address.replace('https://www.', ''),
      qr: qrPath(address),
      qrImage: link.slug === 'vipps' ? VIPPS.qr : undefined,
    };
  });

  return <Skjerm cards={cards} />;
}
