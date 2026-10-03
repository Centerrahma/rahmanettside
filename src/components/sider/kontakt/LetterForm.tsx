'use client';

import { useState, type FormEvent } from 'react';
import { EMAIL } from '@/components/forside/links';
import k from './kontakt.module.css';

const TOPICS = ['Generell henvendelse', 'Guidede turer', 'Skolebesøk', 'Nikah-tjenester'];

/** The message form written as a letter on the page: ruled lines, and a seal to send it.
    Posts to /api/contact like the site's form. */
export default function LetterForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={k.letter} onSubmit={onSubmit}>
      <p className={k.dear}>Til Masjid Rahma,</p>
      <div className={k.pair}>
        <label><span>Navn</span><input name="name" autoComplete="name" required /></label>
        <label><span>E-post</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label><span>Emne</span>
        <select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <label className={k.msg}><span>Melding</span><textarea name="message" rows={4} required /></label>
      <div className={k.sign}>
        <p role="status" aria-live="polite">
          {status === 'idle' && 'Vi svarer så snart vi kan.'}
          {status === 'sending' && 'Sender …'}
          {status === 'sent' && 'Takk! Meldingen er sendt.'}
          {status === 'error' && <>Ikke sendt. Skriv til <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</>}
        </p>
        <button className={k.seal} type="submit" disabled={status === 'sending'}>Send</button>
      </div>
    </form>
  );
}
