import mongoose, { Document, Schema } from 'mongoose';

export interface IQomraWeekPhoto extends Document {
  edition: mongoose.Types.ObjectId;
  editionNumber: number;
  title: { ar: string; en: string };
  photographerName: { ar: string; en: string };
  imageUrl: string;
  thumbnailUrl: string;
  blurDataUrl: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  isWinner: boolean;
  winnerPlace: number;
  sortOrder: number;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const qomraWeekPhotoSchema = new Schema<IQomraWeekPhoto>(
  {
    edition: { type: Schema.Types.ObjectId, ref: 'QomraWeekEdition', required: true },
    editionNumber: { type: Number, required: true },
    title: bilingualField,
    photographerName: bilingualField,
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    blurDataUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    isWinner: { type: Boolean, default: false },
    winnerPlace: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const QomraWeekPhoto = mongoose.model<IQomraWeekPhoto>('QomraWeekPhoto', qomraWeekPhotoSchema);
