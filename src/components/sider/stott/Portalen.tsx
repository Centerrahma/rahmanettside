import Image from 'next/image';
import { BANK_ACCOUNT, EMAIL, MONTHLY_VIPPS, VIPPS } from '@/components/forside/links';
import Lykt from './Lykt';
import { starPoints } from './stjerne';
import s from './portalen.module.css';

/**
 * Støtt oss: two pillars cut from the photo of the mosque's carved wall carry a gold
 * arch, with a lantern hanging from its apex and the verse beneath it.
 *
 * Desktop: one screen; each pillar stands on a Vipps box, so the two QR codes sit far apart.
 * Phone: its own composition. A QR code can't be scanned on the phone that shows it,
 * so the codes are left out and each Vipps option is one large card that opens the app.
 */

const VERSE = {
  ar: 'لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌ',
  no: '«Dere når ikke det gode før dere gir av det dere er glad i. Og hva dere enn gir, så vet Allah om det.»',
  ref: 'Koranen 3:92',
};

const GIFT = { title: 'Gi en gave', line: 'Én gang, når det passer deg.', action: 'Gi med Vipps', vipps: VIPPS };
const MONTHLY = { title: 'Bli fast giver', line: 'Litt hver måned holder dørene åpne.', action: 'Bli fast giver', vipps: MONTHLY_VIPPS };
const BANK_HREF = `mailto:${EMAIL}?subject=Kontonummer%20for%20gave`;

/** The end-of-verse marker of a mushaf, with 92 in Arabic-Indic digits. */
function AyahMark() {
  return (
    <span className={s.ayah} aria-hidden="true">
      <svg viewBox="0 0 60 60"><polygon points={starPoints(30, 30, 29)} /><circle cx="30" cy="30" r="19" /></svg>
      <span lang="ar">٩٢</span>
    </span>
  );
}

function Pillar({ side }: { side: 'l' | 'r' }) {
  return (
    <div className={`${s.pillar} ${s[side]}`} aria-hidden="true">
      <span className={s.capital} />
      <span className={s.shaft} />
      <span className={s.base} />
    </div>
  );
}

function VippsBox({ way, side }: { way: typeof GIFT; side: 'left' | 'right' }) {
  const qr = (
    <a className={s.qr} href={way.vipps.url} target="_blank" rel="noopener noreferrer" aria-label={`${way.action}, Vipps ${way.vipps.number}`}>
      <Image src={`/vipps-${way.vipps.number}.png`} width={492} height={492} unoptimized alt={`QR-kode til Vipps ${way.vipps.number}`} />
    </a>
  );
  return (
    <article className={`${s.box} ${s[side]}`}>
      {side === 'left' && qr}
      <div>
        <h2>{way.title}</h2>
        <p className={s.number}>{way.vipps.number}<span>på Vipps</span></p>
        <a className={s.action} href={way.vipps.url} target="_blank" rel="noopener noreferrer">{way.action}<span aria-hidden="true">↗</span></a>
      </div>
      {side === 'right' && qr}
    </article>
  );
}

/** Phone: the whole card is the link into the Vipps app. */
function VippsCard({ way, warm }: { way: typeof GIFT; warm?: boolean }) {
  return (
    <a className={`${s.card} ${warm ? s.warm : ''}`} href={way.vipps.url} target="_blank" rel="noopener noreferrer">
      <span className={s.cardText}>
        <strong>{way.title}</strong>
        <span>{way.line}</span>
      </span>
      <span className={s.cardNumber}>{way.vipps.number}<small>Vipps</small></span>
      <span className={s.cardGo}>Åpne Vipps<span aria-hidden="true">↗</span></span>
    </a>
  );
}

function BankText() {
  return BANK_ACCOUNT
    ? <p>Kontonummer <strong>{BANK_ACCOUNT}</strong></p>
    : <p>Skriv til oss, så sender vi kontonummeret.</p>;
}

export default function Portalen() {
  return (
    <div className={s.page}>
      <div className={s.gate}>
        <Pillar side="l" />
        <div className={s.arch} aria-hidden="true">
          <svg viewBox="0 0 1000 220" preserveAspectRatio="none">
            <path d="M0 220 C0 110 90 70 260 52 C380 40 470 22 500 0 C530 22 620 40 740 52 C910 70 1000 110 1000 220" />
            <path className={s.inner} d="M22 220 C22 124 106 88 266 72 C384 60 468 44 500 24 C532 44 616 60 734 72 C894 88 978 124 978 220" />
          </svg>
        </div>
        <Pillar side="r" />
        <div className={s.lamp}><Lykt /></div>
        <div className={s.inside}>
          <header className={s.head}>
            <h1>Det gode lever videre.</h1>
            <p>Masjid Rahma er bygget og drives av gaver. Velg den måten som passer deg.</p>
          </header>
          <section className={s.verse} aria-label="Vers fra Koranen">
            <p className={s.arabic} lang="ar" dir="rtl">{VERSE.ar} <AyahMark /></p>
            <p className={s.meaning}>{VERSE.no}</p>
            <p className={s.ref}>{VERSE.ref}</p>
          </section>
        </div>
      </div>

      <div className={s.ways}>
        <VippsBox way={GIFT} side="left" />
        <article className={s.bank}>
          <h2>Bankoverføring</h2>
          <BankText />
          <a className={s.quiet} href={BANK_HREF}>Skriv til oss<span aria-hidden="true">↗</span></a>
        </article>
        <VippsBox way={MONTHLY} side="right" />
      </div>

      <section className={s.phone} aria-label="Måter å gi">
        <VippsCard way={GIFT} />
        <VippsCard way={MONTHLY} warm />
        <div className={s.phoneBank}>
          <h2>Bankoverføring</h2>
          <BankText />
          <a href={BANK_HREF}>Skriv til oss<span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
