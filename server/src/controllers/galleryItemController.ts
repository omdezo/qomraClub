import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';

export const getGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.query;

  const items = await withFallback<any>(
    'galleryitems',
    () =>
      prisma.galleryItem.findMany({
        where: {
          isPublished: true,
          ...(section ? { section: section as string } : {}),
        },
        orderBy: { sortOrder: 'asc' },
      }),
    (item) =>
      item.isPublished === true && (!section || item.section === section)
  );

  const sorted = [...items].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  res.json(sorted);
};

export const adminGetGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.query;
  const items = await prisma.galleryItem.findMany({
    where: section ? { section: section as string } : {},
    orderBy: { sortOrder: 'asc' },
  });
  res.json(items);
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.galleryItem.create({ data: req.body });
  res.status(201).json(item);
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await prisma.galleryItem.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(item);
  } catch {
    res.status(404).json({ message: 'Item not found' });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.galleryItem.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(404).json({ message: 'Item not found' });
  }
};

export const reorderGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body;
  await prisma.$transaction(
    orders.map((item: { id: string; sortOrder: number }) =>
      prisma.galleryItem.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
  res.json({ message: 'Reordered' });
};
