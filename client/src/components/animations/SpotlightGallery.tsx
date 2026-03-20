'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  const scrollMultiplier = 5;

  const onFrame = useCallback(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const indexEl = indexRef.current;
    const imagesContainer = imagesContainerRef.current;
    const namesContainer = namesContainerRef.current;
    if (!wrapper || !sticky || !indexEl || !imagesContainer || !namesContainer) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const scrollRange = wrapper.offsetHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    const progress = Math.max(0, Math.min(1, -wrapperRect.top / scrollRange));

    const vh = window.innerHeight;
    const stickyPadding = parseFloat(getComputedStyle(sticky).paddingTop) || 32;
    const indexHeight = indexEl.offsetHeight;
    const namesHeight = namesContainer.offsetHeight;
    const imagesHeight = imagesContainer.offsetHeight;

    const moveIndex = vh - stickyPadding * 2 - indexHeight;
    const moveNames = vh - stickyPadding * 2 - namesHeight;
    const moveImages = vh - imagesHeight;
    const midpoint = vh / 2;

    // Counter text
    const currentIndex = Math.min(Math.floor(progress * totalCount) + 1, totalCount);
    const locale = rtl ? 'ar' : 'en';
    const pad = (n: number) => localizeNum(String(n).padStart(2, '0'), locale);
    indexEl.textContent = `${pad(currentIndex)}/${pad(totalCount)}`;

    // Move — using raw style to avoid GSAP overwriting CSS transforms
    indexEl.style.transform = `translateY(${progress * moveIndex}px)`;
    imagesContainer.style.transform = `translateX(-50%) translateY(${progress * moveImages}px)`;

    // Image activation
    imgRefs.current.forEach((img) => {
      if (!img) return;
      const rect = img.getBoundingClientRect();
      img.style.opacity = (rect.top <= midpoint && rect.bottom >= midpoint) ? '1' : '0.5';
    });

    // Names
    nameRefs.current.forEach((p, i) => {
      if (!p) return;
      const start = i / totalCount;
      const end = (i + 1) / totalCount;
      const nameProg = Math.max(0, Math.min(1, (progress - start) / (end - start)));

      p.style.transform = `translateY(${-nameProg * moveNames}px)`;
      p.style.color = (nameProg > 0 && nameProg < 1) ? '#fff' : '#4a4a4a';
    });
  }, [totalCount, rtl]);

  useEffect(() => {
    const tick = () => {
      onFrame();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onFrame]);

  return (
    <>
      {introText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{introText}</p>
        </section>
      )}

      {/* Tall wrapper = scroll space. Sticky child = stays in view */}
      <div
        ref={wrapperRef}
        style={{ height: `${scrollMultiplier * 100}vh` }}
        className="relative bg-[#141414]"
      >
        <div
          ref={stickyRef}
          className="spotlight-section"
          style={{ position: 'sticky', top: 0 }}
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
