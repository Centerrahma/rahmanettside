'use client';

import { Envelope, SendError, useSend } from './Envelope';
import s from './besok.module.css';

const TOPICS = ['Generell henvendelse', 'Guidede turer', 'Skolebesøk', 'Nikah-tjenester'];

/** The message form written as a letter on ruled lines, sent with a wax seal. Once the message has
    gone, the letter folds into an envelope addressed to the mosque. */
export default function KontaktBrev() {
  const { status, sent, onSubmit, reset } = useSend();
  if (status === 'sealing' && sent) return <Envelope sent={sent} onAgain={reset} />;
  return (
    <form className={s.letter} onSubmit={onSubmit}>
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
        <span className={s.note} role="status" aria-live="polite">
          {status === 'sending' ? 'Brettes og legges i konvolutt …' : 'Vi svarer så snart vi kan.'}
        </span>
        <button className={s.seal} type="submit" disabled={status === 'sending'}>Send</button>
      </div>
      {status === 'error' && <SendError />}
    </form>
  );
}
