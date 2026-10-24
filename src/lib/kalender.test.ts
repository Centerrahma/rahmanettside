import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, byDay, mondayOf, osloDay, twoWeeks, weekday } from './kalender.ts';

test('osloDay reads the day in Oslo, not UTC', () => {
  assert.equal(osloDay('2026-10-24T22:30:00Z'), '2026-10-25'); // 00:30 Sunday in Oslo (summer time)
  assert.equal(osloDay('2026-12-31T23:30:00Z'), '2027-01-01'); // 00:30 in winter
  assert.equal(osloDay('2026-10-24T21:30:00Z'), '2026-10-24');
});

test('steps across the clock change without skipping or repeating a day', () => {
  assert.equal(addDays('2026-10-24', 1), '2026-10-25');
  assert.equal(addDays('2026-10-25', 1), '2026-10-26');
  assert.equal(addDays('2026-03-28', 2), '2026-03-30');
  assert.equal(addDays('2026-11-01', -1), '2026-10-31');
});

test('weeks start on Monday', () => {
  assert.equal(weekday('2026-10-26'), 0);
  assert.equal(weekday('2026-10-25'), 6);
  assert.equal(mondayOf('2026-10-25'), '2026-10-19');
  assert.equal(mondayOf('2026-10-26'), '2026-10-26');
});

test('twoWeeks runs from this Monday for fourteen days', () => {
  const days = twoWeeks('2026-10-24');
  assert.equal(days.length, 14);
  assert.equal(days[0], '2026-10-19');
  assert.equal(days[13], '2026-11-01');
});

test('byDay groups by the Oslo start day', () => {
  const g = byDay([{ start: '2026-10-24T19:30:00Z' }, { start: '2026-10-24T22:30:00Z' }, { start: '2026-10-24T09:00:00Z' }]);
  assert.deepEqual(Object.keys(g), ['2026-10-24', '2026-10-25']);
  assert.equal(g['2026-10-24'].length, 2);
});
