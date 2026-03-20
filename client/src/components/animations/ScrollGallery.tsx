'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/types';
import { localizeNum } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollPhoto {
  _id: string;
  imageUrl: string;
  thumbnailUrl: string;
  blurDataUrl?: string;
  title: { ar: string; en: string };
  photographerName: { ar: string; en: string };
  width: number;
  height: number;
}

interface ScrollGalleryProps {
  photos: ScrollPhoto[];
  locale: Locale;
}

export default function ScrollGallery({ photos, locale }: ScrollGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const photosRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const total = photos.length;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    if (!section || total === 0) return;

    photosRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.1 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${total * 100}%`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const newIndex = Math.min(
            Math.floor(self.progress * total),
            total - 1
          );
          setCurrentIndex(newIndex);
        },
      },
    });

    for (let i = 0; i < total - 1; i++) {
      const current = photosRef.current[i];
      const next = photosRef.current[i + 1];
      if (!current || !next) continue;

      tl.to(current, { opacity: 0, scale: 0.95, duration: 0.5 })
        .to(next, { opacity: 1, scale: 1, duration: 0.5 }, '<');
    }

    triggerRef.current = tl.scrollTrigger || null;

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [total]);

  if (total === 0) return null;

  const currentPhoto = photos[currentIndex];
  const pad = (n: number) => localizeNum(String(n + 1).padStart(2, '0'), locale);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-secondary"
    >
      {photos.map((photo, i) => (
        <div
          key={photo._id || i}
          ref={(el) => { photosRef.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-[80vw] h-[70vh] max-w-5xl">
            {/* Use native img to avoid next/image domain restrictions */}
            <img
              src={photo.imageUrl}
              alt={locale === 'ar' ? photo.title.ar : photo.title.en}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          </div>
        </div>
      ))}

      {/* Counter */}
      <div className="absolute top-8 right-8 z-10 font-dialogue">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-white tabular-nums">
            {pad(currentIndex)}
          </span>
          <span className="text-lg text-white/30">/{pad(total - 1)}</span>
        </div>
      </div>

      {/* Photo info */}
      <div className="absolute bottom-12 left-8 right-8 z-10 flex items-end justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            {locale === 'ar' ? currentPhoto?.title.ar : currentPhoto?.title.en}
          </h3>
          <p className="text-sm text-accent">
            {locale === 'ar'
              ? currentPhoto?.photographerName.ar
              : currentPhoto?.photographerName.en}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </section>
  );
}
