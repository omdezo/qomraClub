import { Request, Response } from 'express';
import { HomepageSection } from '../models/HomepageSection';

// Default sections to seed if none exist
const DEFAULT_SECTIONS = [
  {
    section: 'hero', enabled: true, sortOrder: 0,
    data: {
      heroImage: '/hero.jpg',
      heroTitle: { ar: '\u0642\u0645\u0631\u0629 \u2014 \u062d\u064a\u062b \u062a\u062a\u062d\u0648\u0644 \u0627\u0644\u0644\u062d\u0638\u0627\u062a \u0625\u0644\u0649 \u0641\u0646 \u062e\u0627\u0644\u062f', en: 'Qomra \u2014 Where moments become timeless art' },
      heroSubtitle: { ar: '\u062c\u0645\u0627\u0639\u0629 \u0627\u0644\u062a\u0635\u0648\u064a\u0631 \u0627\u0644\u0641\u0648\u062a\u0648\u063a\u0631\u0627\u0641\u064a \u2014 \u0646\u0644\u062a\u0642\u0637 \u0645\u0627 \u0644\u0627 \u064a\u064f\u0631\u0649 \u0648\u0646\u0631\u0648\u064a \u0645\u0627 \u0644\u0627 \u064a\u064f\u0642\u0627\u0644', en: 'The photography collective \u2014 we capture the unseen and tell the untold' },
    },
  },
  {
    section: 'parallax', enabled: true, sortOrder: 1,
    data: {
      parallaxImages: Array.from({ length: 16 }, (_, i) => `/img${i + 1}.jpg`),
      parallaxText: { ar: '\u0644\u062d\u0638\u0627\u062a \u0645\u0646 \u0627\u0644\u062d\u0631\u0643\u0629 \u0648\u0627\u0644\u0623\u062c\u0648\u0627\u0621 \u062a\u062c\u062a\u0645\u0639 \u0641\u064a \u0645\u062c\u0645\u0648\u0639\u0629 \u0647\u0627\u062f\u0626\u0629 \u0645\u0646 \u0627\u0644\u0644\u0642\u0637\u0627\u062a \u0627\u0644\u0628\u0635\u0631\u064a\u0629', en: 'Fragments of motion and atmosphere gathered into a drifting collection of quiet visual moments' },
    },
  },
  {
    section: 'qomraWeek', enabled: true, sortOrder: 2,
    data: {
      editionNumber: 11,
      editionTitle: { ar: '\u0623\u0633\u0628\u0648\u0639 \u0642\u0645\u0631\u0629', en: 'Qomra Week' },
      editionDescription: { ar: '\u0627\u0644\u0645\u0633\u0627\u0628\u0642\u0629 \u0627\u0644\u0633\u0646\u0648\u064a\u0629 \u0627\u0644\u0623\u0628\u0631\u0632 \u0644\u062c\u0645\u0627\u0639\u0629 \u0642\u0645\u0631\u0629 \u0641\u064a \u0627\u0644\u062a\u0635\u0648\u064a\u0631 \u0627\u0644\u0641\u0648\u062a\u0648\u063a\u0631\u0627\u0641\u064a', en: "The flagship annual photography competition by Qomra Club" },
      editionCoverImages: ['/gallery1.jpg', '/gallery3.jpg', '/gallery5.jpg'],
    },
  },
  {
    section: 'featured', enabled: true, sortOrder: 3,
    data: {
      featuredLabel: { ar: '\u0623\u0639\u0645\u0627\u0644 \u0645\u062e\u062a\u0627\u0631\u0629', en: 'Selected Works' },
      featuredImages: Array.from({ length: 8 }, (_, i) => ({
        image: `/gallery${(i % 10) + 1}.jpg`,
        title: { ar: `\u0639\u0645\u0644 \u0641\u0648\u062a\u0648\u063a\u0631\u0627\u0641\u064a ${i + 1}`, en: `Photography Work ${i + 1}` },
        photographer: { ar: '\u0645\u0635\u0648\u0631 \u0642\u0645\u0631\u0629', en: 'Qomra Photographer' },
      })),
    },
  },
  {
    section: 'events', enabled: true, sortOrder: 4,
    data: {},
  },
  {
    section: 'joinCta', enabled: true, sortOrder: 5,
    data: {
      ctaTitle: { ar: '\u0643\u0646 \u062c\u0632\u0621\u0627\u064b \u0645\u0646 \u0627\u0644\u0635\u0648\u0631\u0629', en: 'Be part of the frame' },
      ctaDescription: { ar: '\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0645\u062c\u062a\u0645\u0639 \u0642\u0645\u0631\u0629 \u0648\u0627\u0643\u062a\u0634\u0641 \u0641\u0646 \u0627\u0644\u062a\u0635\u0648\u064a\u0631 \u0645\u0639 \u0645\u0628\u062f\u0639\u064a\u0646 \u064a\u0634\u0627\u0631\u0643\u0648\u0646\u0643 \u0627\u0644\u0634\u063a\u0641', en: 'Join the Qomra community and discover photography with creators who share your passion' },
      ctaButtonText: { ar: '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627', en: 'Get in Touch' },
    },
  },
];

const seedDefaults = async () => {
  const count = await HomepageSection.countDocuments();
  if (count === 0) {
    await HomepageSection.insertMany(DEFAULT_SECTIONS);
  }
};

export const getHomepageSections = async (_req: Request, res: Response): Promise<void> => {
  await seedDefaults();
  const sections = await HomepageSection.find({ enabled: true }).sort('sortOrder');
  res.json(sections);
};

export const adminGetHomepageSections = async (_req: Request, res: Response): Promise<void> => {
  await seedDefaults();
  const sections = await HomepageSection.find().sort('sortOrder');
  res.json(sections);
};

export const updateHomepageSection = async (req: Request, res: Response): Promise<void> => {
  const { sectionType } = req.params;
  let section = await HomepageSection.findOne({ section: sectionType });
  if (!section) {
    section = await HomepageSection.create({ section: sectionType, ...req.body });
  } else {
    if (req.body.data) {
      section.data = { ...section.data, ...req.body.data };
      section.markModified('data');
    }
    if (req.body.enabled !== undefined) section.enabled = req.body.enabled;
    if (req.body.sortOrder !== undefined) section.sortOrder = req.body.sortOrder;
    await section.save();
  }
  res.json(section);
};
