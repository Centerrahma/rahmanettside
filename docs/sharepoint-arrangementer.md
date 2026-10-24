# Arrangementer fra SharePoint

SharePoint-listen med arrangementer er den eneste kilden for alle arrangementer og møter.
Nettsiden viser bare de som har Category **Public** på `/arrangementer`. Interne arrangementer og møter kommer aldri ut.

Koden: `src/lib/arrangementer.ts` (henter og filtrerer), `src/components/arrangementer/Kalender.tsx`
(kalenderen på forsiden), `src/components/arrangementer/Utstillingen.tsx` (`/arrangementer`: ett arrangement om gangen), `src/app/api/revalidate-events/route.ts` (umiddelbar oppdatering).

Forsiden viser denne og neste uke (mobil: de neste 14 dagene). Uten kommende arrangementer, eller hvis
SharePoint ikke svarer, blir kalenderen borte fra forsiden; resten av forsiden vises som vanlig.

## Innlogging

Arrangementene leses av en egen Entra-app med bare lesetilgang til arrangementlisten
(`Sites.Selected`). Den logger inn med Vercel OIDC, som skjemaeposten (se `microsoft-graph-mail.md`):
det finnes ingen klienthemmelighet. Det føderte påloggingsbeviset bruker standard audience
`https://vercel.com/centerrahmas-projects` og gjelder bare Production, så Preview og lokal kjøring
viser ingen arrangementer.

## SharePoint

- Kolonnen `Category` (Valg: `Internal` / `Public`, standard `Internal`) avgjør hva som vises.
  Den er indeksert. Tomme verdier og alt annet enn `Public` vises aldri.
- Nettsiden leser `Title`, `Category`, `EventDate`, `EndDate`, `Location` og `BannerUrl`. Andre kolonner,
  også `Description`, forlater aldri SharePoint. Er et navn annerledes, endre `F` i
  `src/lib/arrangementer.ts`.
- Gjentakende arrangementer vises bare med første forekomst. Graph folder dem ikke ut.
- Bildet til et arrangement ligger i `BannerUrl` (lenkefelt, `BannerUrl.Url`). SharePoint-filer krever
  innlogging, så nettsiden henter bildet selv med lese-appen og viser det fra sin egen adresse,
  `/api/arrangementer/bilde/<id>`. Ruten sjekker at arrangementet er `Public` hver gang, og leser bare
  filer som ligger i arrangement-siten (f.eks. Site Assets). Bare JPEG, PNG, WebP, GIF og AVIF vises.
  Settes et arrangement til `Internal`, slutter bildet å vises innen fem minutter.

Testet i Graph Explorer 2026-10-24: filteret `fields/Category eq 'Public'` gir element 6, «Public Event».

## Miljøvariabler i Vercel (Production)

| Variabel | Verdi |
|---|---|
| `SHAREPOINT_TENANT_ID` | Directory (tenant) ID |
| `SHAREPOINT_CLIENT_ID` | Application (client) ID for lese-appen |
| `SHAREPOINT_SITE_ID` | Site-ID, f.eks. `centerrahma.sharepoint.com,<guid>,<guid>` |
| `SHAREPOINT_LIST_ID` | Liste-ID (GUID) |
| `REVALIDATE_SECRET` | Valgfri. Lang tilfeldig streng for Power Automate-flyten |

Uten `SHAREPOINT_SITE_ID` og `SHAREPOINT_LIST_ID` viser siden «Ingen kommende arrangementer»
og ber søkemotorer om ikke å indeksere den. Nye variabler gjelder først etter en ny deploy.

## Oppdatering

Siden henter listen på nytt hvert minutt, så et arrangement som settes tilbake til `Internal` forsvinner innen et par minutter. For umiddelbar oppdatering, lag en Power Automate-flyt:

1. Utløser: «When an item is created or modified» på arrangementlisten.
2. HTTP POST til `https://www.centerrahma.no/api/revalidate-events` med headeren
   `x-revalidate-secret: <REVALIDATE_SECRET>`.

Svar `200 {"revalidated":true}` betyr at det virket. `401` betyr feil eller manglende hemmelighet.

## Når noe feiler

Feilen står i Vercel-loggene for `/arrangementer`. Ved feil beholder Next den siste gode versjonen av siden.

| Melding | Betydning |
|---|---|
| `Missing environment variables ... SHAREPOINT_...` | `SHAREPOINT_TENANT_ID` eller `SHAREPOINT_CLIENT_ID` mangler. |
| `AADSTS70021` / `AADSTS700211` | Det føderte påloggingsbeviset på lese-appen stemmer ikke med Vercel-prosjektet. |
| `list items failed (403)` | Appen mangler `Sites.Selected` eller read-tilgang til siten. |
| `list items failed (404)` | Feil site-ID eller liste-ID. |
| `Picture for item … is not in the events site` | Bildet ligger utenfor arrangement-siten. Last det opp via listen. |
| `/api/arrangementer/bilde/<id>` gir 502 | Se Vercel-loggen for ruten; ofte mangler lese-tilgang til biblioteket. |
| `list items failed (400)` med «field ... not recognized» | Et kolonnenavn i `F` finnes ikke i listen. |
