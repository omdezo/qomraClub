import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  photographerName: { ar: string; en: string };
  imageUrl: string;
  thumbnailUrl: string;
  blurDataUrl: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const photoSchema = new Schema<IPhoto>(
  {
    title: bilingualField,
    description: bilingualField,
    photographerName: bilingualField,
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    blurDataUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    category: { type: String, default: 'general' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Photo = mongoose.model<IPhoto>('Photo', photoSchema);
