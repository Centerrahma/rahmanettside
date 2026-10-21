/* The three groups on the front page, in the mosque's own words from each group's page.
   Shared by the desktop section (gips/Seksjoner) and the phone layout (mobil/ForsideMobil). */

export const LEAD = 'Her lærer barn Koranen og arabisk, unge samles til sport og turer, og familier møtes.';

/* Ung Rahma and Rahma skole have no page yet, so they carry no link; a group gets a button once it has an href. */
export interface Group { key: string; href?: string; more?: string; img: string; alt: string; title: string; meta: string; text: string; points: string[][] }
export const GROUPS: Group[] = [
  {
    key: 'ung', img: '/forside/ung-portrett.jpg', alt: 'Barn og unge samlet i en idrettshall',
    title: 'Ung Rahma', meta: '13 til 25 år',
    text: 'Et ungdomsprogram som styrker neste generasjon gjennom tro, læring og lederskap.',
    points: [
      ['Aktiviteter', 'Sport, utflukter og sosiale arrangementer som bygger vennskap.'],
      ['Læring', 'Islamske studier, Koranen og personlig utvikling i et trygt miljø.'],
      ['Mentorordning', 'Erfarne mentorer som hjelper deg å vokse som person og muslim.'],
    ],
  },
  {
    key: 'skole', img: '/forside/skole-portrett.jpg', alt: 'Elever i et klasserom ser på en skjerm med arabiske bokstaver',
    title: 'Rahma skole', meta: 'Barn og unge',
    text: 'Strukturert undervisning for barn og unge, med kvalifiserte lærere i et trygt miljø.',
    points: [
      ['Koranundervisning', 'Tajwid og memorering under veiledning av kvalifiserte lærere.'],
      ['Arabisk språk', 'Fra grunnivå til avansert, med vekt på forståelse.'],
      ['Islamske studier', 'Fiqh, aqidah og seerah, tilpasset alderen.'],
    ],
  },
  {
    key: 'medlem', href: '/blimedlem', img: '/forside/fam-portrett.jpg', alt: 'Barn som spiser sammen i bønnesalen',
    title: 'Bli medlem', meta: 'For hele familien', more: 'Meld deg inn',
    text: 'Jo flere vi er, jo mer kan vi gjøre. Undervisningen, Rahma skole og Ung Rahma får vi til fordi dere støtter oss.',
    points: [
      ['Du støtter moskeen', 'Staten gir tilskudd for hvert registrerte medlem.'],
      ['Du styrker fellesskapet', 'Hvert medlem gjør mer mulig for barn, unge og familier.'],
      ['Du hjelper fellesskapet å vokse', 'Det muslimske fellesskapet i Norge vokser med deg.'],
    ],
  },
];
