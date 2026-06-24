import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Missing API Key' });
  }

  const expectedApiKey = process.env.ECOMMERCE_API_KEY;

  if (!expectedApiKey) {
    console.warn('WARNING: ECOMMERCE_API_KEY is not defined in environment variables.');
    // In production, we might want to fail hard here. For now, we will return 500 or just let it pass if dev.
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }

  next();
};
