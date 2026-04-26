/**
 * Uploads real Week 7 photos from /home/omar/Desktop/week7/in /
 * to Cloudflare R2, then replaces the Week 7 photos in the database.
 */
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || 'qomra';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

const SOURCE_DIR = '/home/omar/Desktop/week7/in ';

// Parse a filename like "بيت السلاحف- Turtle house.jpeg" into Arabic + English titles
function parseTitle(filename: string): { ar: string; en: string } {
  // Remove extension
  let base = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  // Drop "Copy of " prefix
  base = base.replace(/^Copy of\s+/i, '').trim();

  // Split on common separators: -, _, ، (Arabic comma)
  const parts = base.split(/\s*[-_،]\s*/).map((s) => s.trim()).filter(Boolean);

  let ar = '';
  let en = '';
  const arabicRegex = /[؀-ۿ]/;

  for (const part of parts) {
    if (arabicRegex.test(part)) {
      if (!ar) ar = part;
    } else if (/[A-Za-z]/.test(part)) {
      if (!en) en = part;
    }
  }

  // If no parts had text, use filename as both
  if (!ar && !en) {
    if (arabicRegex.test(base)) ar = base;
    else en = base;
  }
  // Fill blanks with the other language
  if (!ar) ar = en;
  if (!en) en = ar;

  return { ar, en };
}

function contentTypeFor(file: string): string {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function uploadFile(filePath: string, key: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentTypeFor(filePath),
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return `${PUBLIC_URL}/${key}`;
}

async function main() {
  if (!PUBLIC_URL) {
    console.error('R2_PUBLIC_URL not set');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source dir not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Find Week 7 edition
  const week7 = await prisma.qomraWeekEdition.findUnique({
    where: { editionNumber: 7 },
  });
  if (!week7) {
    console.error('Week 7 edition not found in DB. Run seed-qomra-weeks.ts first.');
    process.exit(1);
  }

  // Read all image files
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  console.log(`Found ${files.length} photos in ${SOURCE_DIR}\n`);
  console.log('Uploading to R2...\n');

  // Upload all files
  type Uploaded = { url: string; ar: string; en: string };
  const uploaded: Uploaded[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(SOURCE_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const hash = crypto.randomBytes(4).toString('hex');
    const key = `qomra/qomra-week-7/${String(i + 1).padStart(2, '0')}-${hash}${ext}`;

    try {
      const url = await uploadFile(filePath, key);
      const titles = parseTitle(file);
      uploaded.push({ url, ar: titles.ar, en: titles.en });
      console.log(`  ✓ [${i + 1}/${files.length}] ${file.slice(0, 50)}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${(err as Error).message}`);
    }
  }

  console.log(`\nUploaded ${uploaded.length} photos to R2.`);

  // Replace photos in DB
  console.log('\nUpdating database...');

  await prisma.qomraWeekPhoto.deleteMany({ where: { editionNumber: 7 } });

  for (let i = 0; i < uploaded.length; i++) {
    const u = uploaded[i];
    await prisma.qomraWeekPhoto.create({
      data: {
        editionId: week7.id,
        editionNumber: 7,
        title: { ar: u.ar, en: u.en },
        photographerName: { ar: '', en: '' }, // photographer credits unknown
        imageUrl: u.url,
        thumbnailUrl: u.url,
        isWinner: i < 3, // mark first 3 as winners (placeholder)
        winnerPlace: i < 3 ? i + 1 : 0,
        sortOrder: i,
        isPublished: true,
      },
    });
  }

  // Update edition's totalPhotos and coverImageUrl
  await prisma.qomraWeekEdition.update({
    where: { editionNumber: 7 },
    data: {
      totalPhotos: uploaded.length,
      coverImageUrl: uploaded[0]?.url || week7.coverImageUrl,
    },
  });

  console.log(`\n✓ Replaced Week 7 with ${uploaded.length} real photos in DB`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
