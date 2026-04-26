'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Locale } from '@/types';
import GalleryHero from '@/components/gallery/GalleryHero';
import SpotlightGallery from '@/components/animations/SpotlightGallery';
import ExpandingGrid from '@/components/animations/ExpandingGrid';
import { useImageProtection } from '@/hooks/useImageProtection';

interface GalleryClientProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function GalleryClient({ locale, dict }: GalleryClientProps) {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [spotlightItems, setSpotlightItems] = useState<{ image: string; name: string }[]>([]);
  const [gridItems, setGridItems] = useState<{ name: string; year: number | string; img: string }[]>([]);
  const [ready, setReady] = useState(false);

  useImageProtection();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/gallery-items?section=hero-preview').catch(() => ({ data: [] })),
      api.get('/gallery-items?section=spotlight').catch(() => ({ data: [] })),
      api.get('/gallery-items?section=grid').catch(() => ({ data: [] })),
    ]).then(([heroRes, spotRes, gridRes]) => {
      // Hero preview images
      const heroData = heroRes.data;
      setHeroImages(heroData.length > 0
        ? heroData.map((item: any) => item.image)
        : []
      );

      // Spotlight
      const spotData = spotRes.data;
      setSpotlightItems(spotData.map((item: any) => ({
        image: item.image,
        name: locale === 'ar' ? item.name.ar : item.name.en,
      })));

      // Grid
      const gData = gridRes.data;
      setGridItems(gData.map((item: any) => ({
        img: item.image,
        name: locale === 'ar' ? item.name.ar : item.name.en,
        year: item.year,
      })));

      setReady(true);
    });
  }, [locale]);

  if (!ready) {
    return (
      <div className="bg-[#141414] h-screen flex items-center justify-center">
        <div className="text-white/30 animate-pulse">
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414]">
      <GalleryHero
        locale={locale}
        count={spotlightItems.length}
        previewImages={heroImages}
      />

      {spotlightItems.length > 0 && (
        <SpotlightGallery
          items={spotlightItems}
          rtl={locale === 'ar'}
        />
      )}

      {gridItems.length > 0 && (
        <>
          <section className="h-[50vh] flex items-center justify-center bg-[#141414]">
            <p className="text-xl md:text-2xl text-white/40 font-light tracking-wide">
              {locale === 'ar' ? 'المزيد من الأعمال' : 'More Works'}
            </p>
          </section>

          <ExpandingGrid items={gridItems} locale={locale} />
        </>
      )}

      <section className="h-screen flex items-center justify-center bg-[#141414]">
        <p className="text-xl md:text-2xl text-white/40 font-light tracking-wide">
          {locale === 'ar' ? 'نهاية المعرض' : 'End of Gallery'}
        </p>
      </section>
    </div>
  );
}
