import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: { ar: string; en: string };
  slug: { ar: string; en: string };
  content: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  author: mongoose.Types.ObjectId;
  coverImageUrl: string;
  category: 'tutorial' | 'tip' | 'review' | 'technique';
  tags: string[];
  readTime: number;
  isPublished: boolean;
}

const bilingualField = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const articleSchema = new Schema<IArticle>(
  {
    title: bilingualField,
    slug: bilingualField,
    content: bilingualField,
    excerpt: bilingualField,
    author: { type: Schema.Types.ObjectId, ref: 'Member' },
    coverImageUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['tutorial', 'tip', 'review', 'technique'],
      default: 'tutorial',
    },
    tags: [{ type: String }],
    readTime: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>('Article', articleSchema);
