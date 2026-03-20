import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { paginate } from '../utils/pagination';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  const filter: any = { isPublished: true, isAvailable: true };
  if (category) filter.category = category;

  const result = await paginate(Service.find(filter).populate('member', 'name avatarUrl'), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  });
  res.json(result);
};

export const getService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findById(req.params.id).populate('member', 'name avatarUrl bio');
  if (!service) {
    res.status(404).json({ message: 'Service not found' });
    return;
  }
  res.json(service);
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) {
    res.status(404).json({ message: 'Service not found' });
    return;
  }
  res.json(service);
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404).json({ message: 'Service not found' });
    return;
  }
  res.json({ message: 'Service deleted' });
};

export const adminGetServices = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(Service.find().populate('member', 'name'), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  });
  res.json(result);
};
