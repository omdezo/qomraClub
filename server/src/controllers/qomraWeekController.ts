import { Request, Response } from 'express';
import { QomraWeekEdition } from '../models/QomraWeekEdition';
import { QomraWeekPhoto } from '../models/QomraWeekPhoto';
import { paginate } from '../utils/pagination';

export const getEditions = async (_req: Request, res: Response): Promise<void> => {
  const editions = await QomraWeekEdition.find({ isPublished: true }).sort('-editionNumber');
  res.json(editions);
};

export const getEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await QomraWeekEdition.findOne({ editionNumber: Number(req.params.num) });
  if (!edition) {
    res.status(404).json({ message: 'Edition not found' });
    return;
  }
  res.json(edition);
};

export const getEditionPhotos = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    QomraWeekPhoto.find({ editionNumber: Number(req.params.num), isPublished: true }),
    {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
      sort: 'sortOrder',
    }
  );
  res.json(result);
};

export const createEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await QomraWeekEdition.create(req.body);
  res.status(201).json(edition);
};

export const updateEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await QomraWeekEdition.findOneAndUpdate(
    { editionNumber: Number(req.params.num) },
    req.body,
    { new: true }
  );
  if (!edition) {
    res.status(404).json({ message: 'Edition not found' });
    return;
  }
  res.json(edition);
};

export const deleteEdition = async (req: Request, res: Response): Promise<void> => {
  const edition = await QomraWeekEdition.findOneAndDelete({ editionNumber: Number(req.params.num) });
  if (!edition) {
    res.status(404).json({ message: 'Edition not found' });
    return;
  }
  await QomraWeekPhoto.deleteMany({ editionNumber: Number(req.params.num) });
  res.json({ message: 'Edition and photos deleted' });
};

export const createEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  const edition = await QomraWeekEdition.findOne({ editionNumber: Number(req.params.num) });
  if (!edition) {
    res.status(404).json({ message: 'Edition not found' });
    return;
  }
  const photo = await QomraWeekPhoto.create({
    ...req.body,
    edition: edition._id,
    editionNumber: edition.editionNumber,
  });
  res.status(201).json(photo);
};

export const updateEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await QomraWeekPhoto.findByIdAndUpdate(req.params.photoId, req.body, { new: true });
  if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
    return;
  }
  res.json(photo);
};

export const deleteEditionPhoto = async (req: Request, res: Response): Promise<void> => {
  const photo = await QomraWeekPhoto.findByIdAndDelete(req.params.photoId);
  if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
    return;
  }
  res.json({ message: 'Photo deleted' });
};

export const reorderEditionPhotos = async (req: Request, res: Response): Promise<void> => {
  const { orders } = req.body;
  const bulkOps = orders.map((item: { id: string; sortOrder: number }) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { sortOrder: item.sortOrder },
    },
  }));
  await QomraWeekPhoto.bulkWrite(bulkOps);
  res.json({ message: 'Reordered' });
};

export const adminGetEditions = async (_req: Request, res: Response): Promise<void> => {
  const editions = await QomraWeekEdition.find().sort('-editionNumber');
  res.json(editions);
};
