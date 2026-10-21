// Sends through Microsoft Graph as the mosque's own Microsoft 365 mailbox.
// centerrahma.no is hosted there, and its SPF record only lets Microsoft send
// for the domain. No secret is stored: the Entra app trusts Vercel's OIDC
// token for the production deployment (federated credential), and Exchange
// RBAC limits the app to sending as webside@centerrahma.no only.
// The federated credential covers Production only, so Preview and local
// sends fail by design. Setup: docs/microsoft-graph-mail.md.
import { ClientAssertionCredential } from '@azure/identity';
import { getVercelOidcToken } from '@vercel/oidc';

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
// Fail fast instead of hanging the serverless function on a dead connection.
const REQUEST_TIMEOUT_MS = 10_000;
// Sender and recipient are fixed on the server; nothing in a request picks them.
const DEFAULT_SENDER = 'webside@centerrahma.no';
const DEFAULT_RECIPIENT = 'post@centerrahma.no';

type TokenProvider = () => Promise<string>;

let credential: ClientAssertionCredential | null = null;

async function graphToken(): Promise<string> {
  if (!credential) {
    const { AZURE_TENANT_ID, AZURE_CLIENT_ID } = process.env;
    const missing = [
      !AZURE_TENANT_ID && 'AZURE_TENANT_ID',
      !AZURE_CLIENT_ID && 'AZURE_CLIENT_ID',
    ].filter(Boolean);
    if (missing.length > 0) {
      throw new Error(`Missing environment variables for Microsoft Graph mail: ${missing.join(', ')}`);
    }
    credential = new ClientAssertionCredential(AZURE_TENANT_ID!, AZURE_CLIENT_ID!, () =>
      getVercelOidcToken(),
    );
  }
  // The credential caches and renews the Graph token itself.
  const { token } = await credential.getToken(GRAPH_SCOPE);
  return token;
}

let getToken: TokenProvider = graphToken;

/** Test hook: swap the token source (null restores the real one). */
export function setTokenProvider(provider: TokenProvider | null) {
  getToken = provider ?? graphToken;
  credential = null;
}

// Subject and display names end up in headers; strip line breaks.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

async function sendMail(message: { replyTo: string; replyToName: string; subject: string; text: string }) {
  const sender = process.env.CONTACT_MAIL_FROM || DEFAULT_SENDER;
  const to = process.env.CONTACT_MAIL_TO || DEFAULT_RECIPIENT;
  const token = await getToken();

  const res = await fetch(`${GRAPH_BASE}/users/${encodeURIComponent(sender)}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject: oneLine(message.subject),
        body: { contentType: 'Text', content: message.text },
        from: { emailAddress: { name: 'Masjid Rahma', address: sender } },
        toRecipients: [{ emailAddress: { address: to } }],
        replyTo: [{ emailAddress: { address: message.replyTo, name: oneLine(message.replyToName) } }],
      },
      // Keeps a copy in the sending mailbox's Sent Items as a log.
      saveToSentItems: true,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  // Graph answers 202 Accepted. Anything else throws, so the API route returns
  // 500 instead of reporting success for an email that never left.
  if (res.status !== 202) {
    throw new Error(`Microsoft Graph sendMail failed (${res.status}): ${await res.text()}`);
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  return sendMail({
    replyTo: data.email,
    replyToName: data.name,
    subject: `Contact: ${data.topic} - from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nTopic: ${data.topic}\n\nMessage:\n${data.message}`,
  });
}

export async function sendMembershipEmail(data: {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  fodselsnummer: string;
}) {
  return sendMail({
    replyTo: data.email,
    replyToName: data.fullName,
    subject: `New Membership Application - ${data.fullName}`,
    text: `New Membership Application\n\nFull Name: ${data.fullName}\nAddress: ${data.address}\nPostal Code: ${data.postalCode}\nCity: ${data.city}\nPhone: ${data.phone}\nEmail: ${data.email}\nFødselsnummer: ${data.fodselsnummer}\n\nSubmitted via the website membership form.`,
  });
}

export async function addToNewsletter(email: string) {
  // No mailing-list provider is connected yet - for now just log.
  console.log('Newsletter signup:', email);
}
