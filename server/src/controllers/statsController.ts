import { Request, Response } from 'express';
import { Photo } from '../models/Photo';
import { Member } from '../models/Member';
import { Event } from '../models/Event';
import { QomraWeekEdition } from '../models/QomraWeekEdition';
import { Article } from '../models/Article';
import { Service } from '../models/Service';
import { ContactMessage } from '../models/ContactMessage';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const [photos, members, events, editions, articles, services, unreadMessages] =
    await Promise.all([
      Photo.countDocuments(),
      Member.countDocuments(),
      Event.countDocuments(),
      QomraWeekEdition.countDocuments(),
      Article.countDocuments(),
      Service.countDocuments(),
      ContactMessage.countDocuments({ isRead: false, isArchived: false }),
    ]);

  res.json({ photos, members, events, editions, articles, services, unreadMessages });
};
