import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { apiKeyMiddleware } from '@/middleware/api-key';
import { errorHandler } from '@/middleware/error-handler';
import router from '@/router';
import { env } from './helpers/env';

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// API key middleware - applies to all routes except health check
app.use((req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }
  apiKeyMiddleware(req, res, next);
});

// Routes
app.use('/api', router);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'App Doctor API',
    endpoints: ['/api/health'],
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

export default app;

