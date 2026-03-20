'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { getBilingual, formatDate } from '@/lib/utils';
import type { Locale, Event } from '@/types';
import Badge from '@/components/ui/Badge';

export default function EventDetailPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const slug = params?.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${slug}`);
        setEvent(data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-white/50">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{locale === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}</h2>
          <Link href={`/${locale}/events`} className="text-accent hover:underline">
            {locale === 'ar' ? 'العودة للفعاليات' : 'Back to Events'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Cover */}
      {event.coverImageUrl && (
        <div className="relative h-[50vh] bg-secondary">
          <Image src={event.coverImageUrl} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 -mt-20 relative z-10">
        <Badge variant="accent">{event.type}</Badge>
        <h1 className="text-4xl font-bold mt-4 mb-3">{getBilingual(event.title, locale)}</h1>
        <div className="flex items-center gap-4 text-sm text-white/50 mb-8">
          <span>{formatDate(event.date, locale)}</span>
          {(event.location.ar || event.location.en) && (
            <span>• {getBilingual(event.location, locale)}</span>
          )}
        </div>

        <div
          className="prose prose-invert max-w-none text-white/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: getBilingual(event.content, locale) || getBilingual(event.description, locale) }}
        />

        {/* Gallery */}
        {event.galleryImages && event.galleryImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{locale === 'ar' ? 'صور الفعالية' : 'Event Photos'}</h2>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {event.galleryImages.map((img, i) => (
                <div key={i} className="break-inside-avoid rounded-lg overflow-hidden">
                  <Image src={img} alt="" width={600} height={400} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
