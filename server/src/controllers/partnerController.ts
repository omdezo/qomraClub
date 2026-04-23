import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';

export const getPartners = async (_req: Request, res: Response): Promise<void> => {
  const items = await withFallback<any>(
    'partners',
    () => prisma.partner.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    (item) => item.isPublished === true
  );
  res.json(items);
};

export const adminGetPartners = async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(items);
};

export const createPartner = async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.partner.create({ data: req.body });
  res.status(201).json(item);
};

export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await prisma.partner.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(item);
  } catch { res.status(404).json({ message: 'Partner not found' }); }
};

export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.partner.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Partner deleted' });
  } catch { res.status(404).json({ message: 'Partner not found' }); }
};
