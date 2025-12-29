import express from 'express';
import cors from 'cors';
import Busboy from 'busboy';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

const app = express();
app.use(cors());
app.set('json spaces', 2);

app.post('/file-upload', async (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, info) => {});
});

app.listen(PORT, () => {
  const url = new URL(`${HOST}:${PORT}`);
  console.log(`🚀 Server listening at ${url.href}`);
});
