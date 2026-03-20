import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '../config/r2';
import { env } from '../config/env';
import crypto from 'crypto';
import path from 'path';

interface UploadResult {
  url: string;
  key: string;
  width: number;
  height: number;
}

export const uploadToR2 = async (
  buffer: Buffer,
  folder: string = 'qomra',
  originalName: string = 'image.jpg',
  mimeType: string = 'image/jpeg'
): Promise<UploadResult> => {
  const ext = path.extname(originalName) || '.jpg';
  const hash = crypto.randomBytes(8).toString('hex');
  const key = `${folder}/${Date.now()}-${hash}${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  const url = `${env.r2.publicUrl}/${key}`;

  return { url, key, width: 0, height: 0 };
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
    })
  );
};
