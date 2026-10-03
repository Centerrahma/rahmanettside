/* Line icons on a 48 grid, stroked like the drawings. */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const BankIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <path d="M6,18 L24,6 L42,18 Z M8,42 H40 M6,46 H42" />
    <path d="M12,22 V38 M20,22 V38 M28,22 V38 M36,22 V38" />
  </svg>
);
export const HeartIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <path d="M24,41 C10,31 5,24 5,17 C5,11 10,7 15,7 C19,7 22,9 24,13 C26,9 29,7 33,7 C38,7 43,11 43,17 C43,24 38,31 24,41 Z" />
  </svg>
);
export const PinIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <path d="M24,44 C24,44 38,30 38,19 C38,11 32,5 24,5 C16,5 10,11 10,19 C10,30 24,44 24,44 Z" />
    <circle cx="24" cy="19" r="5" />
  </svg>
);
export const MoonIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <path d="M30,6 C20,8 13,16 13,26 C13,36 21,43 31,43 C35,43 39,41 42,38 C31,38 23,30 23,20 C23,13 26,8 30,6 Z" />
  </svg>
);
export const MailIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <rect x="5" y="10" width="38" height="28" rx="4" />
    <path d="M6,12 L24,26 L42,12" />
  </svg>
);
export const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" {...P}>
    <circle cx="24" cy="24" r="19" />
    <path d="M27,42 V24 H33 M27,24 V19 C27,16 28,15 31,15 H33 M21,28 H33" />
  </svg>
);
