import { Request, Response, NextFunction } from 'express';
import { env } from '@/helpers/env';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const xApiKey = req.headers['x-api-key'];
  const upstashLabel = req.headers['upstash-label'];
  
  const apiKey = xApiKey || upstashLabel;
  if (!apiKey || apiKey !== env.X_API_KEY) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid/missing API key',
    });
    return;
  }

  next();
};

