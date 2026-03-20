import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { paginate } from '../utils/pagination';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message, type, phone } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: 'Name, email, subject, and message are required' });
    return;
  }

  const contact = await ContactMessage.create({ name, email, subject, message, type, phone });
  res.status(201).json({ message: 'Message sent successfully', id: contact._id });
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { type, isRead, isArchived } = req.query;
  const filter: any = {};
  if (type) filter.type = type;
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
  else filter.isArchived = false;

  const result = await paginate(ContactMessage.find(filter), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    sort: '-createdAt',
  });
  res.json(result);
};

export const getMessage = async (req: Request, res: Response): Promise<void> => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.json(message);
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.json(message);
};

export const archiveMessage = async (req: Request, res: Response): Promise<void> => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isArchived: true },
    { new: true }
  );
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.json(message);
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.json({ message: 'Message deleted' });
};
