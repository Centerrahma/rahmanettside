# Skjemaepost via Microsoft Graph

Kontaktskjemaet (og medlemsskjemaet) sender epost fra nettsiden gjennom Microsoft Graph.

- **Fra:** `webside@centerrahma.no`
- **Til:** `post@centerrahma.no`
- **Svar til:** besøkerens epostadresse, så svar går rett til dem.

## Slik er det satt opp

- **Entra-app:** «Center Rahma Website Contact Form».
- **Innlogging:** Vercel OIDC-føderering. Det finnes ingen klienthemmelighet eller passord å fornye.
  Det føderte påloggingsbeviset i Entra har:
  - Issuer: `https://oidc.vercel.com/centerrahmas-projects`
  - Audience: `https://vercel.com/centerrahmas-projects`
  - Subject: `owner:centerrahmas-projects:project:rahmanettside:environment:production`
- **Tilgang:** Exchange Application RBAC lar appen sende bare som `webside@centerrahma.no`.
  Test: sending som `webside` gir `True`, som `post` gir `False`.
  Ikke gi appen `Mail.Send` for hele tenanten. Det ville gå utenom begrensningen.
- **Bare Production:** beviset gjelder bare produksjonsmiljøet i Vercel. Preview og lokal kjøring får ikke sendt epost.

## Miljøvariabler i Vercel (Production)

| Variabel | Verdi |
|---|---|
| `AZURE_TENANT_ID` | Directory (tenant) ID |
| `AZURE_CLIENT_ID` | Application (client) ID |
| `CONTACT_MAIL_FROM` | Valgfri. Standard `webside@centerrahma.no` |
| `CONTACT_MAIL_TO` | Valgfri. Standard `post@centerrahma.no` |

## Når noe feiler

Feilen står i Vercel-loggene for `/api/contact`.

| Melding | Betydning |
|---|---|
| `Missing environment variables ... AZURE_...` | `AZURE_TENANT_ID` eller `AZURE_CLIENT_ID` mangler i Vercel. |
| `AADSTS70021` / `AADSTS700211` | Issuer, audience eller subject i det føderte påloggingsbeviset stemmer ikke med Vercel-prosjektet. |
| `sendMail failed (403)` med `ErrorAccessDenied` | Appen har ikke lov til å sende som `CONTACT_MAIL_FROM`. Bare `webside@` er tillatt. |
| `sendMail failed (404)` | Postkassen finnes ikke. Sjekk stavingen av `CONTACT_MAIL_FROM`. |
