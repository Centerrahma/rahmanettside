// Signs in to Microsoft Graph as the site's Entra app. No secret is stored:
// the app trusts Vercel's OIDC token for the production deployment
// (federated credential), so Preview and local runs cannot get a token.
// Setup: docs/microsoft-graph-mail.md and docs/sharepoint-arrangementer.md.
import { ClientAssertionCredential } from '@azure/identity';
import { getVercelOidcToken } from '@vercel/oidc';

export const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
// Fail fast instead of hanging the serverless function on a dead connection.
export const REQUEST_TIMEOUT_MS = 10_000;

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
      throw new Error(`Missing environment variables for Microsoft Graph: ${missing.join(', ')}`);
    }
    credential = new ClientAssertionCredential(AZURE_TENANT_ID!, AZURE_CLIENT_ID!, () =>
      getVercelOidcToken(),
    );
  }
  // The credential caches and renews the Graph token itself.
  const { token } = await credential.getToken(GRAPH_SCOPE);
  return token;
}

let tokenProvider: TokenProvider = graphToken;

export const getGraphToken = () => tokenProvider();

/** Test hook: swap the token source (null restores the real one). */
export function setTokenProvider(provider: TokenProvider | null) {
  tokenProvider = provider ?? graphToken;
  credential = null;
}
