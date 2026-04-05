import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
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

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Support both bcrypt-hashed passwords and plain (for initial seed)
  const hashed = user.passwordHash.startsWith('$2');
  const matches = hashed
    ? await bcrypt.compare(password, user.passwordHash)
    : password === user.passwordHash;

  if (!matches) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.adminUser.findUnique({
    where: { id: req.user?.id },
    select: { id: true, username: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.adminUser.findUnique({ where: { id: req.user?.id } });

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  const hashed = user.passwordHash.startsWith('$2');
  const matches = hashed
    ? await bcrypt.compare(currentPassword, user.passwordHash)
    : currentPassword === user.passwordHash;

  if (!matches) {
    res.status(400).json({ message: 'Current password is incorrect' });
    return;
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });
  res.json({ message: 'Password updated' });
};
