import { test, after } from 'node:test';
import assert from 'node:assert/strict';

const originalFetch = globalThis.fetch;
const originalUrl = process.env.MYMASJID_API_URL;
const originalId = process.env.MYMASJID_MOSQUE_ID;
process.env.MYMASJID_API_URL = 'https://prayers.example.test';
process.env.MYMASJID_MOSQUE_ID = 'test-mosque';
const { fetchPrayerTimes } = await import('./mymasjid.ts');
after(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.MYMASJID_API_URL;
  else process.env.MYMASJID_API_URL = originalUrl;
  if (originalId === undefined) delete process.env.MYMASJID_MOSQUE_ID;
  else process.env.MYMASJID_MOSQUE_ID = originalId;
});

const timing = (day: number, month: number, fajr = ' 06:51\n') => ({
  day, month, fajr, zuhr: '12:12', asr: '14:22', maghrib: '16:45', isha: '18:15',
  iqamah_Fajr: '07:01', iqamah_Zuhr: '14:00', iqamah_Asr: '14:32',
  iqamah_Maghrib: '16:45', iqamah_Isha: '18:25',
});
const response = (timings: ReturnType<typeof timing>[]) => ({
  hasError: false, model: { salahTimings: timings,
    jumahSalahIqamahTimings: [{ time: '13:00', iqamahTime: '13:20', isPrimary: true }] },
});

test('upstream failures are rejected instead of returning sample prayer times', async () => {
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(fetchPrayerTimes(), /503/);
});

test('API error payloads are rejected', async () => {
  globalThis.fetch = async () => Response.json({ hasError: true });
  await assert.rejects(fetchPrayerTimes(), /hasError/);
});

test('missing today is rejected instead of relabelling January times as today', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-25T12:00:00Z') });
  globalThis.fetch = async () => Response.json(response([timing(1, 1)]));
  await assert.rejects(fetchPrayerTimes(), /2026-10-25/);
});

test('tomorrow means the next Oslo calendar day on the 25-hour clock-change night', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-24T22:30:00Z') });
  globalThis.fetch = async () => Response.json(response([timing(25, 10), timing(26, 10, '05:53')]));
  const schedule = await fetchPrayerTimes();
  assert.equal(schedule.date, '2026-10-25');
  assert.equal(schedule.prayers.fajr.time, '06:51');
  assert.equal(schedule.tomorrowFajr, '05:53');
});

test('missing configuration fails explicitly', async () => {
  delete process.env.MYMASJID_API_URL;
  delete process.env.MYMASJID_MOSQUE_ID;
  await assert.rejects(fetchPrayerTimes(), /not configured/);
});
