'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function HomeFeatured({ locale, data }: { locale: Locale; data?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const isAr = locale === 'ar';

  const apiPhotos = data?.featuredWorks || data?.featuredImages;
  const photos = apiPhotos && apiPhotos.length > 0
    ? apiPhotos.map((item: any) => ({ src: item.image }))
    : [];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const timer = setTimeout(() => {
      const totalScrollWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance = totalScrollWidth - viewportWidth;

      if (distance <= 0) return;

      const anim = gsap.to(track, {
        x: () => -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      triggerRef.current = anim.scrollTrigger || null;
    }, 100);

    return () => {
      clearTimeout(timer);
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: '100vh' }}
    >
      {/* Header bar — keeps the page's natural direction (RTL for Arabic) */}
      <div
        className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
      >
        <p className="text-accent text-xs tracking-[0.3em] uppercase">
          {data?.featuredLabel?.[locale] || (isAr ? 'أعمال مختارة' : 'Selected Works')}
        </p>
        <Link href={`/${locale}/gallery`} className="text-white/30 text-xs hover:text-accent transition-colors">
          {isAr ? '← عرض الكل' : 'View All →'}
        </Link>
      </div>

      {/* Scroll track — always LTR so images scroll left-to-right */}
      <div className="h-full flex items-center overflow-hidden" style={{ direction: 'ltr' }}>
        <div
          ref={trackRef}
          className="flex items-center gap-6"
          style={{ paddingLeft: '2rem', paddingRight: '50vw' }}
        >
          {photos.map((photo: { src: string }, i: number) => (
            <div key={i} className="shrink-0 group" style={{ width: '350px' }}>
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '3/4' }}>
                <img
                  src={photo.src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="transition-transform duration-700 group-hover:scale-105"
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="mt-3">
                <span className="text-[10px] text-white/20 tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
