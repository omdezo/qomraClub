import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminUser } from '../models/AdminUser';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };
    const user = await AdminUser.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized' });
  }
};
