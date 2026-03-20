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

interface Section {
  section: string;
  enabled: boolean;
  data: any;
}

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [sections, setSections] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/homepage')
      .then(({ data }) => setSections(data))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const getSection = (name: string) => sections.find((s) => s.section === name);

  const hero = getSection('hero');
  const parallax = getSection('parallax');
  const qomraWeek = getSection('qomraWeek');
  const featured = getSection('featured');
  const events = getSection('events');
  const joinCta = getSection('joinCta');

  return (
    <>
      {/* Hero — always show, use API data if available */}
      <CinematicHero
        locale={locale}
        dict={{
          home: {
            heroTitle: hero?.data?.heroTitle?.[locale] || (locale === 'ar' ? 'قمرة — حيث تتحول اللحظات إلى فن خالد' : 'Qomra — Where moments become timeless art'),
            heroSubtitle: hero?.data?.heroSubtitle?.[locale] || (locale === 'ar' ? 'جماعة التصوير الفوتوغرافي — نلتقط ما لا يُرى ونروي ما لا يُقال' : 'The photography collective — we capture the unseen and tell the untold'),
          },
        }}
        heroImage={hero?.data?.heroImage}
      />

      {/* Parallax Columns */}
      {(!loaded || parallax?.enabled !== false) && (
        <ParallaxColumns
          images={parallax?.data?.parallaxImages}
          centerText={parallax?.data?.parallaxText?.[locale] || (locale === 'ar'
            ? 'لحظات من الحركة والأجواء تجتمع في مجموعة هادئة من اللقطات البصرية'
            : 'Fragments of motion and atmosphere gathered into a drifting collection of quiet visual moments')}
        />
      )}

      {/* Qomra Week Banner */}
      {(!loaded || qomraWeek?.enabled !== false) && (
        <HomeQomraWeek locale={locale} data={qomraWeek?.data} />
      )}

      {/* Featured Works */}
      {(!loaded || featured?.enabled !== false) && (
        <HomeFeatured locale={locale} data={featured?.data} />
      )}

      {/* Events */}
      {(!loaded || events?.enabled !== false) && (
        <HomeEvents locale={locale} />
      )}

      {/* Join CTA */}
      {(!loaded || joinCta?.enabled !== false) && (
        <HomeJoin locale={locale} data={joinCta?.data} />
      )}
    </>
  );
}
