import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message, type, phone } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: 'Name, email, subject, and message are required' });
    return;
  }
  const contact = await prisma.contactMessage.create({
    data: { name, email, subject, message, type: type || 'general', phone: phone || '' },
  });
  res.status(201).json({ message: 'Message sent successfully', id: contact.id });
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { type, isRead, isArchived } = req.query;
  const where: any = {};
  if (type) where.type = type;
  if (isRead !== undefined) where.isRead = isRead === 'true';
  if (isArchived !== undefined) where.isArchived = isArchived === 'true';
  else where.isArchived = false;

  const result = await paginate(
    prisma.contactMessage,
    { where, orderBy: { createdAt: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};

export const getMessage = async (req: Request, res: Response): Promise<void> => {
  const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id as string } });
  if (!message) { res.status(404).json({ message: 'Message not found' }); return; }
  res.json(message);
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await prisma.contactMessage.update({ where: { id: req.params.id as string }, data: { isRead: true } });
    res.json(message);
  } catch { res.status(404).json({ message: 'Message not found' }); }
};

export const archiveMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await prisma.contactMessage.update({ where: { id: req.params.id as string }, data: { isArchived: true } });
    res.json(message);
  } catch { res.status(404).json({ message: 'Message not found' }); }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Message deleted' });
  } catch { res.status(404).json({ message: 'Message not found' }); }
};
