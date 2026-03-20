'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { localizeNum } from '@/lib/utils';

interface GalleryItem {
  image: string;
  name: string;
}

interface SpotlightGalleryProps {
  items: GalleryItem[];
  introText?: string;
  outroText?: string;
  rtl?: boolean;
}

export default function SpotlightGallery({ items, introText, outroText, rtl = false }: SpotlightGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLHeadingElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesContainerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  const totalCount = items.length;
  const scrollMultiplier = 5; // how many viewport heights of scroll space

  const onScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const indexEl = indexRef.current;
    const imagesContainer = imagesContainerRef.current;
    const namesContainer = namesContainerRef.current;
    if (!wrapper || !sticky || !indexEl || !imagesContainer || !namesContainer) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop = -wrapperRect.top;
    const scrollRange = wrapper.offsetHeight - window.innerHeight;

    if (scrollRange <= 0) return;

    const progress = Math.max(0, Math.min(1, wrapperTop / scrollRange));

    const stickyHeight = sticky.offsetHeight;
    const stickyPadding = parseFloat(getComputedStyle(sticky).paddingTop) || 32;
    const indexHeight = indexEl.offsetHeight;
    const namesHeight = namesContainer.offsetHeight;
    const imagesHeight = imagesContainer.offsetHeight;

    const moveDistanceIndex = stickyHeight - stickyPadding * 2 - indexHeight;
    const moveDistanceNames = stickyHeight - stickyPadding * 2 - namesHeight;
    const moveDistanceImages = window.innerHeight - imagesHeight;
    const imgActivationThreshold = window.innerHeight / 2;

    // Counter
    const currentIndex = Math.min(Math.floor(progress * totalCount) + 1, totalCount);
    const locale = rtl ? 'ar' : 'en';
    const padNum = (n: number) => localizeNum(String(n).padStart(2, '0'), locale);
    indexEl.textContent = `${padNum(currentIndex)}/${padNum(totalCount)}`;

    // Move elements
    gsap.set(indexEl, { y: progress * moveDistanceIndex });
    gsap.set(imagesContainer, { y: progress * moveDistanceImages });

    // Image opacity
    imgRefs.current.forEach((img) => {
      if (!img) return;
      const rect = img.getBoundingClientRect();
      if (rect.top <= imgActivationThreshold && rect.bottom >= imgActivationThreshold) {
        gsap.set(img, { opacity: 1 });
      } else {
        gsap.set(img, { opacity: 0.5 });
      }
    });

    // Names
    nameRefs.current.forEach((p, index) => {
      if (!p) return;
      const startProgress = index / totalCount;
      const endProgress = (index + 1) / totalCount;
      const projectProgress = Math.max(
        0,
        Math.min(1, (progress - startProgress) / (endProgress - startProgress))
      );

      gsap.set(p, { y: -projectProgress * moveDistanceNames });

      if (projectProgress > 0 && projectProgress < 1) {
        gsap.set(p, { color: '#fff' });
      } else {
        gsap.set(p, { color: '#4a4a4a' });
      }
    });
  }, [totalCount, rtl]);

  useEffect(() => {
    const tick = () => {
      onScroll();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onScroll]);

  return (
    <>
      {introText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{introText}</p>
        </section>
      )}

      {/* Tall wrapper creates the scroll space; sticky child stays in view */}
      <div
        ref={wrapperRef}
        style={{ height: `${scrollMultiplier * 100}vh`, position: 'relative' }}
        className="bg-[#141414]"
      >
        <div
          ref={stickyRef}
          className="spotlight-section"
          style={{ position: 'sticky', top: 0, padding: '2rem', direction: 'ltr' }}
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
              <div
                key={i}
                ref={(el) => { imgRefs.current[i] = el; }}
                className="spotlight-img"
              >
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
              <p key={i} ref={(el) => { nameRefs.current[i] = el; }}>
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {outroText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{outroText}</p>
        </section>
      )}
    </>
  );
}
