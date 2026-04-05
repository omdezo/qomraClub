import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getEditions = async (_req: Request, res: Response): Promise<void> => {
  const editions = await prisma.qomraWeekEdition.findMany({
    where: { isPublished: true },
    orderBy: { editionNumber: 'desc' },
  });
  res.json(editions);
};

export const getEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await prisma.qomraWeekEdition.findUnique({
    where: { editionNumber: Number(req.params.num) },
  });
  if (!edition) { res.status(404).json({ message: 'Edition not found' }); return; }
  res.json(edition);
};

export const getEditionPhotos = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.qomraWeekPhoto,
    { where: { editionNumber: Number(req.params.num), isPublished: true }, orderBy: { sortOrder: 'asc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 50 }
  );
  res.json(result);
};

export const createEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await prisma.qomraWeekEdition.create({ data: req.body });
  res.status(201).json(edition);
};

export const updateEdition = async (req: Request, res: Response): Promise<void> => {
  try {
    const edition = await prisma.qomraWeekEdition.update({
      where: { editionNumber: Number(req.params.num) },
      data: req.body,
    });
    res.json(edition);
  } catch { res.status(404).json({ message: 'Edition not found' }); }
};

export const deleteEdition = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.qomraWeekEdition.delete({
      where: { editionNumber: Number(req.params.num) },
    });
    res.json({ message: 'Edition and photos deleted' });
  } catch { res.status(404).json({ message: 'Edition not found' }); }
};

export const createEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  const edition = await prisma.qomraWeekEdition.findUnique({
    where: { editionNumber: Number(req.params.num) },
  });
  if (!edition) { res.status(404).json({ message: 'Edition not found' }); return; }
  const photo = await prisma.qomraWeekPhoto.create({
    data: { ...req.body, editionId: edition.id, editionNumber: edition.editionNumber },
  });
  res.status(201).json(photo);
};

export const updateEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const photo = await prisma.qomraWeekPhoto.update({
      where: { id: req.params.photoId as string },
      data: req.body,
    });
    res.json(photo);
  } catch { res.status(404).json({ message: 'Photo not found' }); }
};

export const deleteEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.qomraWeekPhoto.delete({ where: { id: req.params.photoId as string } });
    res.json({ message: 'Photo deleted' });
  } catch { res.status(404).json({ message: 'Photo not found' }); }
};

export const reorderEditionPhotos = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body;
  await prisma.$transaction(
    orders.map((item: { id: string; sortOrder: number }) =>
      prisma.qomraWeekPhoto.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    )
  );
  res.json({ message: 'Reordered' });
};

export const adminGetEditions = async (_req: Request, res: Response): Promise<void> => {
  const editions = await prisma.qomraWeekEdition.findMany({
    orderBy: { editionNumber: 'desc' },
  });
  res.json(editions);
};
