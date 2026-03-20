'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function HomeQomraWeek({ locale, data }: { locale: Locale; data?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const a1 = gsap.fromTo(numberRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' }
      }
    );

    const a2 = gsap.fromTo(textRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' }
      }
    );

    if (a1.scrollTrigger) triggersRef.current.push(a1.scrollTrigger);
    if (a2.scrollTrigger) triggersRef.current.push(a2.scrollTrigger);

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#0a0a0a] flex items-center overflow-hidden">
      {/* Giant number background */}
      <span
        ref={numberRef}
        className="absolute -left-10 md:left-10 top-1/2 -translate-y-1/2 text-[clamp(15rem,35vw,40rem)] font-bold leading-none text-white/[0.03] select-none pointer-events-none"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {data?.editionNumber || 11}
      </span>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: editorial text */}
          <div ref={textRef}>
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-6">
              {locale === 'ar' ? 'المسابقة السنوية' : 'Annual Competition'}
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.05] mb-8" style={{ letterSpacing: '-0.03em' }}>
              {data?.editionTitle?.[locale] || (locale === 'ar' ? 'أسبوع قمرة' : 'Qomra Week')}
              <br />
              <span className="text-accent font-normal">
                {locale === 'ar' ? 'الإصدار الحادي عشر' : 'Eleventh Edition'}
              </span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-md">
              {locale === 'ar'
                ? 'أسبوع كامل من الإبداع البصري. مسابقة التصوير الأبرز في الجامعة حيث تتنافس العدسات وتتحدث الصور.'
                : 'A full week of visual creativity. The university\'s premier photography competition where lenses compete and images speak.'}
            </p>
            <Link
              href={`/${locale}/qomra-week`}
              className="group inline-flex items-center gap-4 text-white hover:text-accent transition-colors"
            >
              <span className="text-lg font-light">
                {locale === 'ar' ? 'استكشف الإصدارات' : 'Explore Editions'}
              </span>
              <span className="w-12 h-[1px] bg-current group-hover:w-20 transition-all duration-300" />
            </Link>
          </div>

          {/* Right: stacked preview images */}
          <div className="relative h-[500px] hidden md:block">
            {(data?.previewImages || []).slice(0, 3).map((src: string, i: number) => (
              <div
                key={i}
                className="absolute rounded-lg overflow-hidden shadow-2xl"
                style={{
                  width: '280px',
                  height: '200px',
                  top: `${i * 80 + 40}px`,
                  right: `${i * 40}px`,
                  transform: `rotate(${(i - 1) * 3}deg)`,
                  zIndex: 3 - i,
                }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
