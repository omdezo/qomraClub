/**
 * Uploads real Week 8 photos from /home/omar/Desktop/week8/الاعمال المقبولة (الكل)/
 * to Cloudflare R2, then replaces the Week 8 photos in the database.
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

const SOURCE_DIR = '/home/omar/Desktop/week8/الاعمال المقبولة (الكل)';

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
  if (!PUBLIC_URL) { console.error('R2_PUBLIC_URL not set'); process.exit(1); }
  if (!fs.existsSync(SOURCE_DIR)) { console.error(`Source dir not found: ${SOURCE_DIR}`); process.exit(1); }

  const week8 = await prisma.qomraWeekEdition.findUnique({ where: { editionNumber: 8 } });
  if (!week8) { console.error('Week 8 edition not found'); process.exit(1); }

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  console.log(`Found ${files.length} photos in ${SOURCE_DIR}\nUploading to R2...\n`);

  type Uploaded = { url: string; filename: string };
  const uploaded: Uploaded[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(SOURCE_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const hash = crypto.randomBytes(4).toString('hex');
    const key = `qomra/qomra-week-8/${String(i + 1).padStart(2, '0')}-${hash}${ext}`;

    try {
      const url = await uploadFile(filePath, key);
      uploaded.push({ url, filename: file });
      console.log(`  ✓ [${i + 1}/${files.length}] ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${(err as Error).message}`);
    }
  }

  console.log(`\nUploaded ${uploaded.length} photos to R2.\nUpdating database...`);

  await prisma.qomraWeekPhoto.deleteMany({ where: { editionNumber: 8 } });

  for (let i = 0; i < uploaded.length; i++) {
    const u = uploaded[i];
    // Filenames are like "Q29.3.jpg" — code, not human title. Use generic title with code.
    const code = u.filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    await prisma.qomraWeekPhoto.create({
      data: {
        editionId: week8.id,
        editionNumber: 8,
        title: { ar: `عمل ${code}`, en: `Work ${code}` },
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
    where: { editionNumber: 8 },
    data: {
      totalPhotos: uploaded.length,
      coverImageUrl: uploaded[0]?.url || week8.coverImageUrl,
    },
  });

  console.log(`\n✓ Replaced Week 8 with ${uploaded.length} real photos in DB`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
