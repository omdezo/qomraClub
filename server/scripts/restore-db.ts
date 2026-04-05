/**
 * Import JSON backup files from server/data/ into PostgreSQL via Prisma.
 * Usage: npm run restore
 */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function restore() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  console.log('Connected. Restoring from JSON...\n');

  const dataDir = path.join(__dirname, '../data');

  const loadJson = (name: string): any[] => {
    const filePath = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  };

  const stripFallbackId = (doc: any) => {
    if (typeof doc._id === 'string' && doc._id.startsWith('fallback-')) {
      const { _id, ...rest } = doc;
      return rest;
    }
    if (typeof doc.id === 'string' && doc.id.startsWith('fallback-')) {
      const { id, ...rest } = doc;
      return rest;
    }
    // Remove Mongo-specific _id, __v
    const { _id, __v, ...rest } = doc;
    return rest;
  };

  try {
    // Wipe tables in FK-safe order
    await prisma.qomraWeekPhoto.deleteMany({});
    await prisma.qomraWeekEdition.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.galleryItem.deleteMany({});
    await prisma.homepageSection.deleteMany({});
    await prisma.siteSettings.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.member.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.contactMessage.deleteMany({});

    // Gallery items
    const galleryItems = loadJson('galleryitems').map(stripFallbackId);
    if (galleryItems.length > 0) {
      await prisma.galleryItem.createMany({ data: galleryItems });
      console.log(`  ✓ gallery_items: ${galleryItems.length}`);
    }

    // Homepage sections
    const homepageSections = loadJson('homepagesections').map(stripFallbackId);
    for (const sec of homepageSections) {
      await prisma.homepageSection.create({ data: sec });
    }
    console.log(`  ✓ homepage_sections: ${homepageSections.length}`);

    // Site settings
    const settings = loadJson('sitesettings').map(stripFallbackId);
    for (const s of settings) {
      await prisma.siteSettings.create({ data: s });
    }
    console.log(`  ✓ site_settings: ${settings.length}`);

    // Events
    const events = loadJson('events').map((e) => {
      const clean = stripFallbackId(e);
      if (clean.date) clean.date = new Date(clean.date);
      return clean;
    });
    if (events.length > 0) {
      for (const e of events) await prisma.event.create({ data: e });
      console.log(`  ✓ events: ${events.length}`);
    }

    // Members
    const members = loadJson('members').map(stripFallbackId);
    if (members.length > 0) {
      await prisma.member.createMany({ data: members });
      console.log(`  ✓ members: ${members.length}`);
    }

    // Articles
    const articles = loadJson('articles').map(stripFallbackId);
    if (articles.length > 0) {
      await prisma.article.createMany({ data: articles });
      console.log(`  ✓ articles: ${articles.length}`);
    }

    console.log('\nRestore complete.');
  } catch (err) {
    console.error('Restore failed:', err);
  }

  await prisma.$disconnect();
}

restore().catch((err) => {
  console.error('Restore error:', err);
  process.exit(1);
});
