import { Request, Response } from 'express';
import { Member } from '../models/Member';
import { paginate } from '../utils/pagination';

export const getMembers = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(Member.find({ isPublished: true }), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 50,
    sort: 'sortOrder',
  });
  res.json(result);
};

export const getBoardMembers = async (_req: Request, res: Response): Promise<void> => {
  const members = await Member.find({ isPublished: true, isBoardMember: true }).sort('boardPosition');
  res.json(members);
};

export const getMember = async (req: Request, res: Response): Promise<void> => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404).json({ message: 'Member not found' });
    return;
  }
  res.json(member);
};

export const createMember = async (req: Request, res: Response): Promise<void> => {
  const member = await Member.create(req.body);
  res.status(201).json(member);
};

export const updateMember = async (req: Request, res: Response): Promise<void> => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!member) {
    res.status(404).json({ message: 'Member not found' });
    return;
  }
  res.json(member);
};

export const deleteMember = async (req: Request, res: Response): Promise<void> => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) {
    res.status(404).json({ message: 'Member not found' });
    return;
  }
  res.json({ message: 'Member deleted' });
};

export const adminGetMembers = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(Member.find(), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 50,
    sort: 'sortOrder',
  });
  res.json(result);
};
