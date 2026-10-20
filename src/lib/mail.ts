// Sends through Microsoft Graph as the mosque's own Microsoft 365 mailbox.
// centerrahma.no is hosted there, and its SPF record only lets Microsoft send
// for the domain. The app signs in with its own client secret
// (client-credentials flow), so no mailbox password is stored anywhere.
// Setup for the Entra app: docs/microsoft-graph-mail.md.

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
// Fail fast instead of hanging the serverless function on a dead connection.
const REQUEST_TIMEOUT_MS = 10_000;
// Renew a minute early so a token never expires mid-request.
const EXPIRY_MARGIN_MS = 60_000;

type GraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  sender: string;
};

function getConfig(): GraphConfig {
  const vars = {
    MS_TENANT_ID: process.env.MS_TENANT_ID,
    MS_CLIENT_ID: process.env.MS_CLIENT_ID,
    MS_CLIENT_SECRET: process.env.MS_CLIENT_SECRET,
    MS_SENDER: process.env.MS_SENDER,
  };
  const missing = Object.keys(vars).filter((name) => !vars[name as keyof typeof vars]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables for Microsoft Graph mail: ${missing.join(', ')}`);
  }
  return {
    tenantId: vars.MS_TENANT_ID!,
    clientId: vars.MS_CLIENT_ID!,
    clientSecret: vars.MS_CLIENT_SECRET!,
    sender: vars.MS_SENDER!,
  };
}

// The token lives as long as the warm serverless instance, so most form
// submissions skip the token round trip.
let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

/** Forgets the cached access token. Only tests need this. */
export function resetTokenCache() {
  cachedToken = null;
  pendingToken = null;
}

async function fetchToken(config: GraphConfig): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: 'https://graph.microsoft.com/.default',
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }
  );
  // The error body names the problem (e.g. AADSTS7000215 for a wrong secret)
  // and never echoes the secret, so it is safe to log.
  if (!res.ok) {
    throw new Error(`Microsoft token request failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error('Microsoft token response had no access_token');
  }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 0) * 1000 - EXPIRY_MARGIN_MS,
  };
  return data.access_token;
}

function getAccessToken(config: GraphConfig): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return Promise.resolve(cachedToken.value);
  }
  // Concurrent submissions share one token request.
  pendingToken ??= fetchToken(config).finally(() => {
    pendingToken = null;
  });
  return pendingToken;
}

async function sendMail(message: { to: string; replyTo: string; subject: string; text: string }) {
  const config = getConfig();
  const token = await getAccessToken(config);

  const res = await fetch(`${GRAPH_BASE}/users/${encodeURIComponent(config.sender)}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject: message.subject,
        body: { contentType: 'Text', content: message.text },
        from: { emailAddress: { name: 'Masjid Rahma', address: config.sender } },
        toRecipients: [{ emailAddress: { address: message.to } }],
        replyTo: [{ emailAddress: { address: message.replyTo } }],
      },
      // Keeps a copy in the sending mailbox's Sent Items as a log.
      saveToSentItems: true,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  // Graph answers 202 Accepted. Anything else throws, so the API route returns
  // 500 instead of reporting success for an email that never left.
  if (res.status !== 202) {
    if (res.status === 401) cachedToken = null;
    throw new Error(`Microsoft Graph sendMail failed (${res.status}): ${await res.text()}`);
  }
}

function recipient(): string {
  return process.env.CONTACT_EMAIL_TO || 'post@centerrahma.no';
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  return sendMail({
    to: recipient(),
    replyTo: data.email,
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
    to: recipient(),
    replyTo: data.email,
    subject: `New Membership Application - ${data.fullName}`,
    text: `New Membership Application\n\nFull Name: ${data.fullName}\nAddress: ${data.address}\nPostal Code: ${data.postalCode}\nCity: ${data.city}\nPhone: ${data.phone}\nEmail: ${data.email}\nFødselsnummer: ${data.fodselsnummer}\n\nSubmitted via the website membership form.`,
  });
}

export async function addToNewsletter(email: string) {
  // No mailing-list provider is connected yet - for now just log.
  console.log('Newsletter signup:', email);
}
