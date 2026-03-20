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

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
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

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;
