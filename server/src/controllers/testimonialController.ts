import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';

export const getTestimonials = async (_req: Request, res: Response): Promise<void> => {
  const items = await withFallback<any>(
    'testimonials',
    () => prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    (item) => item.isPublished === true
  );
  res.json(items);
};

export const adminGetTestimonials = async (_req: Request, res: Response): Promise<void> => {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(items);
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  const item = await prisma.testimonial.create({ data: req.body });
  res.status(201).json(item);
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await prisma.testimonial.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(item);
  } catch { res.status(404).json({ message: 'Testimonial not found' }); }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Testimonial deleted' });
  } catch { res.status(404).json({ message: 'Testimonial not found' }); }
};
