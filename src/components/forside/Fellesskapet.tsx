import Image from 'next/image';
import Link from 'next/link';
import s from './forside.module.css';

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
    <section className={`${s.block} ${s.tint}`} id="fellesskapet">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2>Fellesskapet</h2>
          <p>Undervisning for barn, et eget miljø for unge og et fellesskap å være med i.</p>
        </div>
        <div className={s.boxes}>
          {BOXES.map((box) => (
            <Link key={box.href} className={s.box} href={box.href}>
              <figure>
                <Image src={box.img} alt={box.alt} fill sizes="(max-width: 640px) 100vw, 33vw" />
              </figure>
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
