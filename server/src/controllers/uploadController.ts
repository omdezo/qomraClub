import { Request, Response } from 'express';
import { uploadToR2, deleteFromR2 } from '../utils/r2Helper';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file provided' });
    return;
  }

  const folder = (req.query.folder as string) || 'qomra';
  const result = await uploadToR2(
    req.file.buffer,
    folder,
    req.file.originalname,
    req.file.mimetype
  );

  // Return compatible shape (url + publicId key for deletion)
  res.json({
    url: result.url,
    publicId: result.key,
    thumbnailUrl: result.url,
    blurDataUrl: result.url,
    width: result.width,
    height: result.height,
  });
};

export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({ message: 'No files provided' });
    return;
  }

  const folder = (req.query.folder as string) || 'qomra';
  const results = await Promise.all(
    req.files.map((file: Express.Multer.File) =>
      uploadToR2(file.buffer, folder, file.originalname, file.mimetype).then((r) => ({
        url: r.url,
        publicId: r.key,
        thumbnailUrl: r.url,
        blurDataUrl: r.url,
        width: r.width,
        height: r.height,
      }))
    )
  );
  res.json(results);
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  const key = req.params.id || (req.params as Record<string, string>)[0];
  await deleteFromR2(key as string);
  res.json({ message: 'Image deleted' });
};
