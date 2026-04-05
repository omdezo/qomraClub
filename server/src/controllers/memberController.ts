import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getMembers = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.member,
    { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 50 }
  );
  res.json(result);
};

export const getBoardMembers = async (_req: Request, res: Response): Promise<void> => {
  const members = await prisma.member.findMany({
    where: { isPublished: true, isBoardMember: true },
    orderBy: { boardPosition: 'asc' },
  });
  res.json(members);
};

export const getMember = async (req: Request, res: Response): Promise<void> => {
  const member = await prisma.member.findUnique({ where: { id: req.params.id as string } });
  if (!member) { res.status(404).json({ message: 'Member not found' }); return; }
  res.json(member);
};

export const createMember = async (req: Request, res: Response): Promise<void> => {
  const member = await prisma.member.create({ data: req.body });
  res.status(201).json(member);
};

export const updateMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await prisma.member.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(member);
  } catch { res.status(404).json({ message: 'Member not found' }); }
};

export const deleteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.member.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Member deleted' });
  } catch { res.status(404).json({ message: 'Member not found' }); }
};

export const adminGetMembers = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.member,
    { orderBy: { sortOrder: 'asc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 50 }
  );
  res.json(result);
};
