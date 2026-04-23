import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';

export const getTitles = async (_req: Request, res: Response): Promise<void> => {
  const items = await withFallback<any>(
    'titles',
    () => prisma.title.findMany({ where: { isPublished: true }, orderBy: [{ tier: 'asc' }, { sortOrder: 'asc' }] }),
    (item) => item.isPublished === true
  );
  res.json(items);
};

export const adminGetTitles = async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.title.findMany({ orderBy: [{ tier: 'asc' }, { sortOrder: 'asc' }] });
  res.json(items);
};

export const createTitle = async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.title.create({ data: req.body });
  res.status(201).json(item);
};

export const updateTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await prisma.title.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(item);
  } catch { res.status(404).json({ message: 'Title not found' }); }
};

export const deleteTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.title.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Title deleted' });
  } catch { res.status(404).json({ message: 'Title not found' }); }
};
