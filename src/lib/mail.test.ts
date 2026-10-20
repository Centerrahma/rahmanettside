import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { sendContactEmail, sendMembershipEmail, resetTokenCache } from './mail.ts';

// Fake values only; no request leaves the process because fetch is stubbed.
const ENV = {
  MS_TENANT_ID: 'tenant-123',
  MS_CLIENT_ID: 'client-456',
  MS_CLIENT_SECRET: 'not-a-real-secret',
  MS_SENDER: 'webside@centerrahma.no',
};

type Call = { url: string; init: RequestInit };
let calls: Call[];
let responses: Array<() => Response>;
const realFetch = globalThis.fetch;
const savedEnv = { ...process.env };

function tokenResponse(expiresIn = 3599) {
  return () =>
    new Response(JSON.stringify({ access_token: 'tok-abc', expires_in: expiresIn }), { status: 200 });
}
const accepted = () => new Response(null, { status: 202 });

const contact = { name: 'Ali', email: 'ali@example.com', topic: 'Besøk', message: 'Hei!' };

beforeEach(() => {
  resetTokenCache();
  calls = [];
  responses = [];
  Object.assign(process.env, ENV);
  delete process.env.CONTACT_EMAIL_TO;
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    const next = responses.shift();
    if (!next) throw new Error(`unexpected fetch to ${url}`);
    return next();
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...savedEnv };
});

test('gets an app token with client credentials, then sends as the configured mailbox', async () => {
  responses.push(tokenResponse(), accepted);
  await sendContactEmail(contact);

  assert.equal(calls.length, 2);
  const [token, send] = calls;

  assert.equal(token.url, 'https://login.microsoftonline.com/tenant-123/oauth2/v2.0/token');
  const form = new URLSearchParams(String(token.init.body));
  assert.equal(form.get('grant_type'), 'client_credentials');
  assert.equal(form.get('client_id'), 'client-456');
  assert.equal(form.get('client_secret'), 'not-a-real-secret');
  assert.equal(form.get('scope'), 'https://graph.microsoft.com/.default');

  assert.equal(send.url, 'https://graph.microsoft.com/v1.0/users/webside%40centerrahma.no/sendMail');
  assert.equal(send.init.method, 'POST');
  assert.equal((send.init.headers as Record<string, string>).Authorization, 'Bearer tok-abc');
  const { message } = JSON.parse(String(send.init.body));
  assert.equal(message.subject, 'Contact: Besøk - from Ali');
  assert.deepEqual(message.from, { emailAddress: { name: 'Masjid Rahma', address: 'webside@centerrahma.no' } });
  assert.deepEqual(message.toRecipients, [{ emailAddress: { address: 'post@centerrahma.no' } }]);
  assert.deepEqual(message.replyTo, [{ emailAddress: { address: 'ali@example.com' } }]);
  assert.equal(message.body.contentType, 'Text');
  assert.match(message.body.content, /Message:\nHei!/);
});

test('delivers to CONTACT_EMAIL_TO when set', async () => {
  process.env.CONTACT_EMAIL_TO = 'styret@centerrahma.no';
  responses.push(tokenResponse(), accepted);
  await sendMembershipEmail({
    fullName: 'Ali Test',
    address: 'Gate 1',
    postalCode: '0001',
    city: 'Oslo',
    phone: '12345678',
    email: 'ali@example.com',
    fodselsnummer: '01019012480',
  });
  const { message } = JSON.parse(String(calls[1].init.body));
  assert.deepEqual(message.toRecipients, [{ emailAddress: { address: 'styret@centerrahma.no' } }]);
  assert.equal(message.subject, 'New Membership Application - Ali Test');
});

test('reuses the token until it is about to expire', async () => {
  responses.push(tokenResponse(), accepted, accepted);
  await sendContactEmail(contact);
  await sendContactEmail(contact);
  assert.equal(calls.filter((c) => c.url.includes('/oauth2/')).length, 1);
});

test('fetches a new token once the cached one is within a minute of expiry', async () => {
  responses.push(tokenResponse(30), accepted, tokenResponse(), accepted);
  await sendContactEmail(contact);
  await sendContactEmail(contact);
  assert.equal(calls.filter((c) => c.url.includes('/oauth2/')).length, 2);
});

test('concurrent sends share one token request', async () => {
  responses.push(tokenResponse(), accepted, accepted);
  await Promise.all([sendContactEmail(contact), sendContactEmail(contact)]);
  assert.equal(calls.filter((c) => c.url.includes('/oauth2/')).length, 1);
});

test('throws when Graph does not accept the message, so the route returns 500', async () => {
  responses.push(tokenResponse(), () => new Response('{"error":{"code":"ErrorAccessDenied"}}', { status: 403 }));
  await assert.rejects(sendContactEmail(contact), /sendMail failed \(403\).*ErrorAccessDenied/);
});

test('drops the cached token after a 401 so the next send signs in again', async () => {
  responses.push(tokenResponse(), () => new Response('', { status: 401 }), tokenResponse(), accepted);
  await assert.rejects(sendContactEmail(contact), /401/);
  await sendContactEmail(contact);
  assert.equal(calls.filter((c) => c.url.includes('/oauth2/')).length, 2);
});

test('throws when the token request fails', async () => {
  responses.push(() => new Response('{"error":"invalid_client"}', { status: 401 }));
  await assert.rejects(sendContactEmail(contact), /token request failed \(401\).*invalid_client/);
  assert.equal(calls.length, 1);
});

test('names every missing env var and sends nothing', async () => {
  delete process.env.MS_CLIENT_SECRET;
  delete process.env.MS_SENDER;
  await assert.rejects(sendContactEmail(contact), /MS_CLIENT_SECRET, MS_SENDER/);
  assert.equal(calls.length, 0);
});
