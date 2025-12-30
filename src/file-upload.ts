import Busboy from 'busboy';
import type { Request, Response } from 'express';
import { SUPPORTED_MIME_TYPES } from './constants';
import { analyzeMP3 } from './mp3-analysis';

const isValidFile = (info: Busboy.FileInfo): boolean =>
  SUPPORTED_MIME_TYPES.includes(info.mimeType) ||
  info.filename.toLowerCase().endsWith('.mp3');

export async function fileUpload(req: Request, res: Response) {
  const busboy = Busboy({
    headers: req.headers,
    limits: { files: 1 },
  });

  let fileProcessed = false;

  busboy.on('file', (name, file, info) => {
    if (!isValidFile(info)) {
      file.resume();
      return res.status(400)
        .json({ error: 'Please upload a valid MP3 file' });
    }

    fileProcessed = true;

    analyzeMP3(file)
      .then((frameCount) => {
        if (frameCount === 0) {
          return res.status(422)
            .json({ error: 'No valid MP3 frames detected' });
        }
        res.set('Content-Type', 'application/json');
        res.status(200).json({ frameCount });
      })
      .catch((err) => {
        console.error('Processing error:', err);
        res.status(500).json({ error: 'Failed to parse MP3 frames' });
      });
  });

  busboy.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload error' })
  });

  busboy.on('finish', () => {
    if (!fileProcessed) {
      if (!res.headersSent) {
        res.status(400).json({ error: 'No file was uploaded' });
      }
    }
  });

  req.pipe(busboy);
}
