import app from '../src/app';
import { connectDB } from '../src/config/db';
import { AdminUser } from '../src/models/AdminUser';

let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    await connectDB();
    // Seed admin on first cold start
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
};

export default async function handler(req: any, res: any) {
  await ensureConnection();
  return app(req, res);
}
