/** Addresses and links the front page, nav and footer share. */

export const YEAR_PDF = { href: '/Bonnetider_2026.pdf', filename: 'Bønnetider 2026.pdf' };

export const ADDRESS = { street: 'Tvetenveien 152A', city: '0671 Oslo' };
const QUERY = 'Tvetenveien+152A,+0671+Oslo';
export const MAPS = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`,
  open: `https://www.google.com/maps?q=${QUERY}`,
  embed: `https://www.google.com/maps?q=${QUERY}&z=15&output=embed`,
};

export const EMAIL = 'post@centerrahma.no';
export const FACEBOOK = 'https://www.facebook.com/masjidrahma';
export const VIPPS = { number: '77811', url: 'https://qr.vipps.no/donations/43392' };
/** The account for gifts by bank transfer. Støtt oss shows its bank card only once this is set. */
export const BANK_ACCOUNT: string | null = null;
export const ORG_NR = '974444216';
