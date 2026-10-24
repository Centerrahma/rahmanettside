import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { MAX_H, MAX_W, shrinkPicture } from './bilde.ts';

const jpeg = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: { r: 180, g: 120, b: 60 } } }).jpeg().toBuffer();
const stream = (buf: Buffer) => new Response(new Uint8Array(buf)).body!;

test('a large picture comes out as WebP inside the arch size, much smaller', async () => {
  const big = await jpeg(3015, 4187);
  const out = await shrinkPicture(stream(big));
  assert.ok(out);
  const meta = await sharp(out).metadata();
  assert.equal(meta.format, 'webp');
  assert.ok(meta.width! <= MAX_W && meta.height! <= MAX_H);
  assert.equal(meta.height, MAX_H); // portrait: height is the limit
});

test('a small picture is not blown up', async () => {
  const out = await shrinkPicture(stream(await jpeg(400, 300)));
  const meta = await sharp(out!).metadata();
  assert.deepEqual([meta.width, meta.height], [400, 300]);
});

test('a file over the size cap is refused without being decoded', async () => {
  assert.equal(await shrinkPicture(stream(await jpeg(800, 800)), 1000), null);
});
