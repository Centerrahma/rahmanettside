import { EMAIL, MONTHLY_VIPPS, VIPPS } from '@/components/forside/links';

/** The two Vipps ways to give and the bank fallback, shared by the desktop and phone layouts. */
export interface Way { title: string; line: string; source?: string; action: string; vipps: typeof VIPPS }
export const GIFT: Way = { title: 'Gi en gave', line: 'Én gang, når det passer deg.', action: 'Gi med Vipps', vipps: VIPPS };
/* The hadith from Aisha: «أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ», Sahih al-Bukhari 6464 (sunnah.com/bukhari:6464). */
export const MONTHLY: Way = {
  title: 'Bli fast giver',
  line: '«De gjerningene Allah elsker mest, er de som gjøres jevnlig, selv om de er små.»',
  source: 'Profeten ﷺ, Sahih al-Bukhari 6464',
  action: 'Bli fast giver',
  vipps: MONTHLY_VIPPS,
};

export const BANK_HREF = `mailto:${EMAIL}?subject=Kontonummer%20for%20gave`;
