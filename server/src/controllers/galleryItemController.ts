import { Request, Response } from 'express';
import { GalleryItem } from '../models/GalleryItem';

export const getGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.query;
  const filter: any = { isPublished: true };
  if (section) filter.section = section;
  const items = await GalleryItem.find(filter).sort('sortOrder');
  res.json(items);
};

export const adminGetGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { section } = req.query;
  const filter: any = {};
  if (section) filter.section = section;
  const items = await GalleryItem.find(filter).sort('sortOrder');
  res.json(items);
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  const item = await GalleryItem.create(req.body);
  res.status(201).json(item);
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) { res.status(404).json({ message: 'Item not found' }); return; }
  res.json(item);
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ message: 'Item not found' }); return; }
  res.json({ message: 'Deleted' });
};

export const reorderGalleryItems = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body;
  const bulkOps = orders.map((item: { id: string; sortOrder: number }) => ({
    updateOne: { filter: { _id: item.id }, update: { sortOrder: item.sortOrder } },
  }));
  await GalleryItem.bulkWrite(bulkOps);
  res.json({ message: 'Reordered' });
};
