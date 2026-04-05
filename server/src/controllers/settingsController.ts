import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallbackOne } from '../utils/fallback';

const getOrCreateSettings = async () => {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await withFallbackOne<any>(
    'sitesettings',
    () => getOrCreateSettings()
  );
  res.json(settings || {});
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    const settings = await prisma.siteSettings.create({ data: req.body });
    res.json(settings);
    return;
  }
  const settings = await prisma.siteSettings.update({
    where: { id: existing.id },
    data: req.body,
  });
  res.json(settings);
};
