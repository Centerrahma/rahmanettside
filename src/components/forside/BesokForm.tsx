'use client';

import { useState, type FormEvent } from 'react';
import { EMAIL } from './links';
import s from './forside.module.css';

const TOPICS = ['Generell henvendelse', 'Guidede turer', 'Skolebesøk', 'Nikah-tjenester'];

/** Sends to /api/contact, which mails the mosque's inbox. */
export default function BesokForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.two}>
        <label>
          <span>Fullt navn</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>E-postadresse</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        <span>Emne</span>
        <select name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>
        <span>Melding</span>
        <textarea name="message" rows={4} required />
      </label>
      <button className={`${s.btn} ${s.primary}`} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sender …' : 'Send melding'}
      </button>
      <p className={s.formNote} role="status" aria-live="polite">
        {status === 'sent' && 'Takk! Meldingen er sendt, og vi svarer så snart vi kan.'}
        {status === 'error' && (
          <>
            Meldingen ble ikke sendt. Prøv igjen, eller skriv til{' '}
            <a className={s.link} href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </>
        )}
      </p>
    </form>
  );
}
