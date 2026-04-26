'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/types';

const STORAGE_KEY = 'qomra_intro_seen_v1';
const BRAND_COLOR = '#98777b';

interface IntroOverlayProps {
  locale: Locale;
}

export default function IntroOverlay({ locale }: IntroOverlayProps) {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Show on first visit per session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
      // Lock body scroll while intro is up
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    // Only react to left click (button === 0)
    if (e.button !== 0 || exiting) return;
    setExiting(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    // Wait for exit animation to finish before unmounting
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 1100);
  };

  if (!show) return null;

  const enterText = locale === 'ar' ? 'انقر للدخول' : 'Click to enter';
  const tagline =
    locale === 'ar'
      ? 'قمرة — جماعة التصوير الفوتوغرافي'
      : 'Qomra — Photography Collective';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-overlay"
          onClick={dismiss}
          className="fixed inset-0 z-[200] cursor-pointer flex items-center justify-center select-none"
          style={{ backgroundColor: BRAND_COLOR }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          animate={
            exiting
              ? { scale: 1.08, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
        >
          {/* Vignette / texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Center content */}
          <div className="relative flex flex-col items-center justify-center text-center px-6">
            {/* Top line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-px w-32 md:w-40 bg-white/40 mb-10 origin-center"
            />

            {/* Logo */}
            <motion.img
              src="/LOGO.png"
              alt=""
              className="w-32 md:w-44 h-auto mb-8"
              draggable={false}
              initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))' }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 0.85 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
              className="text-white text-base md:text-lg font-light tracking-wide mb-2"
            >
              {tagline}
            </motion.p>

            {/* Bottom line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="h-px w-24 md:w-32 bg-white/40 mt-10 origin-center"
            />

            {/* Click hint — pulses to invite interaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="absolute bottom-[-7rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-white/90 text-[11px] md:text-xs tracking-[0.5em] uppercase"
              >
                {enterText}
              </motion.span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-8 bg-white/40"
              />
            </motion.div>
          </div>

          {/* Corner brand mark */}
          <div className="absolute top-8 left-8 text-white/40 text-[10px] tracking-[0.4em] uppercase">
            {locale === 'ar' ? '٢٠٢٦' : '2026'}
          </div>
          <div className="absolute top-8 right-8 text-white/40 text-[10px] tracking-[0.4em] uppercase">
            {locale === 'ar' ? 'قمرة' : 'Qomra'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
