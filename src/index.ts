import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

const app = express();
app.use(cors());
app.set('json spaces', 2);

app.listen(PORT, () => {
  const url = new URL(`${HOST}:${PORT}`);
  console.log(`🚀 Server listening at ${url.href}`);
});
