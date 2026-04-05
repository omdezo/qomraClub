import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const [photos, members, events, editions, articles, services, unreadMessages] =
    await Promise.all([
      prisma.photo.count(),
      prisma.member.count(),
      prisma.event.count(),
      prisma.qomraWeekEdition.count(),
      prisma.article.count(),
      prisma.service.count(),
      prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    ]);

  res.json({ photos, members, events, editions, articles, services, unreadMessages });
};
