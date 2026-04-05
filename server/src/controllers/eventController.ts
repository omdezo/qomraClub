import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.query;
  const where: any = { isPublished: true };
  if (type) where.type = type;

  const result = await paginate(
    prisma.event,
    { where, orderBy: { date: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};

export const getUpcomingEvents = async (_req: Request, res: Response): Promise<void> => {
  const events = await prisma.event.findMany({
    where: { isPublished: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 5,
  });
  res.json(events);
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;
  const events = await prisma.event.findMany({ where: { OR: [{ slug: { path: ['en'], equals: slug } }, { slug: { path: ['ar'], equals: slug } }] }, take: 1 });
  const event = events[0];
  if (!event) { res.status(404).json({ message: 'Event not found' }); return; }
  res.json(event);
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await prisma.event.create({ data: req.body });
  res.status(201).json(event);
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await prisma.event.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(event);
  } catch { res.status(404).json({ message: 'Event not found' }); }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.event.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Event deleted' });
  } catch { res.status(404).json({ message: 'Event not found' }); }
};

export const adminGetEvents = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.event,
    { orderBy: { date: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};
