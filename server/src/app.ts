import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';

import authRoutes from './routes/authRoutes';
import photoRoutes from './routes/photoRoutes';
import memberRoutes from './routes/memberRoutes';
import qomraWeekRoutes from './routes/qomraWeekRoutes';
import eventRoutes from './routes/eventRoutes';
import serviceRoutes from './routes/serviceRoutes';
import articleRoutes from './routes/articleRoutes';
import contactRoutes from './routes/contactRoutes';
import settingsRoutes from './routes/settingsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import galleryItemRoutes from './routes/galleryItemRoutes';
import homepageRoutes from './routes/homepageRoutes';
import alumniRoutes from './routes/alumniRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import partnerRoutes from './routes/partnerRoutes';
import titleRoutes from './routes/titleRoutes';
import randomPhotosRoutes from './routes/randomPhotosRoutes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.nodeEnv === 'production'
    ? [env.clientUrl, /\.vercel\.app$/]
    : env.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/photos', photoRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/qomra-week', qomraWeekRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/admin/stats', statsRoutes);
app.use('/api/v1/gallery-items', galleryItemRoutes);
app.use('/api/v1/homepage', homepageRoutes);
app.use('/api/v1/alumni', alumniRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/titles', titleRoutes);
app.use('/api/v1/random-photos', randomPhotosRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Graceful DB-error handler — GET requests get empty results, others get 503
app.use((err: Error & { name?: string }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const isDbError =
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoTimeoutError' ||
    err.message?.includes('buffering timed out') ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('topology was destroyed');

  if (isDbError) {
    console.error('DB unavailable:', err.message);
    if (req.method === 'GET') {
      // Return safe empty data for read requests
      if (req.path.includes('/upcoming') || req.path.includes('list')) {
        res.json([]);
        return;
      }
      res.json(req.path.match(/\/[a-f0-9]{24}$|\/admin\//) ? {} : { data: [], total: 0, page: 1, totalPages: 0 });
      return;
    }
    res.status(503).json({ message: 'Service temporarily unavailable' });
    return;
  }

  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;
