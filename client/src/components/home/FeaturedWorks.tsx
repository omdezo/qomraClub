'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, Photo, PaginatedResponse } from '@/types';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

interface FeaturedWorksProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function FeaturedWorks({ locale, dict }: FeaturedWorksProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    api.get<PaginatedResponse<Photo>>('/photos', { params: { featured: 'true', limit: 8 } })
      .then(({ data }) => setPhotos(data.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold">{dict.home.featuredWorks}</h2>
          </FadeInOnScroll>
          <Link
            href={`/${locale}/gallery`}
            className="text-accent hover:text-accent-hover transition-colors text-sm"
          >
            {dict.home.viewAll} →
          </Link>
        </div>

        {photos.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <FadeInOnScroll key={photo._id} delay={i * 0.05}>
                <div className="break-inside-avoid group relative overflow-hidden rounded-lg">
                  <Image
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={getBilingual(photo.title, locale)}
                    width={photo.width || 400}
                    height={photo.height || 500}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    placeholder={photo.blurDataUrl ? 'blur' : 'empty'}
                    blurDataURL={photo.blurDataUrl}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm text-accent">{getBilingual(photo.photographerName, locale)}</p>
                      <p className="text-xs text-white/70">{getBilingual(photo.title, locale)}</p>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-elevated rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-elevated to-secondary" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
