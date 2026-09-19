import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidFodselsnummer } from './fodselsnummer.ts';

// Synthetic numbers with correct mod-11 control digits (not real people).
test('accepts a valid fødselsnummer', () => {
  assert.equal(isValidFodselsnummer('01019012480'), true);
  assert.equal(isValidFodselsnummer('15068550030'), true);
});

test('accepts a valid D-nummer (day + 40)', () => {
  assert.equal(isValidFodselsnummer('41019012393'), true);
  assert.equal(isValidFodselsnummer('45068550053'), true);
});

test('rejects wrong control digits', () => {
  assert.equal(isValidFodselsnummer('01019012481'), false);
  assert.equal(isValidFodselsnummer('01019012470'), false);
});

test('rejects wrong length or non-digits', () => {
  assert.equal(isValidFodselsnummer('0101901248'), false);
  assert.equal(isValidFodselsnummer('010190124800'), false);
  assert.equal(isValidFodselsnummer('01019012 480'), false);
  assert.equal(isValidFodselsnummer('0101901248a'), false);
  assert.equal(isValidFodselsnummer(''), false);
});

test('rejects all zeros (checksum passes, but 00.00 is not a date)', () => {
  assert.equal(isValidFodselsnummer('00000000000'), false);
});

test('rejects an impossible day or month even when the checksum passes', () => {
  // 32.01 — day out of range; control digits computed to be valid
  assert.equal(isValidFodselsnummer('32019012351'), false);
  // 01.13 — month out of range
  assert.equal(isValidFodselsnummer('01139012409'), false);
});
