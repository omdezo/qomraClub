import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: { ar: string; en: string };
  slug: { ar: string; en: string };
  description: { ar: string; en: string };
  content: { ar: string; en: string };
  type: 'exhibition' | 'workshop' | 'trip' | 'meetup' | 'competition';
  coverImageUrl: string;
  galleryImages: string[];
  date: Date;
  location: { ar: string; en: string };
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const eventSchema = new Schema<IEvent>(
  {
    title: bilingualField,
    slug: bilingualField,
    description: bilingualField,
    content: bilingualField,
    type: {
      type: String,
      enum: ['exhibition', 'workshop', 'trip', 'meetup', 'competition'],
      default: 'meetup',
    },
    coverImageUrl: { type: String, default: '' },
    galleryImages: [{ type: String }],
    date: { type: Date, required: true },
    location: bilingualField,
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
