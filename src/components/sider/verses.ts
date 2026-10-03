/* The Quran verses on Støtt oss and Kontakt oss, each complete.

   Arabic: the Uthmani text from Tanzil (tanzil.net, "quran-uthmani", fetched through
   api.alquran.cloud), checked word for word against quran.com's Uthmani text; the two differ
   only in how a few marks are encoded. Copy it verbatim: do not retype or "correct" it.
   Norwegian: Einar Berg's translation (the same source), except 15:46, which keeps the
   wording the site already used. */

export interface Verse { ar: string; no: string; ref: string }

export const VERSES = {
  /** Støtt oss, the great portal */
  v9_18: {
    ar: "إِنَّمَا يَعْمُرُ مَسَٰجِدَ ٱللَّهِ مَنْ ءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ وَأَقَامَ ٱلصَّلَوٰةَ وَءَاتَى ٱلزَّكَوٰةَ وَلَمْ يَخْشَ إِلَّا ٱللَّهَ ۖ فَعَسَىٰٓ أُو۟لَٰٓئِكَ أَن يَكُونُوا۟ مِنَ ٱلْمُهْتَدِينَ",
    no: "De alene skal ta seg av Guds moskeer som tror på Gud og dommens dag, som forretter bønnen, betaler det rituelle bidrag og ikke frykter andre enn Gud. Disse vil kanskje finne rett vei.",
    ref: 'Koranen 9:18',
  },
  /** Støtt oss, bank transfer */
  v3_92: {
    ar: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍۢ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌۭ",
    no: "Dere når ikke frem til rett fromhet før dere gir bort av det som er dere kjært. Hva dere enn gir, Gud vet om det.",
    ref: 'Koranen 3:92',
  },
  /** Støtt oss, membership */
  v2_245: {
    ar: "مَّن ذَا ٱلَّذِى يُقْرِضُ ٱللَّهَ قَرْضًا حَسَنًۭا فَيُضَٰعِفَهُۥ لَهُۥٓ أَضْعَافًۭا كَثِيرَةًۭ ۚ وَٱللَّهُ يَقْبِضُ وَيَبْصُۜطُ وَإِلَيْهِ تُرْجَعُونَ",
    no: "Hvem vil gi Gud et godt lån som han får mangfold igjen? Gud er påholden og raus. Til Ham vil dere vende tilbake.",
    ref: 'Koranen 2:245',
  },
  /** Kontakt oss, the colophon */
  v15_46: {
    ar: "ٱدْخُلُوهَا بِسَلَٰمٍ ءَامِنِينَ",
    no: 'Gå inn i fred og trygghet.',
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
