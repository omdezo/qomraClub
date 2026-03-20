import mongoose, { Document, Schema } from 'mongoose';

export interface IHomepageSection extends Document {
  section: 'hero' | 'parallax' | 'qomraWeek' | 'featured' | 'events' | 'joinCta';
  enabled: boolean;
  data: {
    // Hero
    heroImage?: string;
    heroTitle?: { ar: string; en: string };
    heroSubtitle?: { ar: string; en: string };
    // Parallax
    parallaxImages?: string[];
    parallaxText?: { ar: string; en: string };
    // Qomra Week Banner
    editionNumber?: number;
    editionTitle?: { ar: string; en: string };
    editionDescription?: { ar: string; en: string };
    editionCoverImages?: string[];
    // Featured Works — references photo IDs or direct image URLs
    featuredLabel?: { ar: string; en: string };
    featuredImages?: Array<{
      image: string;
      title: { ar: string; en: string };
      photographer: { ar: string; en: string };
    }>;
    // Join CTA
    ctaTitle?: { ar: string; en: string };
    ctaDescription?: { ar: string; en: string };
    ctaButtonText?: { ar: string; en: string };
  };
  sortOrder: number;
}

const homepageSectionSchema = new Schema<IHomepageSection>(
  {
    section: {
      type: String,
      enum: ['hero', 'parallax', 'qomraWeek', 'featured', 'events', 'joinCta'],
      required: true,
      unique: true,
    },
    enabled: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HomepageSection = mongoose.model<IHomepageSection>('HomepageSection', homepageSectionSchema);
