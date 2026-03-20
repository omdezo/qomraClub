import mongoose from 'mongoose';
import app from '../src/app';
import { env } from '../src/config/env';
import { AdminUser } from '../src/models/AdminUser';

// Cache DB connection across warm invocations
let isConnected = false;

async function ensureConnection() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected (serverless)');
  const count = await AdminUser.countDocuments();
  if (count === 0) {
    await AdminUser.create({
      username: 'admin',
      email: 'admin@qomra.com',
      passwordHash: 'admin123',
      role: 'superadmin',
    });
  }
  isConnected = true;
}

export default async function handler(req: any, res: any) {
  try {
    await ensureConnection();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }
  return app(req, res);
}
