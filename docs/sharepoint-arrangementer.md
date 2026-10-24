# Arrangementer fra SharePoint

SharePoint-listen med arrangementer er den eneste kilden for alle arrangementer og møter.
Nettsiden viser bare de som er merket **Public** på `/arrangementer`. Interne arrangementer og møter kommer aldri ut.

Koden: `src/lib/arrangementer.ts` (henter og filtrerer), `src/app/arrangementer/page.tsx` (siden),
`src/app/api/revalidate-events/route.ts` (umiddelbar oppdatering).

## Innlogging

Nettsiden bruker samme Entra-app og samme Vercel OIDC-innlogging som skjemaeposten
(se `microsoft-graph-mail.md`). Det finnes ingen klienthemmelighet å lagre eller fornye.
Innloggingen virker bare i Production, så Preview og lokal kjøring viser ingen arrangementer.

## SharePoint

- [ ] Legg til kolonnen `Visibility`, type Valg (Choice), med verdiene `Internal` og `Public`.
      Standard `Internal`, obligatorisk. Kalendermalen har allerede en kolonne som heter «Category»,
      derfor et eget navn.
- [ ] Indekser `Visibility` (Listeinnstillinger → Indekserte kolonner). Uten indeks kan filteret
      feile når listen blir stor.
- [ ] Sjekk de interne kolonnenavnene. Koden forventer `Title`, `EventDate`, `EndDate`,
      `fAllDayEvent`, `Location`, `Description` og `Visibility`. Er noen annerledes, endre `F` i
      `src/lib/arrangementer.ts`.
- [ ] Vurder et godkjenningssteg før et arrangement settes til Public.

Gjentakende arrangementer vises bare med første forekomst. Graph folder dem ikke ut.

## Entra ID (IT-admin)

- [ ] Gi den eksisterende appen «Center Rahma Website Contact Form» Graph-tillatelsen
      `Sites.Selected` (Application) og gi admin consent.
- [ ] Gi appen **read** på bare arrangement-siten:
      `POST https://graph.microsoft.com/v1.0/sites/{site-id}/permissions` med
      `{"roles":["read"],"grantedToIdentities":[{"application":{"id":"<client-id>","displayName":"Center Rahma Website"}}]}`
- [ ] Finn site-ID: `GET https://graph.microsoft.com/v1.0/sites/{tenant}.sharepoint.com:/sites/{site-navn}`
- [ ] Finn liste-ID: `GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists?$select=id,displayName`

## Miljøvariabler i Vercel (Production)

| Variabel | Verdi |
|---|---|
| `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` | Finnes allerede (skjemaeposten) |
| `SHAREPOINT_SITE_ID` | Site-ID, f.eks. `centerrahma.sharepoint.com,<guid>,<guid>` |
| `SHAREPOINT_LIST_ID` | Liste-ID (GUID) |
| `REVALIDATE_SECRET` | Lang tilfeldig streng. Bare for Power Automate-flyten |

Uten `SHAREPOINT_SITE_ID` og `SHAREPOINT_LIST_ID` viser siden «Ingen kommende arrangementer»
og ber søkemotorer om ikke å indeksere den.

## Oppdatering

Siden henter listen på nytt hvert femte minutt. For umiddelbar oppdatering, lag en Power Automate-flyt:

1. Utløser: «When an item is created or modified» på arrangementlisten.
2. HTTP POST til `https://www.centerrahma.no/api/revalidate-events` med headeren
   `x-revalidate-secret: <REVALIDATE_SECRET>`.

Svar `200 {"revalidated":true}` betyr at det virket. `401` betyr feil eller manglende hemmelighet.

## Når noe feiler

Feilen står i Vercel-loggene for `/arrangementer`. Ved feil beholder Next den siste gode versjonen av siden.

| Melding | Betydning |
|---|---|
| `Missing environment variables ... AZURE_...` | `AZURE_TENANT_ID` eller `AZURE_CLIENT_ID` mangler. |
| `list items failed (403)` | Appen mangler `Sites.Selected` eller read-tilgang til siten. |
| `list items failed (404)` | Feil site-ID eller liste-ID. |
| `list items failed (400)` med «field ... not recognized» | Et kolonnenavn i `F` finnes ikke i listen. |
