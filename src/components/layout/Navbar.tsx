'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { YEAR_PDF } from '@/components/forside/links';
import s from './chrome.module.css';

const LINKS = [
  { href: '/stott-oss', label: 'Støtt oss' },
  { href: '/kontakt', label: 'Kontakt oss' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // links close the phone menu themselves; Escape closes it too
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const items = (
    <>
      {LINKS.map((link) => (
        <li key={link.href}>
          <Link href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
        </li>
      ))}
      <li>
        <a href={YEAR_PDF.href} download={YEAR_PDF.filename}>Bønnetider 2026</a>
      </li>
    </>
  );

  return (
    <header className={s.nav}>
      <div className={`${s.wrap} ${s.bar}`}>
        <Link href="/" className={s.logo} aria-label="Center Rahma, forsiden">
          <Image src="/hvit_rahma_300.png" alt="" width={219} height={300} priority />
        </Link>
        <ul className={s.links}>{items}</ul>
        <Link className={s.cta} href="/blimedlem">Bli medlem</Link>
        <button
          type="button"
          className={s.burger}
          aria-label={open ? 'Lukk meny' : 'Meny'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
      <nav id="nav-menu" className={s.menu} hidden={!open} aria-label="Meny">
        <div className={s.wrap}>
          <ul>{items}</ul>
          <Link className={s.cta} href="/blimedlem" onClick={() => setOpen(false)}>Bli medlem</Link>
        </div>
      </nav>
    </header>
  );
}
