/**
 * The marks on the touch screen's three buttons, plus the gold rule under the title.
 * WhatsApp: the glyph from simple-icons (source: Meta's WhatsApp brand resources).
 * Vipps: the app mark from developer.vippsmobilepay.com (img/logos/vipps-orange.svg),
 * drawn white with an orange smile so it sits on the orange button.
 * Medlem: our own drawing, a member card with a gold star seal and a plus to join.
 */

export function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

export function VippsMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="#fffdfb"
        d="M20,6.33c0-.24,0-.49,0-.73,0-.21,0-.41,0-.61,0-.45-.05-.89-.12-1.33-.08-.44-.22-.87-.42-1.26-.41-.8-1.06-1.45-1.86-1.86-.4-.2-.82-.34-1.26-.42-.44-.07-.88-.11-1.33-.12-.2,0-.41,0-.61,0-.24,0-.48,0-.73,0h-7.33C6.09,0,5.85,0,5.61,0c-.2,0-.41,0-.61,0-.45,0-.89.05-1.33.12-.44.07-.87.22-1.26.42-.8.41-1.45,1.06-1.86,1.86-.2.4-.34.83-.42,1.26-.07.44-.11.88-.12,1.33,0,.21,0,.41,0,.61C0,5.85,0,6.09,0,6.33v7.33C0,13.91,0,14.15,0,14.39c0,.21,0,.41,0,.61,0,.45.04.89.12,1.33.08.44.22.87.42,1.27.41.8,1.06,1.45,1.86,1.86.4.2.82.34,1.26.42.44.07.88.11,1.33.12.2,0,.41,0,.61,0,.24,0,.48,0,.73,0h7.33c.24,0,.48,0,.73,0,.2,0,.41,0,.61,0,.45,0,.89-.04,1.33-.12.44-.07.87-.22,1.26-.42.8-.41,1.45-1.06,1.86-1.86.2-.4.34-.83.42-1.27.07-.44.11-.88.12-1.33,0-.2,0-.41,0-.61,0-.24,0-.48,0-.73v-7.33h0Z"
      />
      <path
        fill="#ff5b24"
        d="M10.3,12.72c1.75,0,2.74-.85,3.69-2.08.52-.66,1.18-.8,1.66-.43.47.38.52,1.09,0,1.75-1.37,1.8-3.12,2.89-5.35,2.89-2.41,0-4.54-1.32-6.01-3.64-.43-.62-.33-1.28.14-1.61s1.18-.19,1.61.47c1.04,1.56,2.46,2.65,4.26,2.65h0ZM13.57,6.9c0,.85-.66,1.42-1.42,1.42s-1.42-.57-1.42-1.42.66-1.42,1.42-1.42,1.42.62,1.42,1.42Z"
      />
    </svg>
  );
}

/** An eight-pointed star (khatam): a square and the same square turned 45°. */
function star(cx: number, cy: number, r: number) {
  const a = r * Math.SQRT1_2;
  return {
    diamond: `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`,
    square: `${cx - a},${cy - a} ${cx + a},${cy - a} ${cx + a},${cy + a} ${cx - a},${cy + a}`,
  };
}

export function MedlemMark({ className }: { className?: string }) {
  const seal = star(96, 24, 11);
  return (
    <svg className={className} viewBox="0 0 132 104" aria-hidden="true">
      <g transform="rotate(-7 62 50)">
        {/* the card */}
        <rect x="10" y="10" width="104" height="72" rx="9" fill="#fbf6ea" />
        <rect x="14.5" y="14.5" width="95" height="63" rx="6" fill="none" stroke="#c9a35b" strokeWidth="1.4" />
        {/* the member */}
        <circle cx="40" cy="44" r="15" fill="#e3efe8" />
        <circle cx="40" cy="39.5" r="5.6" fill="#0b6a4c" />
        <path d="M29.6 54.2c1.6-6 5.6-9 10.4-9s8.8 3 10.4 9a15 15 0 0 1-20.8 0Z" fill="#0b6a4c" />
        {/* name lines */}
        <rect x="62" y="44" width="36" height="4.4" rx="2.2" fill="#0b6a4c" />
        <rect x="62" y="53" width="26" height="4.4" rx="2.2" fill="#c9a35b" />
        {/* the star seal */}
        <polygon points={seal.square} fill="#c9a35b" />
        <polygon points={seal.diamond} fill="#c9a35b" />
        <circle cx="96" cy="24" r="4.4" fill="#fbf6ea" />
        <circle cx="96" cy="24" r="2" fill="#ad8236" />
      </g>
      {/* join */}
      <circle cx="108" cy="80" r="17" fill="#c9a35b" stroke="#fbf6ea" strokeWidth="3" />
      <path d="M108 71.5v17M99.5 80h17" stroke="#fbf6ea" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

/** The gold rule under the title: two tapering lines, small diamonds, a star in the middle. */
export function TitleRule({ className }: { className?: string }) {
  const mid = star(300, 24, 21);
  const ring = star(300, 24, 15);
  const core = star(300, 24, 8);
  return (
    <svg className={className} viewBox="0 0 600 48" aria-hidden="true">
      <path d="M4 24 L252 22.8 L252 25.2 Z" fill="#c9a35b" />
      <path d="M596 24 L348 22.8 L348 25.2 Z" fill="#c9a35b" />
      <polygon points="252,24 259,17 266,24 259,31" fill="#ad8236" />
      <polygon points="334,24 341,17 348,24 341,31" fill="#ad8236" />
      <polygon points={mid.square} fill="#ad8236" />
      <polygon points={mid.diamond} fill="#ad8236" />
      <polygon points={ring.square} fill="#fffdfb" />
      <polygon points={ring.diamond} fill="#fffdfb" />
      <polygon points={core.square} fill="#c9a35b" />
      <polygon points={core.diamond} fill="#c9a35b" />
    </svg>
  );
}
