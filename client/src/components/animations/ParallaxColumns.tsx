'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxColumnsProps {
  images?: string[];
  centerText?: string;
}

export default function ParallaxColumns({ images, centerText }: ParallaxColumnsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Default: 16 images split across 4 columns
  const imgs = images || Array.from({ length: 16 }, (_, i) => `/img${i + 1}.jpg`);

  const columns = [
    imgs.slice(0, 4),
    imgs.slice(4, 8),
    imgs.slice(8, 12),
    imgs.slice(12, 16),
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    if (!section) return;

    // Exact same animation as original:
    // gsap.to("#about-imgs-col-N", { y: value, scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } })
    const colConfigs = [
      { selector: '.about-imgs-col-1', y: -500 },
      { selector: '.about-imgs-col-2', y: -250 },
      { selector: '.about-imgs-col-3', y: -250 },
      { selector: '.about-imgs-col-4', y: -500 },
    ];

    colConfigs.forEach(({ selector, y }) => {
      const el = section.querySelector(selector);
      if (!el) return;
      const anim = gsap.to(el, {
        y,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      if (anim.scrollTrigger) triggersRef.current.push(anim.scrollTrigger);
    });

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  // EXACT same HTML structure as original .about section
  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-images">
        <div className="about-imgs-col about-imgs-col-1">
          {columns[0].map((src, i) => (
            <div key={i} className="img"><img src={src} alt="" /></div>
          ))}
        </div>
        <div className="about-imgs-col about-imgs-col-2">
          {columns[1].map((src, i) => (
            <div key={i} className="img"><img src={src} alt="" /></div>
          ))}
        </div>
        <div className="about-imgs-col about-imgs-col-3">
          {columns[2].map((src, i) => (
            <div key={i} className="img"><img src={src} alt="" /></div>
          ))}
        </div>
        <div className="about-imgs-col about-imgs-col-4">
          {columns[3].map((src, i) => (
            <div key={i} className="img"><img src={src} alt="" /></div>
          ))}
        </div>
      </div>
      {centerText && (
        <div className="about-header">
          <h3>{centerText}</h3>
        </div>
      )}
    </section>
  );
}
