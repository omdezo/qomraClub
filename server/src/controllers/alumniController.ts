import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';
import { paginate } from '../utils/pagination';

export const getAlumni = async (req: Request, res: Response): Promise<void> => {
  const items = await withFallback<any>(
    'alumni',
    () => prisma.alumni.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { graduationYear: 'desc' }] }),
    (item) => item.isPublished === true
  );
  res.json(items);
};

export const getAlumniById = async (req: Request, res: Response): Promise<void> => {
  const alum = await prisma.alumni.findUnique({ where: { id: req.params.id as string } });
  if (!alum) { res.status(404).json({ message: 'Alumni not found' }); return; }
  res.json(alum);
};

export const adminGetAlumni = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.alumni,
    { orderBy: [{ sortOrder: 'asc' }, { graduationYear: 'desc' }] },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 50 }
  );
  res.json(result);
};

export const createAlumni = async (req: Request, res: Response): Promise<void> => {
  const alum = await prisma.alumni.create({ data: req.body });
  res.status(201).json(alum);
};

export const updateAlumni = async (req: Request, res: Response): Promise<void> => {
  try {
    const alum = await prisma.alumni.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(alum);
  } catch { res.status(404).json({ message: 'Alumni not found' }); }
};

export const deleteAlumni = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.alumni.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Alumni deleted' });
  } catch { res.status(404).json({ message: 'Alumni not found' }); }
};
