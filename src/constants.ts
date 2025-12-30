export const BITRATES = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
] as const;

export const SAMPLERATES = [44100, 48000, 32000, 0] as const;

export const SUPPORTED_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "application/octet-stream",
];
