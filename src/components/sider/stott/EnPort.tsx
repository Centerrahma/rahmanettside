'use client';

import { useState } from 'react';
import { VERSES } from '../verses';
import { After, Band, Bank, Crown, Ground, Member, PATTERNS, Portal, Vipps } from './Port';
import m from './mobil.module.css';

const WAYS = [
  { label: 'Vipps', verse: VERSES.v9_18, body: <Vipps /> },
  { label: 'Bank', verse: VERSES.v3_92, body: <Bank /> },
  { label: 'Medlem', verse: VERSES.v2_245, body: <Member /> },
];

/** Støtt oss on phones and tablets: one great portal under the evening sky. A switch in its room
    chooses which way to give stands there, and the verse band under the arch follows the choice. */
export default function EnPort() {
  const [i, setI] = useState(0);
  return (
    <div className={m.page} style={PATTERNS}>
      <div className={m.scene}>
        <Crown>
          <h1>Støtt moskeen vår</h1>
        </Crown>
        <div className={m.great}>
          <Portal bandBelow band={<Band v={WAYS[i].verse} />}>
            <div className={m.tabs} role="tablist" aria-label="Velg hvordan du vil gi">
              {WAYS.map((w, k) => (
                <button key={w.label} type="button" role="tab" id={`gi-${k}`} aria-selected={k === i} aria-controls="gi-panel" onClick={() => setI(k)}>{w.label}</button>
              ))}
            </div>
            <div role="tabpanel" id="gi-panel" aria-labelledby={`gi-${i}`}>{WAYS[i].body}</div>
          </Portal>
        </div>
        <Ground />
      </div>
      <After />
    </div>
  );
}
