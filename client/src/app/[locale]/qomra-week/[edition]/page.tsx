'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, QomraWeekEdition, QomraWeekPhoto, PaginatedResponse } from '@/types';
import ScrollGallery from '@/components/animations/ScrollGallery';
import Badge from '@/components/ui/Badge';

export default function QomraWeekEditionPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const editionNum = params?.edition as string;
  const [edition, setEdition] = useState<QomraWeekEdition | null>(null);
  const [photos, setPhotos] = useState<QomraWeekPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edRes, phRes] = await Promise.all([
          api.get(`/qomra-week/editions/${editionNum}`),
          api.get<PaginatedResponse<QomraWeekPhoto>>(`/qomra-week/editions/${editionNum}/photos`, { params: { limit: 50 } }),
        ]);
        setEdition(edRes.data);
        setPhotos(phRes.data.data);
      } catch {
        // API not connected yet
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editionNum]);

  return (
    <div className="pt-20 min-h-screen">
      {/* Edition header */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="accent" className="mb-4">
            {locale === 'ar' ? `الإصدار ${editionNum}` : `Edition ${editionNum}`}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {edition ? getBilingual(edition.title, locale) : `${locale === 'ar' ? 'أسبوع قمرة' : 'Qomra Week'} ${editionNum}`}
          </h1>
          {edition?.theme && (
            <p className="text-lg text-white/50">
              {locale === 'ar' ? 'الموضوع: ' : 'Theme: '}
              {getBilingual(edition.theme, locale)}
            </p>
          )}
          {edition && (
            <div className="flex justify-center gap-8 mt-8 text-sm text-white/40">
              {edition.totalParticipants > 0 && (
                <div>
                  <span className="text-2xl font-bold text-accent block">{edition.totalParticipants}</span>
                  {locale === 'ar' ? 'مشارك' : 'Participants'}
                </div>
              )}
              {edition.totalPhotos > 0 && (
                <div>
                  <span className="text-2xl font-bold text-accent block">{edition.totalPhotos}</span>
                  {locale === 'ar' ? 'صورة' : 'Photos'}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Scroll Gallery */}
      {photos.length > 0 ? (
        <ScrollGallery photos={photos} locale={locale} />
      ) : (
        <div className="text-center text-white/50 py-20">
          {loading
            ? (locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
            : (locale === 'ar' ? 'لم تتم إضافة صور بعد' : 'No photos added yet')}
        </div>
      )}
    </div>
  );
}
