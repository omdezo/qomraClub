import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: { ar: string; en: string };
  tagline: { ar: string; en: string };
  aboutText: { ar: string; en: string };
  mission: { ar: string; en: string };
  logoUrl: string;
  heroImageUrl: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    youtube: string;
    tiktok: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    university: { ar: string; en: string };
  };
  announcementBar: {
    enabled: boolean;
    text: { ar: string; en: string };
    link: string;
  };
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { ar: { type: String, default: 'قمرة' }, en: { type: String, default: 'Qomra' } },
    tagline: bilingualField,
    aboutText: bilingualField,
    mission: bilingualField,
    logoUrl: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      university: bilingualField,
    },
    announcementBar: {
      enabled: { type: Boolean, default: false },
      text: bilingualField,
      link: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
