import mongoose, { Document, Schema } from 'mongoose';

export interface IMember extends Document {
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  bio: { ar: string; en: string };
  avatarUrl: string;
  specialties: string[];
  socialLinks: { instagram?: string; twitter?: string; website?: string };
  isBoardMember: boolean;
  boardPosition: number;
  sortOrder: number;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const memberSchema = new Schema<IMember>(
  {
    name: bilingualField,
    role: bilingualField,
    bio: bilingualField,
    avatarUrl: { type: String, default: '' },
    specialties: [{ type: String }],
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    isBoardMember: { type: Boolean, default: false },
    boardPosition: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Member = mongoose.model<IMember>('Member', memberSchema);
