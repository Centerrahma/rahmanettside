import { VIPPS } from '../components/forside/links';

/**
 * The touch screen at skjerm.centerrahma.no. Each QR code opens the site's own
 * address (/skjerm/<slug>), which forwards to the real link, so a changed link
 * needs no new code on the screen. next.config.ts reads this list for the forwards.
 */
export const SKJERM_SUBDOMAIN = 'skjerm';

const SITE = 'https://www.centerrahma.no';

/** The group's invite link, without WhatsApp's share parameters. */
export const WHATSAPP_GROUP = 'https://chat.whatsapp.com/H1EhOwbHIypAetFiinWllh';

export const SKJERM_LINKS = [
  {
    slug: 'whatsapp',
    title: 'WhatsApp',
    line: 'Bli med i WhatsApp-gruppen',
    target: WHATSAPP_GROUP,
  },
  {
    slug: 'vipps',
    title: 'Vipps',
    line: `Gi en gave med Vipps til ${VIPPS.number}`,
    target: VIPPS.url,
  },
  {
    slug: 'medlem',
    title: 'Bli medlem',
    line: 'Meld deg inn i Masjid Rahma',
    target: '/blimedlem',
  },
] as const;

export type SkjermSlug = (typeof SKJERM_LINKS)[number]['slug'];

export const qrAddress = (slug: SkjermSlug) => `${SITE}/skjerm/${slug}`;
