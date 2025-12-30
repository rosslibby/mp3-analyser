import { describe, it, expect } from "vitest";
import { BITRATES } from "./constants";
import { findTotalId3Size, isId3, isValidHeader } from "./utils";

describe("MP3 analysis utilities", () => {
  it("should correctly identify an ID3 tag", () => {
    const buffer = Buffer.from([0x49, 0x44, 0x33, 0x03, 0x00]); // "ID3"
    expect(isId3(buffer, 0)).toBe(true);
  });

  it("should correctly calculate synchsafe ID3 size", () => {
    // Header + 4 bytes of size (00 00 02 01 in synchsafe)
    // (0 << 21) | (0 << 14) | (2 << 7) | 1 = 257 bytes
    // Total should be 257 + 10 = 267
    const buffer = Buffer.alloc(10);
    buffer.set([0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01]);
    expect(findTotalId3Size(buffer)).toBe(267);
  });

  it("should validate headers correctly", () => {
    expect(isValidHeader(1, 0)).toBe(true); // 32kbps, 44.1kHz
    expect(isValidHeader(15, 0)).toBe(false); // Index 15 is forbidden
    expect(isValidHeader(1, 3)).toBe(false); // Index 3 is reserved
  });

  it("should map bitrate indices to correct values", () => {
    expect(BITRATES[1]).toBe(32);
    expect(BITRATES[14]).toBe(320);
  });
});
