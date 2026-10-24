// Signs in to Microsoft Graph as one of the site's Entra apps. No secret is
// stored: each app trusts Vercel's OIDC token for the production deployment
// (federated credential), so Preview and local runs cannot get a token.
// Setup: docs/microsoft-graph-mail.md and docs/sharepoint-arrangementer.md.
import { ClientAssertionCredential } from '@azure/identity';
import { getVercelOidcToken } from '@vercel/oidc';

export const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
// Fail fast instead of hanging the serverless function on a dead connection.
export const REQUEST_TIMEOUT_MS = 10_000;

/** The env vars holding an app's tenant and client ID. */
export interface GraphApp { tenant: string; client: string }

/** Sends the contact and membership forms as webside@. */
export const MAIL_APP: GraphApp = { tenant: 'AZURE_TENANT_ID', client: 'AZURE_CLIENT_ID' };
/** Reads the SharePoint events list, nothing else. */
export const SHAREPOINT_APP: GraphApp = { tenant: 'SHAREPOINT_TENANT_ID', client: 'SHAREPOINT_CLIENT_ID' };

type TokenProvider = (app: GraphApp) => Promise<string>;

const credentials = new Map<string, ClientAssertionCredential>();

async function graphToken(app: GraphApp): Promise<string> {
  const tenantId = process.env[app.tenant];
  const clientId = process.env[app.client];
  const missing = [!tenantId && app.tenant, !clientId && app.client].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables for Microsoft Graph: ${missing.join(', ')}`);
  }
  const key = `${tenantId}/${clientId}`;
  let credential = credentials.get(key);
  if (!credential) {
    credential = new ClientAssertionCredential(tenantId!, clientId!, () => getVercelOidcToken());
    credentials.set(key, credential);
  }
  // The credential caches and renews the Graph token itself.
  const { token } = await credential.getToken(GRAPH_SCOPE);
  return token;
}

let tokenProvider: TokenProvider = graphToken;

export const getGraphToken = (app: GraphApp) => tokenProvider(app);

/** Test hook: swap the token source (null restores the real one). */
export function setTokenProvider(provider: TokenProvider | null) {
  tokenProvider = provider ?? graphToken;
  credentials.clear();
}
