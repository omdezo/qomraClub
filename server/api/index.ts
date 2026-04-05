import app from '../src/app';
import { prisma, checkDbConnection } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

let isConnected = false;
let lastAttempt = 0;
const RETRY_INTERVAL = 30_000;

async function ensureConnection() {
  if (isConnected) return;
  const now = Date.now();
  if (now - lastAttempt < RETRY_INTERVAL) return;
  lastAttempt = now;

  const ok = await checkDbConnection();
  if (!ok) {
    console.warn('DB unreachable — using JSON fallback');
    return;
  }
  isConnected = true;

  // Seed admin on first successful connection
  try {
    const count = await prisma.adminUser.count();
    if (count === 0) {
      const hash = await bcrypt.hash('admin123', 12);
      await prisma.adminUser.create({
        data: {
          username: 'admin',
          email: 'admin@qomra.com',
          passwordHash: hash,
          role: 'superadmin',
        },
      });
    }
  } catch (err) {
    console.error('Admin seed failed:', (err as Error).message);
  }
}

export default async function handler(req: any, res: any) {
  await ensureConnection();
  return app(req, res);
}
