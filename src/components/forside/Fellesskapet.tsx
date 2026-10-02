import Image from 'next/image';
import Link from 'next/link';
import s from './forside.module.css';

/* An eight-pointed star for the apex of each arch. */
const STAR = (() => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? 7.65 : 10;
    d += (i ? 'L' : 'M') + (12 + r * Math.cos(a)).toFixed(2) + ',' + (12 + r * Math.sin(a)).toFixed(2);
  }
  return d + 'Z';
})();

const BOXES = [
  {
    href: '/ung-rahma',
    img: '/UngRahma_opt.jpg',
    alt: 'Barn og unge samlet i en idrettshall',
    title: 'Ung Rahma',
    text: 'Ungdomsprogram for 13 til 25 år med sport, turer, koranstudier og mentorordning.',
    more: 'Les om Ung Rahma',
  },
  {
    href: '/rahma-skole',
    img: '/Rahmaskole_opt.jpg',
    alt: 'Elever i et klasserom ser på en skjerm med arabiske bokstaver',
    title: 'Rahma skole',
    text: 'Islamsk undervisning for barn og unge: Koran, arabisk og islamske studier.',
    more: 'Les om Rahma skole',
  },
  {
    href: '/become-member',
    img: '/BliMedlem_opt.jpg',
    alt: 'Barn som spiser pizza sammen i bønnesalen',
    title: 'Bli medlem',
    text: 'Medlemskapet støtter driften av moskeen og programmene.',
    more: 'Meld deg inn',
  },
];

export default function Fellesskapet() {
  return (
    <section className={s.block} id="fellesskapet">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2>Fellesskapet</h2>
        </div>
        <div className={s.boxes}>
          {BOXES.map((box) => (
            <Link key={box.href} className={s.box} href={box.href}>
              {/* the photo in an arch, an ivory arch behind it, a double gold outline and a star on top */}
              <div className={s.niche}>
                <span className={s.backing} aria-hidden="true" />
                <figure>
                  <Image src={box.img} alt={box.alt} fill sizes="(max-width: 640px) 100vw, 33vw" />
                </figure>
                <svg viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M-9,312 V117 C-9,55 47,24 100,-10 C153,24 209,55 209,117 V312" fill="none" stroke="var(--gold)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
                  <path d="M-16,312 V115 C-16,49 43,16 100,-19 C157,16 216,49 216,115 V312" fill="none" stroke="var(--gold-2)" strokeWidth={1} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
                </svg>
                <svg className={s.apex} viewBox="0 0 24 24" aria-hidden="true">
                  <path d={STAR} fill="var(--gold-2)" stroke="var(--gold)" strokeWidth={1} />
                </svg>
              </div>
              <h3>{box.title}</h3>
              <p>{box.text}</p>
              <span className={s.link}>{box.more}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
