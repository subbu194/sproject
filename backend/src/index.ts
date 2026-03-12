import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db';
import { initializeR2 } from './config/r2';

// Route imports
import authRoutes from './routes/auth.routes';
import storyRoutes from './routes/story.routes';
import dailyLogRoutes from './routes/dailyLog.routes';
import thoughtsRoutes from './routes/thoughts.routes';
import pressRoutes from './routes/press.routes';
import achievementsRoutes from './routes/achievements.routes';
import connectRoutes from './routes/connect.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

// CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || '', 'http://localhost:5173'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API running 🚀' });
});

// Mount all routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/story', storyRoutes);
app.use('/api/v1/log', dailyLogRoutes);
app.use('/api/v1/thoughts', thoughtsRoutes);
app.use('/api/v1/press', pressRoutes);
app.use('/api/v1/achievements', achievementsRoutes);
app.use('/api/v1/connect', connectRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack || err);
  const status = err.status || 500;
  // Prevent leaking internal error details on 500s
  const message = status === 500 ? 'Internal server error' : (err.message || 'Internal server error');
  res.status(status).json({
    success: false,
    error: message,
  });
});

// Bootstrap
async function bootstrap() {
  await connectDatabase();
  await initializeR2();

  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

bootstrap();
