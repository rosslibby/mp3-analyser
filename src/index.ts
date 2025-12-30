import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { fileUpload } from './file-upload';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

const app = express();
app.use(cors());
app.set('json spaces', 2);

app.post('/file-upload', fileUpload);

app.listen(PORT, () => {
  const url = new URL(`${HOST}:${PORT}`);
  console.log(`🚀 Server listening at ${url.href}`);
});
