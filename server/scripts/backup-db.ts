/**
 * Export all PostgreSQL tables to JSON files in server/data/
 * Usage: npm run backup
 */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function backup() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  console.log('Connected. Exporting tables...\n');

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const exports: Record<string, () => Promise<any[]>> = {
    galleryitems: () => prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }),
    homepagesections: () => prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } }),
    sitesettings: () => prisma.siteSettings.findMany(),
    events: () => prisma.event.findMany({ orderBy: { date: 'desc' } }),
    services: () => prisma.service.findMany(),
    members: () => prisma.member.findMany({ orderBy: { sortOrder: 'asc' } }),
    articles: () => prisma.article.findMany({ orderBy: { createdAt: 'desc' } }),
    qomraweekeditions: () => prisma.qomraWeekEdition.findMany({ orderBy: { editionNumber: 'desc' } }),
    qomraweekphotos: () => prisma.qomraWeekPhoto.findMany({ orderBy: { sortOrder: 'asc' } }),
  };

  for (const [name, fetch] of Object.entries(exports)) {
    try {
      const docs = await fetch();
      fs.writeFileSync(path.join(dataDir, `${name}.json`), JSON.stringify(docs, null, 2));
      console.log(`  ✓ ${name}: ${docs.length} rows`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${(err as Error).message}`);
    }
  }

  await prisma.$disconnect();
  console.log('\nBackup complete.');
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
