import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Porten from '@/components/sider/Porten';
import { BankIcon, HeartIcon, PhoneIcon } from '@/components/sider/icons';
import { BANK_ACCOUNT, ORG_NR, VIPPS } from '@/components/forside/links';
import f from '@/components/forside/forside.module.css';
import s from '@/components/sider/sider.module.css';

const URL = 'https://www.centerrahma.no/stott-oss';
const TITLE = 'Støtt moskeen – Masjid Rahma';
const DESCRIPTION = 'Masjid Rahma drives av gaver fra menigheten. Gi med Vipps til 77811, eller bli medlem.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Masjid Rahma',
    locale: 'nb_NO',
    type: 'website',
    images: [{ url: '/og-forside.png', width: 1200, height: 630, alt: 'Tegning av moskeens fasade med fem buer' }],
  },
};

export default function StottOssPage() {
  return (
    <main className={s.page}>
      <div className={f.wrap}>
        <div className={s.hg}>
          <h1 className={s.h1}>Støtt moskeen</h1>
          <p className={s.lede}>Masjid Rahma drives av gaver fra menigheten. Hver gave holder døra åpen for bønn, undervisning og fellesskap.</p>
        </div>
        <div className={`${s.drawing} ${s.porten}`}>
          <Porten />
        </div>
        <p className={s.gloss}>
          <q>Bare den som tror på Gud og den ytterste dag, holder Guds moskeer i hevd.</q>
          <span>Koranen 9:18</span>
        </p>

        <section className={s.sec} aria-labelledby="gi-h2">
          <h2 id="gi-h2" className={s.h2}>Slik kan du gi</h2>
          <div className={s.ways}>
            <article className={`${s.way} ${s.feat}`}>
              <PhoneIcon />
              <h3>Vipps</h3>
              <Image src="/vippsdonasjon.png" alt="QR-kode for å gi med Vipps" width={150} height={150} />
              <span className={s.label}>Vipps-nummer</span>
              <b className={`${s.big} ${f.num}`}>{VIPPS.number}</b>
              <a className={`${f.btn} ${f.vipps} ${s.push}`} href={VIPPS.url} target="_blank" rel="noopener noreferrer">Gi med Vipps</a>
            </article>
            {BANK_ACCOUNT && (
              <article className={s.way}>
                <BankIcon />
                <h3>Bankoverføring</h3>
                <span className={s.label}>Kontonummer</span>
                <b className={`${s.account} ${f.num}`}>{BANK_ACCOUNT}</b>
                <p>Skriv «Gave» i meldingsfeltet.</p>
                <p className={s.label}>Center Rahma · Org.nr. {ORG_NR}</p>
              </article>
            )}
            <article className={s.way}>
              <HeartIcon />
              <h3>Bli medlem</h3>
              <p>Medlemskapet støtter driften av moskeen og programmene, år etter år.</p>
              <Link className={`${f.btn} ${f.primary} ${s.push}`} href="/become-member">Bli medlem</Link>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
