import Image from 'next/image';
import Link from 'next/link';
import { ADDRESS, EMAIL, FACEBOOK, YEAR_PDF } from '@/components/forside/links';
import s from './chrome.module.css';

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.foot}>
          <div>
            <Image src="/rahma_logo_hvit.png" alt="Center Rahma" width={438} height={600} />
            <p>Masjid Rahma, {ADDRESS.street}, {ADDRESS.city}.</p>
          </div>
          <div>
            <h4>Moskeen</h4>
            <ul>
              <li><a href={YEAR_PDF.href} download={YEAR_PDF.filename}>Bønnetider 2026</a></li>
              <li><Link href="/#besok">Fredagsbønn</Link></li>
              <li><Link href="/#besok">Finn fram</Link></li>
              <li><Link href="/heritage">Om oss</Link></li>
            </ul>
          </div>
          <div>
            <h4>Fellesskapet</h4>
            <ul>
              <li><Link href="/ung-rahma">Ung Rahma</Link></li>
              <li><Link href="/rahma-skole">Rahma skole</Link></li>
              <li><Link href="/become-member">Bli medlem</Link></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><Link href="/kontakt">Kontakt oss</Link></li>
              <li><Link href="/stott-oss">Støtt oss</Link></li>
              <li><a href={FACEBOOK} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className={s.legal}>
          <span>© {new Date().getFullYear()} Center Rahma · Org.nr. 974444216</span>
          <span>Bønnetider fra MyMasjid</span>
          <span>
            Nettsiden er laget av{' '}
            <a href="https://www.idweb.no" target="_blank" rel="noopener noreferrer">IDweb</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
