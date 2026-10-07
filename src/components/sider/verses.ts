/* The Quran verses on Støtt oss, Kontakt oss and Bli medlem, each complete.

   Arabic: the Uthmani text from Tanzil (tanzil.net, "quran-uthmani", fetched through
   api.alquran.cloud), checked word for word against quran.com's Uthmani text; the two differ
   only in how a few marks are encoded. English: Sahih International (alquran.cloud "en.sahih",
   the same words as quran.com's, which only adds macrons to Allah and zakah).
   Copy both verbatim: do not retype or "correct" them. */

export interface Verse { ar: string; en: string; ref: string }

/** Who the translation is by, for the credit under it. */
export const TRANSLATION = 'Sahih International';

export const VERSES = {
  /** Støtt oss, the great portal */
  v9_18: {
    ar: "إِنَّمَا يَعْمُرُ مَسَٰجِدَ ٱللَّهِ مَنْ ءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ وَأَقَامَ ٱلصَّلَوٰةَ وَءَاتَى ٱلزَّكَوٰةَ وَلَمْ يَخْشَ إِلَّا ٱللَّهَ ۖ فَعَسَىٰٓ أُو۟لَٰٓئِكَ أَن يَكُونُوا۟ مِنَ ٱلْمُهْتَدِينَ",
    en: "The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day and establish prayer and give zakah and do not fear except Allah, for it is expected that those will be of the [rightly] guided.",
    ref: 'Koranen 9:18',
  },
  /** Støtt oss, bank transfer */
  v3_92: {
    ar: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍۢ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌۭ",
    en: "Never will you attain the good [reward] until you spend [in the way of Allah] from that which you love. And whatever you spend - indeed, Allah is Knowing of it.",
    ref: 'Koranen 3:92',
  },
  /** Støtt oss, membership */
  v2_245: {
    ar: "مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًۭا فَيُضَٰعِفَهُۥ لَهُۥٓ أَضْعَافًۭا كَثِيرَةًۭ ۚ وَٱللَّهُ يَقْبِضُ وَيَبْصُۜطُ وَإِلَيْهِ تُرْجَعُونَ",
    en: "Who is it that would loan Allah a goodly loan so He may multiply it for him many times over? And it is Allah who withholds and grants abundance, and to Him you will be returned.",
    ref: 'Koranen 2:245',
  },
  /** Bli medlem, the band under the evening city */
  v49_10: {
    ar: "إِنَّمَا ٱلْمُؤْمِنُونَ إِخْوَةٌۭ فَأَصْلِحُوا۟ بَيْنَ أَخَوَيْكُمْ ۚ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُرْحَمُونَ",
    en: "The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy.",
    ref: 'Koranen 49:10',
  },
  /** Kontakt oss, the colophon */
  v15_46: {
    ar: "ٱدْخُلُوهَا بِسَلَٰمٍ ءَامِنِينَ",
    en: "[Having been told], \"Enter it in peace, safe [and secure].\"",
    ref: 'Koranen 15:46',
  },
} satisfies Record<string, Verse>;

/** The text to show: a no-break space before each pause mark (ۖ ۗ ۚ …), so a line never starts with one. */
export const shown = (ar: string) => ar.replace(/ (?=[\u06D6-\u06DC])/g, '\u00A0');

/** The greeting at the head of Kontakt oss (not a verse). */
export const SALAM = {
  ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
  no: 'Fred være med dere, og Guds barmhjertighet og velsignelse.',
};
