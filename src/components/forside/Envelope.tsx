'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { ADDRESS, EMAIL } from './links';
import e from './envelope.module.css';

/* Sending a message: the letter slides into an envelope, the flap closes under a wax seal,
   the envelope turns over to Masjid Rahma's address and a stamp is struck with today's date.
   Plays once, and only after /api/contact has accepted the message. */

export type Sent = { name: string; topic: string; message: string };
type Status = 'idle' | 'sending' | 'sealing' | 'error';

/** Posts the form to /api/contact, which mails the mosque's inbox. */
export function useSend() {
  const [status, setStatus] = useState<Status>('idle');
  const [sent, setSent] = useState<Sent | null>(null);
  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      setSent({ name: data.name ?? '', topic: data.topic ?? '', message: data.message ?? '' });
      form.reset();
      setStatus('sealing');
    } catch {
      setStatus('error');
    }
  }
  const reset = () => { setStatus('idle'); setSent(null); };
  return { status, sent, onSubmit, reset };
}

/** An eight-pointed star, for the seal and the lining. */
const star = (cx: number, cy: number, r0: number) => {
  let d = '';
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? r0 * 0.7654 : r0;
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
};

function Stamp() {
  // perforated edge: a cream sheet with half-circles bitten out along every side
  const holes: ReactNode[] = [];
  for (let x = 6; x <= 94; x += 8) holes.push(<circle key={`t${x}`} cx={x} cy={0} r={3} />, <circle key={`b${x}`} cx={x} cy={120} r={3} />);
  for (let y = 6; y <= 114; y += 8) holes.push(<circle key={`l${y}`} cx={0} cy={y} r={3} />, <circle key={`r${y}`} cx={100} cy={y} r={3} />);
  return (
    <svg viewBox="0 0 100 120" className={e.stamp} aria-hidden="true">
      <defs>
        <mask id="stamp-perf"><rect width="100" height="120" fill="#fff" /><g fill="#000">{holes}</g></mask>
      </defs>
      <g mask="url(#stamp-perf)">
        <rect width="100" height="120" fill="#fbf6ec" />
        <rect x="8" y="8" width="84" height="104" fill="#0f5d4e" />
        {/* the mihrab: two round arches under the verse panel */}
        <rect x="20" y="22" width="60" height="62" fill="#efe4d0" />
        <rect x="23" y="25" width="54" height="8" fill="#0f5d4e" opacity=".25" />
        <path d="M27,84 V52 A10,10 0 0 1 47,52 V84 Z M53,84 V52 A10,10 0 0 1 73,52 V84 Z" fill="#c98a4b" />
        <rect x="56" y="70" width="14" height="14" fill="#a3563f" />
        <text x="50" y="100" textAnchor="middle" fontSize="9.5" fill="#faf5ec" fontFamily="var(--serif)" fontWeight="600">Masjid Rahma</text>
      </g>
    </svg>
  );
}

function Postmark({ date }: { date: string }) {
  return (
    <svg viewBox="0 0 220 90" className={e.postmark} aria-hidden="true">
      <g fill="none" stroke="#1e3e36" strokeWidth="2">
        <circle cx="45" cy="45" r="38" />
        <circle cx="45" cy="45" r="30" />
        <path d="M92,30 C110,22 128,38 146,30 S182,22 214,30 M92,45 C110,37 128,53 146,45 S182,37 214,45 M92,60 C110,52 128,68 146,60 S182,52 214,60" />
      </g>
      <text x="45" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e3e36">OSLO</text>
      <text x="45" y="56" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e3e36">{date}</text>
    </svg>
  );
}

/** The envelope and the letter going into it. Shown while `sealing`; the caller hides its form. */
export function Envelope({ sent, onAgain }: { sent: Sent; onAgain: () => void }) {
  const today = new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date());
  return (
    <div className={e.wrap}>
      <div className={e.env}>
        <div className={e.card}>
          {/* the back: lining, the letter, the pocket, the flap and its seal */}
          <div className={e.back}>
            <svg className={e.body} viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <pattern id="env-lining" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#0f5d4e" />
                  <path d={star(20, 20, 11)} fill="none" stroke="#c9a35b" strokeWidth="1" opacity=".7" />
                </pattern>
              </defs>
              <rect width="600" height="380" rx="10" fill="#eadfcb" />
              <path d="M14,14 H586 L300,210 Z" fill="url(#env-lining)" />
            </svg>
            <div className={e.letter}>
              <p className={e.dear}>Til Masjid Rahma,</p>
              <p className={e.lines}>{sent.message.slice(0, 160)}{sent.message.length > 160 ? ' …' : ''}</p>
              <p className={e.from}>Hilsen {sent.name}</p>
            </div>
            <svg className={e.pocket} viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,120 L300,262 L600,120 V370 Q600,380 590,380 H10 Q0,380 0,370 Z" fill="#f4ecdd" />
              <path d="M0,120 L300,262 L600,120" fill="none" stroke="#dccfb6" strokeWidth="2" />
              <path d="M0,380 L270,236 M600,380 L330,236" stroke="#e3d6bf" strokeWidth="2" />
            </svg>
            <div className={e.flap}>
              <svg className={e.flapOut} viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 H600 L318,206 Q300,218 282,206 Z" fill="#efe5d3" stroke="#dccfb6" strokeWidth="2" />
              </svg>
              <svg className={e.flapIn} viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,0 H600 L318,206 Q300,218 282,206 Z" fill="url(#env-lining)" />
              </svg>
            </div>
            <span className={e.seal} aria-hidden="true">
              <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#a3473c" /><circle cx="30" cy="30" r="21" fill="none" stroke="#c96a5d" strokeWidth="2" /><path d={star(30, 30, 13)} fill="#c96a5d" /></svg>
            </span>
          </div>
          {/* the front: Masjid Rahma's name and address, the stamp and the postmark */}
          <div className={e.front}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a small decoration inside a 3D-flipped card */}
            <img className={e.logo} src="/rahma-logo.png" alt="" />
            <div className={e.addr}>
              <b>Masjid Rahma</b>
              <span>{ADDRESS.street}</span>
              <span>{ADDRESS.city}</span>
            </div>
            <Stamp />
            <Postmark date={today} />
          </div>
        </div>
      </div>
      <div className={e.thanks} role="status" aria-live="polite">
        <p><b>Takk{sent.name ? `, ${sent.name.split(' ')[0]}` : ''}!</b> Brevet ditt er sendt. Vi svarer så snart vi kan.</p>
        <button type="button" onClick={onAgain}>Skriv et nytt brev</button>
      </div>
    </div>
  );
}

export function SendError() {
  return <p className={e.error} role="alert">Meldingen ble ikke sendt. Prøv igjen, eller skriv til <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>;
}
