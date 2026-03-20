import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { AdminUser } from './models/AdminUser';

const seedAdmin = async () => {
  const count = await AdminUser.countDocuments();
  if (count === 0) {
    await AdminUser.create({
      username: 'admin',
      email: 'admin@qomra.com',
      passwordHash: 'admin123',
      role: 'superadmin',
    });
    console.log('Default admin created: admin@qomra.com / admin123');
  }
};

const start = async () => {
  await connectDB();
  await seedAdmin();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
