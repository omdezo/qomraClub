'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { localizeNum } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface SpotlightGalleryProps {
  items: { image: string; name: string }[];
  introText?: string;
  outroText?: string;
  rtl?: boolean;
}

export default function SpotlightGallery({ items, introText, outroText, rtl = false }: SpotlightGalleryProps) {
  const spotlightRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLHeadingElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesContainerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const totalCount = items.length;

  useEffect(() => {
    if (typeof window === 'undefined' || totalCount === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = spotlightRef.current;
    const indexEl = indexRef.current;
    const imagesContainer = imagesContainerRef.current;
    const namesContainer = namesContainerRef.current;
    if (!section || !indexEl || !imagesContainer || !namesContainer) return;

    let trigger: ScrollTrigger | null = null;

    // Delay one frame so Lenis connects to ScrollTrigger first
    const frameId = requestAnimationFrame(() => {
      const sectionHeight = section.offsetHeight;
      const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 32;
      const indexHeight = indexEl.offsetHeight;
      const namesHeight = namesContainer.offsetHeight;
      const imagesHeight = imagesContainer.offsetHeight;

      const moveDistanceIndex = sectionHeight - sectionPadding * 2 - indexHeight;
      const moveDistanceNames = sectionHeight - sectionPadding * 2 - namesHeight;
      const moveDistanceImages = window.innerHeight - imagesHeight;
      const imgActivationThreshold = window.innerHeight / 2;

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIndex = Math.min(Math.floor(progress * totalCount) + 1, totalCount);

          const locale = rtl ? 'ar' : 'en';
          const padNum = (n: number) => localizeNum(String(n).padStart(2, '0'), locale);
          indexEl.textContent = `${padNum(currentIndex)}/${padNum(totalCount)}`;

          gsap.set(indexEl, { y: progress * moveDistanceIndex });
          gsap.set(imagesContainer, { y: progress * moveDistanceImages });

          imgRefs.current.forEach((img) => {
            if (!img) return;
            const rect = img.getBoundingClientRect();
            gsap.set(img, {
              opacity: (rect.top <= imgActivationThreshold && rect.bottom >= imgActivationThreshold) ? 1 : 0.5,
            });
          });

          nameRefs.current.forEach((p, index) => {
            if (!p) return;
            const startProgress = index / totalCount;
            const endProgress = (index + 1) / totalCount;
            const projectProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));

            gsap.set(p, { y: -projectProgress * moveDistanceNames });
            gsap.set(p, { color: (projectProgress > 0 && projectProgress < 1) ? '#fff' : '#4a4a4a' });
          });
        },
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      trigger?.kill();
    };
  }, [totalCount, rtl]);

  return (
    <>
      {introText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{introText}</p>
        </section>
      )}

      <section
        ref={spotlightRef}
        className="spotlight-section"
        style={{ direction: 'ltr' }}
      >
        <div className="spotlight-index" style={rtl ? { position: 'absolute', right: '2rem', top: '2rem' } : {}}>
          <h1 ref={(el) => {
            (indexRef as any).current = el;
            if (el && !el.textContent) {
              const locale = rtl ? 'ar' : 'en';
              el.textContent = `${localizeNum('01', locale)}/${localizeNum(String(totalCount).padStart(2, '0'), locale)}`;
            }
          }} />
        </div>

        <div ref={imagesContainerRef} className="spotlight-images">
          {items.map((item, i) => (
            <div key={i} ref={(el) => { imgRefs.current[i] = el; }} className="spotlight-img">
              <img src={item.image} alt={item.name} loading="eager" />
            </div>
          ))}
        </div>

        <div
          ref={namesContainerRef}
          className="spotlight-names"
          style={rtl ? { right: 'auto', left: '2rem', alignItems: 'flex-start' } : {}}
        >
          {items.map((item, i) => (
            <p key={i} ref={(el) => { nameRefs.current[i] = el; }}>{item.name}</p>
          ))}
        </div>
      </section>

      {outroText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{outroText}</p>
        </section>
      )}
    </>
  );
}
