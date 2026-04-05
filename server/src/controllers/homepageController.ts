import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { withFallback } from '../utils/fallback';

const DEFAULT_SECTIONS = [
  {
    section: 'hero', enabled: true, sortOrder: 0,
    data: {
      heroImage: '',
      heroTitle: { ar: 'قمرة — حيث تتحول اللحظات إلى فن خالد', en: 'Qomra — Where moments become timeless art' },
      heroSubtitle: { ar: 'جماعة التصوير الفوتوغرافي — نلتقط ما لا يُرى ونروي ما لا يُقال', en: 'The photography collective — we capture the unseen and tell the untold' },
    },
  },
  {
    section: 'parallax', enabled: true, sortOrder: 1,
    data: {
      parallaxImages: [],
      parallaxText: { ar: 'لحظات من الحركة والأجواء تجتمع في مجموعة هادئة من اللقطات البصرية', en: 'Fragments of motion and atmosphere gathered into a drifting collection of quiet visual moments' },
    },
  },
  {
    section: 'qomraWeek', enabled: true, sortOrder: 2,
    data: {
      editionNumber: 11,
      editionTitle: { ar: 'أسبوع قمرة', en: 'Qomra Week' },
      editionDescription: { ar: 'المسابقة السنوية الأبرز لجماعة قمرة في التصوير الفوتوغرافي', en: 'The flagship annual photography competition by Qomra Club' },
      editionCoverImages: [],
    },
  },
  {
    section: 'featured', enabled: true, sortOrder: 3,
    data: { featuredLabel: { ar: 'أعمال مختارة', en: 'Selected Works' }, featuredImages: [] },
  },
  {
    section: 'events', enabled: true, sortOrder: 4, data: {},
  },
  {
    section: 'joinCta', enabled: true, sortOrder: 5,
    data: {
      ctaTitle: { ar: 'كن جزءاً من الصورة', en: 'Be part of the frame' },
      ctaDescription: { ar: 'انضم إلى مجتمع قمرة واكتشف فن التصوير مع مبدعين يشاركونك الشغف', en: 'Join the Qomra community and discover photography with creators who share your passion' },
      ctaButtonText: { ar: 'تواصل معنا', en: 'Get in Touch' },
    },
  },
];

const seedDefaults = async () => {
  try {
    const count = await prisma.homepageSection.count();
    if (count === 0) {
      await prisma.homepageSection.createMany({ data: DEFAULT_SECTIONS });
    }
  } catch {
    // DB unavailable, skip seed
  }
};

export const getHomepageSections = async (_req: Request, res: Response): Promise<void> => {
  await seedDefaults();
  const sections = await withFallback<any>(
    'homepagesections',
    () => prisma.homepageSection.findMany({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
    (s) => s.enabled === true
  );
  const sorted = [...sections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  res.json(sorted);
};

export const adminGetHomepageSections = async (_req: Request, res: Response): Promise<void> => {
  await seedDefaults();
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(sections);
};

export const updateHomepageSection = async (req: Request, res: Response): Promise<void> => {
  const sectionType = req.params.sectionType as string;
  const existing = await prisma.homepageSection.findUnique({ where: { section: sectionType } });

  if (!existing) {
    const section = await prisma.homepageSection.create({
      data: { section: sectionType, ...req.body },
    });
    res.json(section);
    return;
  }

  const mergedData = req.body.data
    ? { ...(existing.data as object), ...req.body.data }
    : existing.data;

  const section = await prisma.homepageSection.update({
    where: { section: sectionType },
    data: {
      data: mergedData,
      ...(req.body.enabled !== undefined && { enabled: req.body.enabled }),
      ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
    },
  });
  res.json(section);
};
