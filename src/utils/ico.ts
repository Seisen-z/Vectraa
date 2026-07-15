/**
 * ico.ts — Wraps PNG image bytes in a minimal single-image ICO container.
 * Modern ICO readers (Windows, browsers) accept PNG-encoded frames directly,
 * so no BMP re-encoding is needed.
 */

/** ICO stores 0 to mean 256px in its 1-byte width/height fields. */
function icoDimensionByte(px: number): number {
  return px >= 256 ? 0 : px;
}

export async function wrapPngAsIco(pngBlob: Blob, size: number): Promise<Blob> {
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
  const dim = icoDimensionByte(size);

  const header = new Uint8Array(6 + 16);
  const view = new DataView(header.buffer);
  view.setUint16(0, 0, true);  // reserved
  view.setUint16(2, 1, true);  // type = icon
  view.setUint16(4, 1, true);  // image count
  header[6] = dim;             // width
  header[7] = dim;             // height
  header[8] = 0;               // color count (0 = no palette)
  header[9] = 0;                // reserved
  view.setUint16(10, 1, true);  // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngBytes.byteLength, true); // size of image data
  view.setUint32(18, header.byteLength, true);   // offset to image data

  return new Blob([header, pngBytes], { type: 'image/x-icon' });
}
