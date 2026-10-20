'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { EMAIL } from '@/components/forside/links';
import { SALAM } from '../verses';
import { starPoints } from '../stott/stjerne';
import s from './konvolutt.module.css';

const TOPICS = ['Generell henvendelse', 'Guidede turer', 'Skolebesøk', 'Nikah-tjenester'];
type State = 'closed' | 'open' | 'sending' | 'sent' | 'error';

/** Postmark ring text, set on a circle. */
const RING = 'MASJID RAHMA · OSLO · MASJID RAHMA · OSLO · ';

/** The envelope's other side, seen once it is sent: the white logo, the address, a stamp and its postmark. */
function Forside({ date }: { date: string }) {
  return (
    <div className={s.face} aria-hidden="true">
      <span className={s.stamp}>
        <svg viewBox="0 0 120 148">
          <defs>
            <mask id="k2-perf">
              <rect width="120" height="148" fill="#fff" />
              {Array.from({ length: 12 }, (_, i) => <circle key={`t${i}`} cx={5 + i * 10} cy="0" r="3.6" fill="#000" />)}
              {Array.from({ length: 12 }, (_, i) => <circle key={`b${i}`} cx={5 + i * 10} cy="148" r="3.6" fill="#000" />)}
              {Array.from({ length: 15 }, (_, i) => <circle key={`l${i}`} cx="0" cy={4 + i * 10} r="3.6" fill="#000" />)}
              {Array.from({ length: 15 }, (_, i) => <circle key={`r${i}`} cx="120" cy={4 + i * 10} r="3.6" fill="#000" />)}
            </mask>
          </defs>
          <g mask="url(#k2-perf)">
            <rect width="120" height="148" fill="#f7f0e3" />
            <image href="/kontakt/frimerke-mihrab.jpg" x="10" y="10" width="100" height="106" preserveAspectRatio="xMidYMid slice" />
            <rect x="10" y="10" width="100" height="106" fill="none" stroke="#b08a45" strokeWidth="1.5" />
            <text x="60" y="134" textAnchor="middle" className={s.stampText}>NORGE</text>
          </g>
        </svg>
      </span>
      <span className={s.postmark}>
        <svg viewBox="0 0 220 120">
          <defs><path id="k2-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
          <circle cx="60" cy="60" r="54" /><circle cx="60" cy="60" r="34" />
          <text className={s.ringText}><textPath href="#k2-ring">{RING}</textPath></text>
          <text x="60" y="57" textAnchor="middle" className={s.dateText}>{date}</text>
          <text x="60" y="73" textAnchor="middle" className={s.sentText}>SENDT</text>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M118 ${36 + i * 16} q12 -7 24 0 t24 0 t24 0 t24 0`} />)}
        </svg>
      </span>
      <Image className={s.logo} src="/rahma-logo-white.webp" width={263} height={360} alt="" />
      <p className={s.to}>
        <span>Til Masjid Rahma</span>
        <span>Tvetenveien 152A</span>
        <span>0671 Oslo</span>
      </p>
    </div>
  );
}

/**
 * The page's hero is a sealed envelope with the greeting on its front. The first scroll (or a tap on
 * the seal) opens it and the letter, which is the form, rises out. The seal is then the send button:
 * sending slides the letter back in, closes the flap and stamps the seal. Posts to /api/contact.
 * Without script the envelope is open (see the noscript rule), so the form always works.
 *
 * On Kontakt oss it is the page's hero, titled with the h1, and goes back to the top once sent. Further down
 * a page (the front page on phones) pass `inPage`: the title is not a heading, and once sent the envelope
 * stays in view instead.
 */
export default function Konvolutt({ inPage = false }: { inPage?: boolean }) {
  const self = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<State>('closed');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setState('open'); return; }
    const open = () => setState((st) => (st === 'closed' ? 'open' : st));
    const onScroll = () => { if (window.scrollY > 24) open(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'closed') { setState('open'); return; }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setDate(new Intl.DateTimeFormat('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'Europe/Oslo' }).format(new Date()));
      setState('sent');
      if (inPage) self.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setState('error');
    }
  }

  const sealed = state === 'closed' || state === 'sent';
  return (
    <form ref={self} className={s.env} data-state={state} onSubmit={onSubmit} noValidate={state === 'closed'} aria-labelledby="k2-title">
      <noscript><style>{`.${s.env}[data-state] .${s.letter}{max-height:none;padding:20px 18px 84px;transform:none;opacity:1}`}</style></noscript>
      <div className={s.card}>
      <div className={s.back} aria-hidden="true" />
      <svg className={s.flap} viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H400 L200 110 Z" />
        <path className={s.flapLine} d="M14 5 L200 99 L386 5" />
      </svg>

      <fieldset className={s.letter} disabled={sealed} aria-hidden={sealed}>
        <legend className={s.dear}>Til Masjid Rahma,</legend>
        <label><span>Navn</span><input name="name" autoComplete="name" required /></label>
        <label><span>E-post</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Emne</span>
          <select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label className={s.msg}><span>Melding</span><textarea name="message" rows={5} required /></label>
      </fieldset>

      <div className={s.pocket}>
        <svg className={s.fold} viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 300 L170 120 M400 300 L230 120" />
        </svg>
        <button className={s.seal} type="submit" disabled={state === 'sending' || state === 'sent'}
          aria-label={state === 'closed' ? 'Åpne brevet' : state === 'sent' ? 'Sendt' : 'Send brevet'}>
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="38" />
            <polygon points={starPoints(40, 40, 26)} className={s.sealStar} />
            <polygon points={starPoints(40, 40, 11, 22.5)} className={s.sealCore} />
          </svg>
          <span>{state === 'open' || state === 'error' ? 'Send' : state === 'sending' ? '…' : ''}</span>
        </button>
        <p className={s.salam} lang="ar" dir="rtl">{SALAM.ar}</p>
        {inPage
          ? <p id="k2-title" className={s.title}>Kontakt oss</p>
          : <h1 id="k2-title" className={s.title}>Kontakt oss</h1>}
        <p className={s.status} role="status" aria-live="polite">
          {state === 'closed' && 'Kom innom, eller skriv et brev til oss. Bla ned, så åpner vi konvolutten.'}
          {state === 'open' && 'Skriv brevet, og trykk på seglet for å sende det.'}
          {state === 'sending' && 'Sender brevet …'}
          {state === 'sent' && <><b>Takk! Brevet er sendt.</b> Vi svarer så snart vi kan.</>}
          {state === 'error' && <>Brevet ble ikke sendt. Skriv til <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}
        </p>
      </div>
      <Forside date={date} />
      </div>
      {state === 'sent' && <p className={s.thanks} aria-hidden="true"><b>Takk! Brevet er sendt.</b> Vi svarer så snart vi kan.</p>}
    </form>
  );
}
