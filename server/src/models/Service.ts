import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  member: mongoose.Types.ObjectId;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: string;
  portfolioImages: string[];
  priceRange: { ar: string; en: string };
  contactEmail: string;
  isAvailable: boolean;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const serviceSchema = new Schema<IService>(
  {
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    title: bilingualField,
    description: bilingualField,
    category: { type: String, default: 'photography' },
    portfolioImages: [{ type: String }],
    priceRange: bilingualField,
    contactEmail: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
