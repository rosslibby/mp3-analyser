import { Readable } from 'node:stream';
import { BITRATES, SAMPLERATES } from './constants';
import { findTotalId3Size, isId3, isSync, isValidHeader } from './utils';

export async function analyzeMP3(stream: Readable): Promise<number> {
  let buffer = Buffer.alloc(0);
  let cursor = 0;
  let frames = 0;
  let hasSkippedId3 = false;

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);

    // Handle ID3 tag
    if (!hasSkippedId3 && buffer.length >= 10) {
      // if (buffer.toString('utf8', 0, 3) === 'ID3') {
      if (isId3(buffer, 0)) {
        const totalId3Size = findTotalId3Size(buffer, 0);

        // If tag data is incomplete, wait for more data
        if (buffer.length < totalId3Size) continue;

        buffer = buffer.subarray(totalId3Size);
      }
      hasSkippedId3 = true;
    }

    while (cursor <= buffer.length - 8) {
      if (isSync(buffer, cursor)) {
        const bitrateIndex = (buffer[cursor + 2] & 0xF0) >> 4;
        const samplerateIndex = (buffer[cursor + 2] & 0x0C) >> 2;
        const padding = (buffer[cursor + 2] & 0x02) >> 1;

        if (isValidHeader(bitrateIndex, samplerateIndex)) {
          const bitrate = BITRATES[bitrateIndex] * 1000;
          const samplerate = SAMPLERATES[samplerateIndex];
          const frameSize = Math.floor((144 * bitrate) / samplerate) + padding;

          const nextSyncPosition = cursor + frameSize;

          // Verify that next frame exists AND has sync bits
          if (nextSyncPosition + 1 < buffer.length) {
            if (isSync(buffer, nextSyncPosition)) {
              frames++;
              cursor += frameSize;
              continue;
            }
          } else {
            // Identified potential frame but can't see next sync
            // Break loop & wait for more data
            break;
          }
        }
      }
      cursor++;
    }

    // Update buffer to retain only unprocessed bytes
    buffer = buffer.subarray(cursor)
    cursor = 0;
  }

  return frames;
}
