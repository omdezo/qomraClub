/**
 * Generic uploader: takes (week number, source folder) and uploads all photos.
 * Creates the edition if it doesn't exist, replaces all photos for the week.
 *
 * Usage:
 *   tsx scripts/upload-week-photos.ts 1 "/path/to/folder"
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

// Bilingual title parser — extracts ar/en from filenames like "بيت السلاحف- Turtle house"
function parseTitle(filename: string): { ar: string; en: string } {
  let base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  base = base.replace(/^Copy of\s+/i, '').trim();
  const parts = base.split(/\s*[-_،]\s*/).map((s) => s.trim()).filter(Boolean);

  let ar = '', en = '';
  const arabicRegex = /[؀-ۿ]/;

  for (const part of parts) {
    if (arabicRegex.test(part)) { if (!ar) ar = part; }
    else if (/[A-Za-z]/.test(part)) { if (!en) en = part; }
  }

  if (!ar && !en) {
    if (arabicRegex.test(base)) ar = base; else en = base;
  }
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
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: buffer,
    ContentType: contentTypeFor(filePath),
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return `${PUBLIC_URL}/${key}`;
}

async function main() {
  const weekNum = parseInt(process.argv[2] || '', 10);
  const sourceDir = process.argv[3];

  if (!weekNum || !sourceDir) {
    console.error('Usage: tsx scripts/upload-week-photos.ts <weekNum> <sourceDir>');
    process.exit(1);
  }
  if (!PUBLIC_URL) { console.error('R2_PUBLIC_URL not set'); process.exit(1); }
  if (!fs.existsSync(sourceDir)) { console.error(`Not found: ${sourceDir}`); process.exit(1); }

  // Get or create edition
  let edition = await prisma.qomraWeekEdition.findUnique({ where: { editionNumber: weekNum } });

  if (!edition) {
    console.log(`Edition ${weekNum} not found — creating placeholder...`);
    edition = await prisma.qomraWeekEdition.create({
      data: {
        editionNumber: weekNum,
        year: 2015 + weekNum, // rough heuristic
        title: { ar: `أسبوع قمرة ${weekNum}`, en: `Qomra Week ${weekNum}` },
        theme: { ar: '', en: '' },
        description: { ar: '', en: '' },
        coverImageUrl: '',
        totalParticipants: 0,
        totalPhotos: 0,
        winners: [],
        judges: [],
        isCurrent: false,
        isPublished: true,
      },
    });
    console.log(`  ✓ Created edition ${weekNum}`);
  }

  const files = fs.readdirSync(sourceDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  console.log(`\nFound ${files.length} photos in ${sourceDir}\nUploading to R2...\n`);

  type Uploaded = { url: string; ar: string; en: string };
  const uploaded: Uploaded[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(sourceDir, file);
    const ext = path.extname(file).toLowerCase();
    const hash = crypto.randomBytes(4).toString('hex');
    const key = `qomra/qomra-week-${weekNum}/${String(i + 1).padStart(2, '0')}-${hash}${ext}`;

    try {
      const url = await uploadFile(filePath, key);
      const titles = parseTitle(file);
      uploaded.push({ url, ...titles });
      console.log(`  ✓ [${i + 1}/${files.length}] ${file.slice(0, 50)}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${(err as Error).message}`);
    }
  }

  console.log(`\nUploaded ${uploaded.length} photos to R2.\nUpdating database...`);

  await prisma.qomraWeekPhoto.deleteMany({ where: { editionNumber: weekNum } });

  for (let i = 0; i < uploaded.length; i++) {
    const u = uploaded[i];
    await prisma.qomraWeekPhoto.create({
      data: {
        editionId: edition.id,
        editionNumber: weekNum,
        title: { ar: u.ar, en: u.en },
        photographerName: { ar: '', en: '' },
        imageUrl: u.url,
        thumbnailUrl: u.url,
        isWinner: i < 3,
        winnerPlace: i < 3 ? i + 1 : 0,
        sortOrder: i,
        isPublished: true,
      },
    });
  }

  await prisma.qomraWeekEdition.update({
    where: { editionNumber: weekNum },
    data: { totalPhotos: uploaded.length, coverImageUrl: uploaded[0]?.url || edition.coverImageUrl },
  });

  console.log(`\n✓ Replaced Week ${weekNum} with ${uploaded.length} real photos in DB`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
