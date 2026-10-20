# E-post fra nettsiden via Microsoft 365

Kontaktskjemaet på centerrahma.no sender e-post gjennom Microsoft Graph, som postkassen `webside@centerrahma.no`. Nettsiden logger inn med en egen app i Entra (Azure AD) og en apphemmelighet. Ingen passord til postkasser lagres noe sted, og det brukes ikke SMTP.

Denne veiledningen er for den som administrerer Microsoft 365 for Center Rahma. Det tar omtrent 20 minutter. Du trenger rollen **Global Administrator**, eller både **Application Administrator** og **Exchange Administrator**.

Menyene i Entra og Exchange står på engelsk nedenfor, slik de vanligvis vises.

## 1. Opprett postkassen som sender

En delt postkasse er gratis og trenger ingen lisens.

1. Gå til <https://admin.exchange.microsoft.com> → **Recipients** → **Mailboxes** → **Add a shared mailbox**.
2. Visningsnavn: `Masjid Rahma nettside`. E-postadresse: `webside@centerrahma.no`.
3. Lagre. Det kan ta noen minutter før postkassen er klar.

Kopier av alt nettsiden sender havner i **Sent Items** i denne postkassen. Gi gjerne styret tilgang til den (**Delegation** → **Read and manage**), så kan dere se hva som er sendt.

## 2. Registrer appen i Entra

1. Gå til <https://entra.microsoft.com> → **Identity** → **Applications** → **App registrations** → **New registration**.
2. Name: `Nettside skjema`.
3. Supported account types: **Accounts in this organizational directory only (Single tenant)**.
4. Redirect URI: la stå tomt. Trykk **Register**.
5. På siden **Overview**, noter:
   - **Application (client) ID** → blir `MS_CLIENT_ID`
   - **Directory (tenant) ID** → blir `MS_TENANT_ID` (for Center Rahma skal det være `4221da62-cb11-4407-bb9f-d4038ee63110`)

## 3. Lag en apphemmelighet

1. I appen: **Certificates & secrets** → **Client secrets** → **New client secret**.
2. Description: `Vercel`. Expires: **24 months**.
3. Kopier **Value** med en gang. Den vises bare én gang. (Ikke **Secret ID**.) Dette blir `MS_CLIENT_SECRET`.
4. Legg inn en påminnelse i kalenderen en måned før den utløper. Når hemmeligheten utløper slutter skjemaet å sende. Da lager du en ny her og bytter verdien i Vercel.

Hemmeligheten er et passord. Ikke send den på e-post eller chat. Lim den rett inn i Vercel (steg 5), eller gi den til den som gjør det, på en trygg måte.

## 4. Gi appen lov til å sende, men bare som webside@

Vi bruker **RBAC for Applications** i Exchange Online. Da kan appen sende *kun* som `webside@centerrahma.no` og ikke som noen annen postkasse i organisasjonen.

**Ikke** legg til `Mail.Send` under **API permissions** i Entra. Den tillatelsen gjelder alle postkasser og ville overstyre begrensningen.

1. Finn appens **Object ID** under **Enterprise applications** (ikke under App registrations, der er det en annen ID): <https://entra.microsoft.com> → **Identity** → **Applications** → **Enterprise applications** → `Nettside skjema` → **Overview** → **Object ID**.
2. Åpne PowerShell og koble til Exchange Online:

   ```powershell
   Install-Module ExchangeOnlineManagement -Scope CurrentUser
   Connect-ExchangeOnline
   ```

3. Kjør disse, med dine verdier i stedet for `<…>`:

   ```powershell
   # Gjør appen kjent for Exchange
   New-ServicePrincipal -AppId <Application (client) ID> -ObjectId <Object ID fra Enterprise applications> -DisplayName "Nettside skjema"

   # Et omfang som bare inneholder webside-postkassen
   New-ManagementScope -Name "Kun webside-postkassen" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'webside@centerrahma.no'"

   # Gi appen Mail.Send innenfor det omfanget
   New-ManagementRoleAssignment -App <Application (client) ID> -Role "Application Mail.Send" -CustomResourceScope "Kun webside-postkassen"
   ```

4. Sjekk at det virker:

   ```powershell
   Test-ServicePrincipalAuthorization -Identity <Application (client) ID> -Resource webside@centerrahma.no
   Test-ServicePrincipalAuthorization -Identity <Application (client) ID> -Resource post@centerrahma.no
   ```

   Den første skal vise `InScope : True` for `Application Mail.Send`, den andre `False`.

Microsoft sier endringen kan bruke fra 30 minutter til 2 timer før den virker overalt. Får skjemaet feil 403 rett etterpå, vent litt og prøv igjen.

### Hvis PowerShell ikke er et alternativ

Det enklere alternativet er Entra: **API permissions** → **Add a permission** → **Microsoft Graph** → **Application permissions** → `Mail.Send` → **Add permissions** → **Grant admin consent for CENTER RAHMA**. Det virker, men da kan appen sende som *hvilken som helst* postkasse i organisasjonen hvis hemmeligheten kommer på avveie. Bruk det bare midlertidig, og bytt til steg 4 når dere kan.

## 5. Legg verdiene inn i Vercel

Vercel → prosjektet → **Settings** → **Environment Variables**. Legg inn for **Production**:

| Navn | Verdi |
|---|---|
| `MS_TENANT_ID` | Directory (tenant) ID fra steg 2 |
| `MS_CLIENT_ID` | Application (client) ID fra steg 2 |
| `MS_CLIENT_SECRET` | Value fra steg 3. Huk av **Sensitive**. |
| `MS_SENDER` | `webside@centerrahma.no` |
| `CONTACT_EMAIL_TO` | Valgfri. Står den tom, går skjemaene til `post@centerrahma.no`. |

Deretter: **Deployments** → siste produksjonsdeploy → **⋯** → **Redeploy**. Nye variabler tas først i bruk etter en ny deploy.

## 6. Test

1. Send en melding gjennom kontaktskjemaet på centerrahma.no.
2. Den skal komme til `post@centerrahma.no` fra «Masjid Rahma», og **Svar** skal gå til den som skrev.
3. Den skal også ligge i **Sent Items** i `webside@centerrahma.no`.

Når dette virker, slett `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST` og `SMTP_PORT` i Vercel hvis de finnes. De brukes ikke lenger.

## Feilsøking

Får skjemaet en feilmelding, står årsaken i Vercel → **Logs** (søk etter `Contact form error`).

| I loggen | Betyr |
|---|---|
| `Missing environment variables for Microsoft Graph mail: …` | En av variablene i steg 5 mangler, eller det er ikke deployet på nytt. |
| `token request failed (401)` med `AADSTS7000215` | Feil hemmelighet. Kanskje Secret ID ble kopiert i stedet for Value. |
| `token request failed` med `AADSTS7000222` | Hemmeligheten har utløpt. Lag en ny (steg 3). |
| `token request failed` med `AADSTS700016` | Feil `MS_CLIENT_ID`, eller appen er i en annen tenant. |
| `sendMail failed (403)` med `ErrorAccessDenied` | Appen har ikke lov til å sende som `MS_SENDER`. Sjekk steg 4, eller vent til endringen har slått gjennom. |
| `sendMail failed (404)` | `MS_SENDER` finnes ikke som postkasse. Sjekk stavingen og steg 1. |
