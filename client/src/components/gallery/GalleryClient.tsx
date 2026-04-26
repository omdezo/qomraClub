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
    // Pull random photos from the Qomra Week pool — rotates daily
    api.get('/random-photos?count=40')
      .then(({ data }) => {
        const urls: string[] = (data || []).map((p: any) => p.imageUrl).filter(Boolean);

        // Hero: 3 images
        setHeroImages(urls.slice(0, 3));

        // Spotlight: 10 images (no names — display-only)
        setSpotlightItems(urls.slice(3, 13).map((u) => ({ image: u, name: '' })));

        // Grid: remaining (up to 16)
        setGridItems(urls.slice(13, 29).map((u) => ({ img: u, name: '', year: '' })));

        setReady(true);
      })
      .catch(() => setReady(true));
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
