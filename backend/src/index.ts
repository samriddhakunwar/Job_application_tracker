import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/application.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes are mounted under /api because on Vercel this service sits behind
// the "/api" route prefix, and requests arrive with that prefix included.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/applications', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
