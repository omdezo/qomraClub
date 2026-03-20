'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  delay?: number;
}

export default function TextReveal({
  children,
  className,
  as: Tag = 'h2',
  delay = 0,
}: TextRevealProps) {
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const splitRef = useRef<SplitType | null>(null);

  // Use callback ref — runs once when the span mounts in the DOM
  const setRef = useCallback((node: HTMLSpanElement | null) => {
    // Cleanup previous
    triggerRef.current?.kill();
    triggerRef.current = null;
    try { splitRef.current?.revert(); } catch {}
    splitRef.current = null;

    if (!node) return;

    // Set text via DOM — React never manages this node's children
    node.textContent = children;

    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = new SplitType(node, { types: 'words' });
    splitRef.current = split;

    if (split.words && split.words.length > 0) {
      const a = gsap.fromTo(
        split.words,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      triggerRef.current = a.scrollTrigger || null;
    }
  }, [children, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      triggerRef.current?.kill();
      try { splitRef.current?.revert(); } catch {}
    };
  }, []);

  // Render empty span — content is set via callback ref, not React
  return (
    <Tag className={cn('overflow-hidden', className)}>
      <span ref={setRef} />
    </Tag>
  );
}
