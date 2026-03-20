'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Locale } from '@/types';
import { localizeNum } from '@/lib/utils';

interface GalleryHeroProps {
  locale: Locale;
  count?: number;
  previewImages?: string[];
}

export default function GalleryHero({ locale, count = 10, previewImages = [] }: GalleryHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);

  const img1 = previewImages[0];
  const img2 = previewImages[1];
  const img3 = previewImages[2];
  const hasImages = previewImages.length >= 3;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sectionRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(line1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0);
    tl.fromTo(titleRef.current, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.2);
    tl.fromTo(line2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0.3);
    tl.fromTo(counterRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.5);

    if (hasImages) {
      tl.fromTo(img1Ref.current,
        { y: 60, autoAlpha: 0, rotate: -6 },
        { y: 0, autoAlpha: 1, rotate: -6, duration: 1 }, 0.4);
      tl.fromTo(img2Ref.current,
        { y: 80, autoAlpha: 0, rotate: 4 },
        { y: 0, autoAlpha: 1, rotate: 4, duration: 1 }, 0.55);
      tl.fromTo(img3Ref.current,
        { y: 100, autoAlpha: 0, rotate: -3 },
        { y: 0, autoAlpha: 1, rotate: -3, duration: 1 }, 0.7);
    }

    tl.fromTo(scrollRef.current, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1);

    return () => { tl.kill(); };
  }, [hasImages]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#141414]"
      style={{ direction: 'ltr' }}
    >
      {hasImages && (
        <>
          <div
            ref={img1Ref}
            className="absolute rounded-lg overflow-hidden shadow-2xl invisible"
            style={{ width: '180px', height: '240px', top: '15%', left: '8%' }}
          >
            <img src={img1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div
            ref={img2Ref}
            className="absolute rounded-lg overflow-hidden shadow-2xl invisible"
            style={{ width: '160px', height: '200px', top: '20%', right: '10%' }}
          >
            <img src={img2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div
            ref={img3Ref}
            className="absolute rounded-lg overflow-hidden shadow-2xl invisible"
            style={{ width: '140px', height: '180px', bottom: '18%', right: '20%' }}
          >
            <img src={img3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </>
      )}

      <div ref={line1Ref} className="absolute top-[38%] left-[10%] right-[10%] h-[1px] bg-white/10 origin-left" />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          ref={titleRef}
          className="text-[clamp(3rem,10vw,9rem)] font-extralight leading-none tracking-tight text-white invisible"
          style={{ letterSpacing: '-0.04em' }}
        >
          {locale === 'ar' ? 'المعرض' : 'Gallery'}
        </h1>
      </div>

      <div ref={line2Ref} className="absolute top-[62%] left-[10%] right-[10%] h-[1px] bg-white/10 origin-right" />

      <div ref={counterRef} className="absolute bottom-12 left-12 invisible">
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-1">
          {locale === 'ar' ? 'مجموعة مختارة' : 'Selected Collection'}
        </p>
        <p className="text-white/60 text-sm font-light">
          {locale === 'ar' ? `${localizeNum(count, locale)} أعمال فوتوغرافية` : `${count} Photographic Works`}
        </p>
      </div>

      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 invisible">
        <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase">
          {locale === 'ar' ? 'مرر للاستكشاف' : 'Scroll to explore'}
        </p>
        <div className="w-[1px] h-10 relative overflow-hidden">
          <div className="w-full h-full bg-accent/60" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
