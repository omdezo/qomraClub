import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings';

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json(settings);
};
