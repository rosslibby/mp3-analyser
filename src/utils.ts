export function isId3(
  buffer: Buffer,
  cursor: number,
): boolean {
  if (buffer.length < cursor + 3) return false;

  const magicNumber =
    buffer[cursor] === 0x49 &&
    buffer[cursor + 1] === 0x44 &&
    buffer[cursor + 2] === 0x33;

  return magicNumber;
}

export function findTotalId3Size(
  buffer: Buffer,
  offset: number = 0,
): number {
  // Require 10 bytes for header
  if (buffer.length < offset + 10) return 0;

  // offset enables checking the ID3 tag anywhere in the buffer
  const byte1 = buffer[offset + 6];
  const byte2 = buffer[offset + 7];
  const byte3 = buffer[offset + 8];
  const byte4 = buffer[offset + 9];

  const size = byte1 << 21 | byte2 << 14 | byte3 << 7 | byte4;

  // header size excludes the 10-byte header itself
  return size + 10;
}
