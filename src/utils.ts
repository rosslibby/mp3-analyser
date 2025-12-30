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
