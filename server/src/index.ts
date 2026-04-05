import app from './app';
import { env } from './config/env';
import { prisma, checkDbConnection } from './lib/prisma';
import bcrypt from 'bcryptjs';

process.on('unhandledRejection', (reason: any) => {
  console.warn('Unhandled rejection (continuing):', reason?.message || reason);
});

const seedAdmin = async () => {
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
      console.log('Default admin created: admin@qomra.com / admin123');
    }
  } catch (err) {
    console.warn('Admin seed skipped:', (err as Error).message);
  }
};

const start = async () => {
  const dbOk = await checkDbConnection();
  if (dbOk) {
    console.log('PostgreSQL connected');
    await seedAdmin();
  } else {
    console.warn('⚠ DB unavailable — server will use JSON fallback');
  }

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start();
