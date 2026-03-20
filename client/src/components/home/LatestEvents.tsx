'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { getBilingual, formatDate } from '@/lib/utils';
import type { Locale, Event } from '@/types';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

interface LatestEventsProps {
  locale: Locale;
  dict: Record<string, any>;
}

const typeColors: Record<string, string> = {
  exhibition: 'text-yellow-400 bg-yellow-400/10',
  workshop: 'text-blue-400 bg-blue-400/10',
  trip: 'text-green-400 bg-green-400/10',
  meetup: 'text-purple-400 bg-purple-400/10',
  competition: 'text-accent bg-accent/10',
};

export default function LatestEvents({ locale, dict }: LatestEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/events/upcoming')
      .then(({ data }) => setEvents(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold">{dict.home.latestEvents}</h2>
          </FadeInOnScroll>
          <Link
            href={`/${locale}/events`}
            className="text-accent hover:text-accent-hover transition-colors text-sm"
          >
            {dict.home.viewAll} →
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <FadeInOnScroll key={event._id} delay={i * 0.1}>
                <Link
                  href={`/${locale}/events/${getBilingual(event.slug, locale) || event._id}`}
                  className="group bg-secondary rounded-xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all block"
                >
                  <div className="aspect-video relative bg-elevated overflow-hidden">
                    {event.coverImageUrl ? (
                      <Image src={event.coverImageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-elevated" />
                    )}
                    <div className="absolute top-3 start-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[event.type] || 'text-white/70 bg-white/10'}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                      {getBilingual(event.title, locale)}
                    </h3>
                    <p className="text-xs text-white/40">{formatDate(event.date, locale)}</p>
                  </div>
                </Link>
              </FadeInOnScroll>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-secondary rounded-xl border border-white/5" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
