import { Request, Response } from 'express';
import { Photo } from '../models/Photo';
import { paginate } from '../utils/pagination';

export const getPhotos = async (req: Request, res: Response): Promise<void> => {
  const { category, featured, search } = req.query;
  const filter: any = { isPublished: true };

  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.$or = [
      { 'title.ar': { $regex: search, $options: 'i' } },
      { 'title.en': { $regex: search, $options: 'i' } },
      { 'photographerName.ar': { $regex: search, $options: 'i' } },
      { 'photographerName.en': { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginate(Photo.find(filter), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    sort: req.query.sort as string || 'sortOrder',
  });

  res.json(result);
};

export const getPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
    return;
  }
  res.json(photo);
};

export const createPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await Photo.create(req.body);
  res.status(201).json(photo);
};

export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
    return;
  }
  res.json(photo);
};

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await Photo.findByIdAndDelete(req.params.id);
  if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
    return;
  }
  res.json({ message: 'Photo deleted' });
};

export const reorderPhotos = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body; // [{ id, sortOrder }]
  const bulkOps = orders.map((item: { id: string; sortOrder: number }) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { sortOrder: item.sortOrder },
    },
  }));
  await Photo.bulkWrite(bulkOps);
  res.json({ message: 'Reordered' });
};

// Admin: get all photos including unpublished
export const adminGetPhotos = async (req: Request, res: Response): Promise<void> => {
  const { category, search } = req.query;
  const filter: any = {};

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { 'title.ar': { $regex: search, $options: 'i' } },
      { 'title.en': { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginate(Photo.find(filter), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 50,
    sort: 'sortOrder',
  });

  res.json(result);
};
