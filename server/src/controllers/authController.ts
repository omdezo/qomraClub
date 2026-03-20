import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const signToken = (id: string): string => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const user = await AdminUser.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken(user._id.toString());
  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await AdminUser.findById(req.user?.id).select('-passwordHash');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const user = await AdminUser.findById(req.user?.id);

  if (!user || !(await user.comparePassword(currentPassword))) {
    res.status(400).json({ message: 'Current password is incorrect' });
    return;
  }

  user.passwordHash = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
};
