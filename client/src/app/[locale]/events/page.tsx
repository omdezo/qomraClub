'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getBilingual, formatDate } from '@/lib/utils';
import type { Locale, Event, PaginatedResponse } from '@/types';
import Badge from '@/components/ui/Badge';

const typeColors: Record<string, string> = {
  exhibition: 'text-yellow-400 bg-yellow-400/10',
  workshop: 'text-blue-400 bg-blue-400/10',
  trip: 'text-green-400 bg-green-400/10',
  meetup: 'text-purple-400 bg-purple-400/10',
  competition: 'text-accent bg-accent/10',
};

export default function EventsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const typeLabels: Record<string, Record<string, string>> = {
    exhibition: { ar: 'معرض', en: 'Exhibition' },
    workshop: { ar: 'ورشة عمل', en: 'Workshop' },
    trip: { ar: 'رحلة تصوير', en: 'Trip' },
    meetup: { ar: 'لقاء', en: 'Meetup' },
    competition: { ar: 'مسابقة', en: 'Competition' },
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const endpoint = tab === 'upcoming' ? '/events/upcoming' : '/events';
        const { data } = await api.get(endpoint, { params: { limit: 20 } });
        setEvents(Array.isArray(data) ? data : data.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [tab]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          {locale === 'ar' ? 'الفعاليات' : 'Events'}
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-accent text-primary'
                  : 'bg-secondary text-white/60 hover:text-white'
              }`}
            >
              {t === 'upcoming' ? (locale === 'ar' ? 'القادمة' : 'Upcoming') : (locale === 'ar' ? 'السابقة' : 'Past')}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {locale === 'ar' ? 'لا توجد فعاليات' : 'No events found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/${locale}/events/${getBilingual(event.slug, locale) || event._id}`}
                className="group bg-secondary rounded-xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all"
              >
                <div className="aspect-video relative bg-elevated overflow-hidden">
                  {event.coverImageUrl ? (
                    <Image src={event.coverImageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl">
                      {typeLabels[event.type]?.[locale]}
                    </div>
                  )}
                  <div className="absolute top-3 start-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[event.type] || 'text-white/70 bg-white/10'}`}>
                      {typeLabels[event.type]?.[locale] || event.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    {getBilingual(event.title, locale)}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-2 mb-3">
                    {getBilingual(event.description, locale)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{formatDate(event.date, locale)}</span>
                    {(event.location.ar || event.location.en) && (
                      <span>• {getBilingual(event.location, locale)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
