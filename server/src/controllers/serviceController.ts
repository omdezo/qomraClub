import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  const where: any = { isPublished: true, isAvailable: true };
  if (category) where.category = category;

  const result = await paginate(
    prisma.service,
    { where, include: { member: { select: { name: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};

export const getService = async (req: Request, res: Response): Promise<void> => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id as string },
    include: { member: { select: { name: true, avatarUrl: true, bio: true } } },
  });
  if (!service) { res.status(404).json({ message: 'Service not found' }); return; }
  res.json(service);
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  const { member, ...rest } = req.body;
  const data = member ? { ...rest, memberId: member } : rest;
  const service = await prisma.service.create({ data });
  res.status(201).json(service);
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { member, ...rest } = req.body;
    const data = member !== undefined ? { ...rest, memberId: member } : rest;
    const service = await prisma.service.update({ where: { id: req.params.id as string }, data });
    res.json(service);
  } catch { res.status(404).json({ message: 'Service not found' }); }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.service.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Service deleted' });
  } catch { res.status(404).json({ message: 'Service not found' }); }
};

export const adminGetServices = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.service,
    { include: { member: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};
