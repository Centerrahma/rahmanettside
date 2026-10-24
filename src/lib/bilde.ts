// Shrinks an event picture to the size the page shows it at. The arch is at most about 520×700 CSS
// pixels, so twice that covers sharp screens; anything larger only costs visitors time and data.
import sharp from 'sharp';

export const MAX_W = 1080;
export const MAX_H = 1440;
/** Pictures larger than this are refused rather than read into memory. */
export const MAX_BYTES = 25 * 1024 * 1024;

async function readCapped(body: ReadableStream<Uint8Array>, max: number): Promise<Buffer | null> {
  const chunks: Uint8Array[] = [];
  let size = 0;
  const reader = body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

/** WebP no larger than MAX_W × MAX_H, turned upright by its EXIF; null when the file is too big. */
export async function shrinkPicture(body: ReadableStream<Uint8Array>, max = MAX_BYTES): Promise<Buffer | null> {
  const input = await readCapped(body, max);
  if (!input) return null;
  return sharp(input, { limitInputPixels: 80_000_000 })
    .rotate()
    .resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}
