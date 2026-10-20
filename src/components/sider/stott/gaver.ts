import { EMAIL, MONTHLY_VIPPS, VIPPS } from '@/components/forside/links';

/** The two Vipps ways to give and the bank fallback, shared by the desktop and phone layouts. */
export const GIFT = { title: 'Gi en gave', line: 'Én gang, når det passer deg.', action: 'Gi med Vipps', vipps: VIPPS };
export const MONTHLY = { title: 'Bli fast giver', line: 'Litt hver måned holder dørene åpne.', action: 'Bli fast giver', vipps: MONTHLY_VIPPS };
export type Way = typeof GIFT;

export const BANK_HREF = `mailto:${EMAIL}?subject=Kontonummer%20for%20gave`;
