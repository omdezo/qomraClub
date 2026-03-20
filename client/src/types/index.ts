export type Locale = 'ar' | 'en';

export interface Bilingual {
  ar: string;
  en: string;
}

export interface Photo {
  _id: string;
  title: Bilingual;
  description: Bilingual;
  photographerName: Bilingual;
  imageUrl: string;
  thumbnailUrl: string;
  blurDataUrl: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  isPublished: boolean;
}

export interface Member {
  _id: string;
  name: Bilingual;
  role: Bilingual;
  bio: Bilingual;
  avatarUrl: string;
  specialties: string[];
  socialLinks: { instagram?: string; twitter?: string; website?: string };
  isBoardMember: boolean;
  boardPosition: number;
  sortOrder: number;
  isPublished: boolean;
}

export interface QomraWeekEdition {
  _id: string;
  editionNumber: number;
  title: Bilingual;
  theme: Bilingual;
  description: Bilingual;
  year: number;
  startDate: string;
  endDate: string;
  coverImageUrl: string;
  totalParticipants: number;
  totalPhotos: number;
  winners: Array<{
    place: number;
    name: Bilingual;
    photoId?: string;
    prize: Bilingual;
  }>;
  judges: Array<{ name: Bilingual; title: Bilingual }>;
  isCurrent: boolean;
  isPublished: boolean;
}

export interface QomraWeekPhoto {
  _id: string;
  edition: string;
  editionNumber: number;
  title: Bilingual;
  photographerName: Bilingual;
  imageUrl: string;
  thumbnailUrl: string;
  blurDataUrl: string;
  width: number;
  height: number;
  isWinner: boolean;
  winnerPlace: number;
  sortOrder: number;
  isPublished: boolean;
}

export interface Event {
  _id: string;
  title: Bilingual;
  slug: Bilingual;
  description: Bilingual;
  content: Bilingual;
  type: 'exhibition' | 'workshop' | 'trip' | 'meetup' | 'competition';
  coverImageUrl: string;
  galleryImages: string[];
  date: string;
  location: Bilingual;
  isPublished: boolean;
}

export interface Service {
  _id: string;
  member: Member | string;
  title: Bilingual;
  description: Bilingual;
  category: string;
  portfolioImages: string[];
  priceRange: Bilingual;
  contactEmail: string;
  isAvailable: boolean;
  isPublished: boolean;
}

export interface Article {
  _id: string;
  title: Bilingual;
  slug: Bilingual;
  content: Bilingual;
  excerpt: Bilingual;
  author: Member | string;
  coverImageUrl: string;
  category: 'tutorial' | 'tip' | 'review' | 'technique';
  tags: string[];
  readTime: number;
  isPublished: boolean;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'general' | 'membership' | 'service-request' | 'sponsorship';
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface SiteSettings {
  _id: string;
  siteName: Bilingual;
  tagline: Bilingual;
  aboutText: Bilingual;
  mission: Bilingual;
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
    university: Bilingual;
  };
  announcementBar: {
    enabled: boolean;
    text: Bilingual;
    link: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AdminStats {
  photos: number;
  members: number;
  events: number;
  editions: number;
  articles: number;
  services: number;
  unreadMessages: number;
}
