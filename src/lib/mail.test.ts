import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { sendContactEmail, sendMembershipEmail, setTokenProvider } from './mail.ts';

// No request leaves the process: fetch and the token source are both stubbed.
type Call = { url: string; init: RequestInit };
let calls: Call[];
let responses: Array<() => Response>;
const realFetch = globalThis.fetch;
const savedEnv = { ...process.env };
const accepted = () => new Response(null, { status: 202 });

const contact = { name: 'Ali', email: 'ali@example.com', topic: 'Besøk', message: 'Hei!' };

beforeEach(() => {
  calls = [];
  responses = [];
  delete process.env.CONTACT_MAIL_FROM;
  delete process.env.CONTACT_MAIL_TO;
  setTokenProvider(async () => 'tok-abc');
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    const next = responses.shift();
    if (!next) throw new Error(`unexpected fetch to ${url}`);
    return next();
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  setTokenProvider(null);
  process.env = { ...savedEnv };
});

test('sends as webside@ to post@ with the visitor as Reply-To', async () => {
  responses.push(accepted);
  await sendContactEmail(contact);

  assert.equal(calls.length, 1);
  const [send] = calls;
  assert.equal(send.url, 'https://graph.microsoft.com/v1.0/users/webside%40centerrahma.no/sendMail');
  assert.equal(send.init.method, 'POST');
  assert.equal((send.init.headers as Record<string, string>).Authorization, 'Bearer tok-abc');
  const { message } = JSON.parse(String(send.init.body));
  assert.equal(message.subject, 'Contact: Besøk - from Ali');
  assert.deepEqual(message.from, { emailAddress: { name: 'Masjid Rahma', address: 'webside@centerrahma.no' } });
  assert.deepEqual(message.toRecipients, [{ emailAddress: { address: 'post@centerrahma.no' } }]);
  assert.deepEqual(message.replyTo, [{ emailAddress: { address: 'ali@example.com', name: 'Ali' } }]);
  assert.equal(message.body.contentType, 'Text');
  assert.match(message.body.content, /Message:\nHei!/);
});

test('delivers to CONTACT_MAIL_TO when set', async () => {
  process.env.CONTACT_MAIL_TO = 'styret@centerrahma.no';
  responses.push(accepted);
  await sendMembershipEmail({
    fullName: 'Ali Test',
    address: 'Gate 1',
    postalCode: '0001',
    city: 'Oslo',
    phone: '12345678',
    email: 'ali@example.com',
    fodselsnummer: '01019012480',
  });
  const { message } = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(message.toRecipients, [{ emailAddress: { address: 'styret@centerrahma.no' } }]);
  assert.equal(message.subject, 'New Membership Application - Ali Test');
});

test('line breaks in the visitor name cannot split the subject or Reply-To name', async () => {
  responses.push(accepted);
  await sendContactEmail({ ...contact, name: 'Ali\r\nBcc: x@evil.test' });
  const { message } = JSON.parse(String(calls[0].init.body));
  assert.doesNotMatch(message.subject, /[\r\n]/);
  assert.doesNotMatch(message.replyTo[0].emailAddress.name, /[\r\n]/);
});

test('throws when Graph does not accept the message, so the route returns 500', async () => {
  responses.push(() => new Response('{"error":{"code":"ErrorAccessDenied"}}', { status: 403 }));
  await assert.rejects(sendContactEmail(contact), /sendMail failed \(403\).*ErrorAccessDenied/);
});

test('sends nothing when the token cannot be obtained', async () => {
  setTokenProvider(async () => {
    throw new Error('oidc token unavailable');
  });
  await assert.rejects(sendContactEmail(contact), /oidc token unavailable/);
  assert.equal(calls.length, 0);
});

test('names every missing env var and sends nothing', async () => {
  setTokenProvider(null);
  delete process.env.AZURE_TENANT_ID;
  delete process.env.AZURE_CLIENT_ID;
  await assert.rejects(sendContactEmail(contact), /AZURE_TENANT_ID, AZURE_CLIENT_ID/);
  assert.equal(calls.length, 0);
});
