'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Locale } from '@/types';
import CinematicHero from '@/components/animations/CinematicHero';
import ParallaxColumns from '@/components/animations/ParallaxColumns';
import HomeQomraWeek from '@/components/home/HomeQomraWeek';
import HomeFeatured from '@/components/home/HomeFeatured';
import HomeEvents from '@/components/home/HomeEvents';
import HomeJoin from '@/components/home/HomeJoin';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import HomePartners from '@/components/home/HomePartners';
import arDict from '@/dictionaries/ar.json';
import enDict from '@/dictionaries/en.json';

interface Section {
  section: string;
  enabled: boolean;
  data: any;
}

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const dict = locale === 'ar' ? arDict : enDict;
  const [sections, setSections] = useState<Section[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/homepage').catch(() => ({ data: [] })),
      api.get('/random-photos?count=40').catch(() => ({ data: [] })),
    ]).then(([secRes, photoRes]) => {
      setSections(secRes.data || []);
      const urls = (photoRes.data || []).map((p: any) => p.imageUrl).filter(Boolean);
      setPhotos(urls);
      setLoaded(true);
    });
  }, []);

  const getSection = (name: string) => sections.find((s) => s.section === name);

  const hero = getSection('hero');
  const qomraWeek = getSection('qomraWeek');
  const featured = getSection('featured');
  const events = getSection('events');
  const joinCta = getSection('joinCta');

  // Slice the random photos pool into the sections that need images
  const heroImg = photos[0] || hero?.data?.heroImage || '';
  const parallaxImages = photos.slice(1, 17); // 16 images
  const qomraWeekPreviews = photos.slice(17, 20); // 3 images
  const featuredImages = photos.slice(20, 28); // 8 images

  // Override section data with random photos
  const qomraWeekData = qomraWeek?.data ? {
    ...qomraWeek.data,
    editionCoverImages: qomraWeekPreviews.length ? qomraWeekPreviews : qomraWeek.data.editionCoverImages,
    previewImages: qomraWeekPreviews.length ? qomraWeekPreviews : qomraWeek.data.previewImages,
  } : { previewImages: qomraWeekPreviews };

  const featuredData = featured?.data ? {
    ...featured.data,
    featuredWorks: featuredImages.length
      ? featuredImages.map((img) => ({
          image: img,
          title: { ar: '', en: '' },
          photographer: { ar: '', en: '' },
        }))
      : featured.data.featuredWorks,
  } : {
    featuredWorks: featuredImages.map((img) => ({
      image: img,
      title: { ar: '', en: '' },
      photographer: { ar: '', en: '' },
    })),
  };

  return (
    <>
      <CinematicHero
        locale={locale}
        dict={{
          home: {
            heroTitle: hero?.data?.heroTitle?.[locale] || (locale === 'ar' ? 'قمرة — حيث تتحول اللحظات إلى فن خالد' : 'Qomra — Where moments become timeless art'),
            heroSubtitle: hero?.data?.heroSubtitle?.[locale] || (locale === 'ar' ? 'جماعة التصوير الفوتوغرافي — نلتقط ما لا يُرى ونروي ما لا يُقال' : 'The photography collective — we capture the unseen and tell the untold'),
          },
        }}
        heroImage={heroImg}
      />

      {parallaxImages.length > 0 && (
        <ParallaxColumns
          images={parallaxImages}
          centerText={
            locale === 'ar'
              ? 'لحظات من الحركة والأجواء تجتمع في مجموعة هادئة من اللقطات البصرية'
              : 'Fragments of motion and atmosphere gathered into a drifting collection of quiet visual moments'
          }
        />
      )}

      {(!loaded || qomraWeek?.enabled !== false) && (
        <HomeQomraWeek locale={locale} data={qomraWeekData} />
      )}

      {(!loaded || featured?.enabled !== false) && (
        <HomeFeatured locale={locale} data={featuredData} />
      )}

      {(!loaded || events?.enabled !== false) && (
        <HomeEvents locale={locale} />
      )}

      <HomeTestimonials locale={locale} dict={dict} />

      <HomePartners locale={locale} dict={dict} />

      {(!loaded || joinCta?.enabled !== false) && (
        <HomeJoin locale={locale} data={joinCta?.data} />
      )}
    </>
  );
}
