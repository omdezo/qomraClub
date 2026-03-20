import mongoose, { Document, Schema } from 'mongoose';

export interface IQomraWeekEdition extends Document {
  editionNumber: number;
  title: { ar: string; en: string };
  theme: { ar: string; en: string };
  description: { ar: string; en: string };
  year: number;
  startDate: Date;
  endDate: Date;
  coverImageUrl: string;
  totalParticipants: number;
  totalPhotos: number;
  winners: Array<{
    place: number;
    name: { ar: string; en: string };
    photoId?: mongoose.Types.ObjectId;
    prize: { ar: string; en: string };
  }>;
  judges: Array<{ name: { ar: string; en: string }; title: { ar: string; en: string } }>;
  isCurrent: boolean;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const editionSchema = new Schema<IQomraWeekEdition>(
  {
    editionNumber: { type: Number, required: true, unique: true },
    title: bilingualField,
    theme: bilingualField,
    description: bilingualField,
    year: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    coverImageUrl: { type: String, default: '' },
    totalParticipants: { type: Number, default: 0 },
    totalPhotos: { type: Number, default: 0 },
    winners: [
      {
        place: Number,
        name: bilingualField,
        photoId: { type: Schema.Types.ObjectId, ref: 'QomraWeekPhoto' },
        prize: bilingualField,
      },
    ],
    judges: [{ name: bilingualField, title: bilingualField }],
    isCurrent: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const QomraWeekEdition = mongoose.model<IQomraWeekEdition>('QomraWeekEdition', editionSchema);
