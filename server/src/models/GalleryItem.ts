import mongoose, { Document, Schema } from 'mongoose';

export interface IGalleryItem extends Document {
  image: string;
  cloudinaryPublicId: string;
  name: { ar: string; en: string };
  year: number;
  section: 'spotlight' | 'grid' | 'hero-preview';
  sortOrder: number;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    image: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
    name: bilingualField,
    year: { type: Number, default: new Date().getFullYear() },
    section: { type: String, enum: ['spotlight', 'grid', 'hero-preview'], required: true },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);
