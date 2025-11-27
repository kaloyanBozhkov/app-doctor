import { Request, Response, NextFunction } from 'express';
import { env } from '@/helpers/env';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== env.X_API_KEY) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing X-API-KEY header',
    });
    return;
  }

  next();
};

