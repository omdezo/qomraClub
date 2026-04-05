import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getPhotos = async (req: Request, res: Response): Promise<void> => {
  const { category, featured, search } = req.query;
  const where: any = { isPublished: true };
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;
  if (search) {
    const q = search as string;
    where.OR = [
      { title: { path: ['ar'], string_contains: q } },
      { title: { path: ['en'], string_contains: q } },
      { photographerName: { path: ['ar'], string_contains: q } },
      { photographerName: { path: ['en'], string_contains: q } },
    ];
  }

  const result = await paginate(
    prisma.photo,
    { where, orderBy: { sortOrder: 'asc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};

export const getPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await prisma.photo.findUnique({ where: { id: req.params.id as string } });
  if (!photo) { res.status(404).json({ message: 'Photo not found' }); return; }
  res.json(photo);
};

export const createPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await prisma.photo.create({ data: req.body });
  res.status(201).json(photo);
};

export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const photo = await prisma.photo.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(photo);
  } catch { res.status(404).json({ message: 'Photo not found' }); }
};

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.photo.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Photo deleted' });
  } catch { res.status(404).json({ message: 'Photo not found' }); }
};

export const reorderPhotos = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body;
  await prisma.$transaction(
    orders.map((item: { id: string; sortOrder: number }) =>
      prisma.photo.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  res.json({ message: 'Reordered' });
};

export const adminGetPhotos = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  const where: any = {};
  if (category) where.category = category;

  const result = await paginate(
    prisma.photo,
    { where, orderBy: { sortOrder: 'asc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 50 }
  );
  res.json(result);
};
