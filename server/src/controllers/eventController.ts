import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { paginate } from '../utils/pagination';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.query;
  const filter: any = { isPublished: true };
  if (type) filter.type = type;

  const result = await paginate(Event.find(filter), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    sort: '-date',
  });
  res.json(result);
};

export const getUpcomingEvents = async (_req: Request, res: Response): Promise<void> => {
  const events = await Event.find({ isPublished: true, date: { $gte: new Date() } })
    .sort('date')
    .limit(5);
  res.json(events);
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.findOne({
    $or: [{ 'slug.en': req.params.slug }, { 'slug.ar': req.params.slug }],
  });
  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }
  res.json(event);
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }
  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }
  res.json({ message: 'Event deleted' });
};

export const adminGetEvents = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(Event.find(), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    sort: '-date',
  });
  res.json(result);
};
