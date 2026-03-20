'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function HomeJoin({ locale, data }: { locale: Locale; data?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const a = gsap.fromTo(line,
      { scaleX: 0 },
      { scaleX: 1, ease: 'power3.out', duration: 1.5,
        scrollTrigger: { trigger: section, start: 'top 70%' }
      }
    );
    const trigger = a.scrollTrigger;

    return () => { trigger?.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="py-40 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
        <p className="text-accent text-xs tracking-[0.3em] uppercase mb-8">
          {locale === 'ar' ? 'انضم إلينا' : 'Join Us'}
        </p>
        <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-light leading-[1.05] mb-6" style={{ letterSpacing: '-0.04em' }}>
          {data?.ctaTitle?.[locale] || (locale === 'ar' ? 'كن جزءاً من الصورة' : 'Be part of the frame')}
        </h2>
        <div ref={lineRef} className="w-24 h-[1px] bg-accent mx-auto mb-8 origin-left" />
        <p className="text-white/30 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          {data?.ctaDescription?.[locale] || (locale === 'ar'
            ? 'انضم إلى مجتمع قمرة واكتشف فن التصوير مع مبدعين يشاركونك الشغف'
            : 'Join the Qomra community and discover photography with creators who share your passion')}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block px-10 py-4 border border-accent text-accent text-lg font-light hover:bg-accent hover:text-[#0a0a0a] transition-all duration-300"
        >
          {data?.ctaButtonText?.[locale] || (locale === 'ar' ? 'تواصل معنا' : 'Get in Touch')}
        </Link>
      </div>
    </section>
  );
}
