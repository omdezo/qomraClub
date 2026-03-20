'use client';

import { useEffect, useRef } from 'react';
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

  const totalCount = items.length;
  const SCROLL_PAGES = 5;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = stickyRef.current;
    const indexEl = indexRef.current;
    const imagesContainer = imagesContainerRef.current;
    const namesContainer = namesContainerRef.current;
    if (!wrapper || !section || !indexEl || !imagesContainer || !namesContainer || totalCount === 0) return;

    // Set wrapper height to create scroll space
    wrapper.style.height = `${SCROLL_PAGES * window.innerHeight}px`;

    const vh = window.innerHeight;
    const stickyPadding = parseFloat(getComputedStyle(section).paddingTop) || 32;

    function onScrollUpdate() {
      const scrollY = window.scrollY;
      const wrapperTop = wrapper.getBoundingClientRect().top + scrollY;
      const scrollRange = wrapper.offsetHeight - vh;

      // Progress: 0 when wrapper top is at viewport top, 1 when scrolled through
      let progress = (scrollY - wrapperTop) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));

      // Pin the section manually: fixed when in range, absolute at end
      if (scrollY >= wrapperTop && scrollY <= wrapperTop + scrollRange) {
        section.style.position = 'fixed';
        section.style.top = '0';
        section.style.left = '0';
        section.style.width = '100%';
      } else if (scrollY > wrapperTop + scrollRange) {
        section.style.position = 'absolute';
        section.style.top = `${scrollRange}px`;
        section.style.left = '0';
        section.style.width = '100%';
      } else {
        section.style.position = 'absolute';
        section.style.top = '0';
        section.style.left = '0';
        section.style.width = '100%';
      }

      // Measurements (cached per frame is fine)
      const indexHeight = indexEl.offsetHeight;
      const namesHeight = namesContainer.offsetHeight;
      const imagesHeight = imagesContainer.offsetHeight;

      const moveIndex = vh - stickyPadding * 2 - indexHeight;
      const moveNames = vh - stickyPadding * 2 - namesHeight;
      const moveImages = vh - imagesHeight;
      const midpoint = vh / 2;

      // Counter
      const currentIndex = Math.min(Math.floor(progress * totalCount) + 1, totalCount);
      const locale = rtl ? 'ar' : 'en';
      const pad = (n: number) => localizeNum(String(n).padStart(2, '0'), locale);
      indexEl.textContent = `${pad(currentIndex)}/${pad(totalCount)}`;

      // Move elements
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
        const np = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        p.style.transform = `translateY(${-np * moveNames}px)`;
        p.style.color = (np > 0 && np < 1) ? '#fff' : '#4a4a4a';
      });
    }

    // Drive from GSAP ticker (synced with Lenis)
    gsap.ticker.add(onScrollUpdate);

    const handleResize = () => {
      wrapper.style.height = `${SCROLL_PAGES * window.innerHeight}px`;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(onScrollUpdate);
      window.removeEventListener('resize', handleResize);
      // Reset section position on unmount
      section.style.position = '';
      section.style.top = '';
    };
  }, [totalCount, rtl]);

  return (
    <>
      {introText && (
        <section className="h-screen flex items-center justify-center bg-[#141414]">
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">{introText}</p>
        </section>
      )}

      {/* Tall wrapper — creates scroll space */}
      <div ref={wrapperRef} className="relative bg-[#141414]">
        <div
          ref={stickyRef}
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
