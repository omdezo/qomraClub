'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '@/lib/api';
import { getBilingual, formatDate, localizeNum } from '@/lib/utils';
import type { Locale, Event } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function HomeEvents({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/events/upcoming').then(({ data }) => {
      setEvents(Array.isArray(data) ? data.slice(0, 3) : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];
    const items = section.querySelectorAll('[data-event-card]');
    items.forEach((item, i) => {
      const a = gsap.fromTo(item,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%' }
        }
      );
      if (a.scrollTrigger) triggers.push(a.scrollTrigger);
    });

    return () => { triggers.forEach(t => t.kill()); };
  }, [events]);

  return (
    <section ref={sectionRef} className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">
              {locale === 'ar' ? 'ما الجديد' : "What's New"}
            </p>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-light" style={{ letterSpacing: '-0.03em' }}>
              {locale === 'ar' ? 'الفعاليات' : 'Events'}
            </h2>
          </div>
          <Link href={`/${locale}/events`} className="text-white/40 hover:text-accent text-sm transition-colors hidden md:block">
            {locale === 'ar' ? 'عرض الكل \u2192' : 'View All \u2192'}
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <Link
                key={event._id}
                href={`/${locale}/events/${getBilingual(event.slug, locale) || event._id}`}
                data-event-card
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-secondary mb-4">
                  {event.coverImageUrl ? (
                    <img src={event.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-elevated flex items-center justify-center">
                      <span className="text-6xl font-light text-white/5">{localizeNum(String(i + 1).padStart(2, '0'), locale)}</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-accent tracking-[0.2em] uppercase mb-2">{event.type}</p>
                <h3 className="text-lg font-light group-hover:text-accent transition-colors mb-1">
                  {getBilingual(event.title, locale)}
                </h3>
                <p className="text-sm text-white/30">{formatDate(event.date, locale)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} data-event-card>
                <div className="aspect-[4/3] bg-secondary rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-elevated flex items-center justify-center">
                    <span className="text-6xl font-light text-white/5">{localizeNum(String(i).padStart(2, '0'), locale)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-2">
                  {locale === 'ar' ? 'قريبا\u064B' : 'Coming Soon'}
                </p>
                <div className="h-5 w-48 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
