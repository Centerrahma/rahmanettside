'use client';

import { useSyncExternalStore } from 'react';
import { Envelope, SendError, useSend } from './Envelope';
import s from './besok.module.css';

const noop = () => () => {};
const TOPICS = ['Generell henvendelse', 'Guidede turer', 'Skolebesøk', 'Nikah-tjenester'];

/** The message form written as a letter on ruled lines, sent with a wax seal. Once the message has
    gone, the letter folds into an envelope addressed to the mosque. */
export default function KontaktBrev() {
  const { status, sent, onSubmit, reset } = useSend();
  // the form only works once its script has loaded; before that, Send waits rather than posting the letter to the page
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const done = status === 'sealing' && sent;
  return (
    <>
      {/* one live region that stays mounted, so screen readers hear that the letter went */}
      <p className={s.sr} role="status" aria-live="polite">{done ? 'Takk! Brevet ditt er sendt. Vi svarer så snart vi kan.' : ''}</p>
      {done ? <Envelope sent={sent} onAgain={reset} /> : (
    <form className={s.letter} method="post" onSubmit={onSubmit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0 }} />
      <p className={s.dear}>Til Masjid Rahma,</p>
      <label className={s.msg}>
        <span>Melding</span>
        <textarea name="message" rows={5} required placeholder="Skriv brevet ditt her …" />
      </label>
      <label>
        <span>Emne</span>
        <select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <div className={s.pair}>
        <label><span>Hilsen</span><input name="name" autoComplete="name" required /></label>
        <label><span>E-post</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className={s.sendRow}>
        <span className={s.note}>
          {status === 'sending' ? 'Brettes og legges i konvolutt …' : 'Vi svarer så snart vi kan.'}
        </span>
        <button className={s.seal} type="submit" disabled={!ready || status === 'sending'}>Send</button>
      </div>
      {status === 'error' && <SendError />}
    </form>
      )}
    </>
  );
}
