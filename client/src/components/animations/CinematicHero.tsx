'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import type { Locale } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroProps {
  locale: Locale;
  dict: Record<string, any>;
  heroImage?: string;
}

export default function CinematicHero({ locale, dict, heroImage }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const splitRef = useRef<SplitType | null>(null);
  const isHeroCopyHidden = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const heroImg = section.querySelector('.hero-img') as HTMLElement;
    const heroHeader = section.querySelector('.hero-header') as HTMLElement;
    const heroCopyH3 = section.querySelector('.hero-copy h3') as HTMLElement;
    if (!heroImg || !heroHeader || !heroCopyH3) return;

    // Split the copy h3 into words — exactly like SplitText.create(".hero-copy h3", { type: "words", wordsClass: "word" })
    const split = new SplitType(heroCopyH3, { types: 'words' });
    splitRef.current = split;
    const words = (split.words || []) as HTMLElement[];

    // Words start with opacity 0 (set via CSS class .word, but also enforce here)
    words.forEach((w) => {
      w.style.opacity = '0';
      w.style.display = 'inline-block';
    });

    triggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${window.innerHeight * 3.5}px`,
      pin: true,
      pinSpacing: false,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // 0% → 29%: hero-header slides up
        const heroHeaderProgress = Math.min(progress / 0.29, 1);
        gsap.set(heroHeader, { yPercent: -heroHeaderProgress * 100 });

        // 29% → 50%: words fade in one by one
        const heroWordsProgress = Math.max(0, Math.min((progress - 0.29) / 0.21, 1));
        const totalWords = words.length;
        words.forEach((word, i) => {
          const wordStart = i / totalWords;
          const wordEnd = (i + 1) / totalWords;
          const wordOpacity = Math.max(
            0,
            Math.min((heroWordsProgress - wordStart) / (wordEnd - wordStart), 1)
          );
          gsap.set(word, { opacity: wordOpacity });
        });

        // 64%: hide copy
        if (progress > 0.64 && !isHeroCopyHidden.current) {
          isHeroCopyHidden.current = true;
          gsap.to(heroCopyH3, { opacity: 0, duration: 0.2 });
        } else if (progress <= 0.64 && isHeroCopyHidden.current) {
          isHeroCopyHidden.current = false;
          gsap.to(heroCopyH3, { opacity: 1, duration: 0.2 });
        }

        // 71% → 100%: image shrinks from full viewport to 150x150
        const heroImgProgress = Math.max(0, Math.min((progress - 0.71) / 0.29, 1));
        const heroImgWidth = gsap.utils.interpolate(window.innerWidth, 150, heroImgProgress);
        const heroImgHeight = gsap.utils.interpolate(window.innerHeight, 150, heroImgProgress);
        const heroImgBorderRadius = gsap.utils.interpolate(0, 10, heroImgProgress);
        gsap.set(heroImg, {
          width: heroImgWidth,
          height: heroImgHeight,
          borderRadius: heroImgBorderRadius,
        });
      },
    });

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
      try { splitRef.current?.revert(); } catch {}
      splitRef.current = null;
    };
  }, []);

  // EXACT same HTML structure as the original
  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-img">
        <img src={heroImage || ''} alt="" />
      </div>
      <div className="hero-header">
        <h1>
          {locale === 'ar'
            ? 'قمرة — حيث تتحول اللحظات إلى فن خالد'
            : 'Qomra — Where moments become timeless art'}
        </h1>
      </div>
      <div className="hero-copy">
        <h3>
          {locale === 'ar'
            ? 'جماعة التصوير الفوتوغرافي — نلتقط ما لا يُرى ونروي ما لا يُقال'
            : 'The photography collective — we capture the unseen and tell the untold'}
        </h3>
      </div>
    </section>
  );
}
