'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';
import LocaleSwitcher from './LocaleSwitcher';

interface NavbarProps {
  locale: Locale;
  dict: Record<string, any>;
}

const navItems = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'gallery', href: '/gallery' },
  { key: 'qomraWeek', href: '/qomra-week' },
  { key: 'events', href: '/events' },
  { key: 'alumni', href: '/alumni' },
  { key: 'titles', href: '/titles' },
  { key: 'learn', href: '/learn' },
  { key: 'services', href: '/services' },
  { key: 'contact', href: '/contact' },
];

// ─── Magnetic wrapper ───────────────────────────────────────
function Magnetic({ children, className, strength = 0.15 }: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Navbar ────────────────────────────────────────────
export default function Navbar({ locale, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pillRect, setPillRect] = useState({ left: 0, width: 0 });
  const [glowX, setGlowX] = useState(0);
  const linksRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setVisible(y < 300 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Cursor glow tracking
  const handleNavMouseMove = useCallback((e: React.MouseEvent) => {
    if (!linksRef.current) return;
    const rect = linksRef.current.getBoundingClientRect();
    setGlowX(e.clientX - rect.left);
  }, []);

  // Hover pill tracking
  const handleLinkHover = useCallback((key: string, el: HTMLElement) => {
    if (!linksRef.current) return;
    const cr = linksRef.current.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPillRect({ left: er.left - cr.left, width: er.width });
    setHoveredKey(key);
  }, []);

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DESKTOP HEADER
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.header
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className={cn(
          'transition-all duration-700 ease-out',
          scrolled
            ? 'bg-[#060606]/80 backdrop-blur-3xl shadow-[0_4px_80px_rgba(0,0,0,0.6)] border-b border-white/[0.04]'
            : 'bg-transparent'
        )}>
          <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
            <div className="flex items-center justify-between h-24">

              {/* ── Logo ── */}
              <Magnetic className="shrink-0" strength={0.12}>
                <a href={`/${locale}`} className="group flex items-center gap-3">
                  <img
                    src="/LOGO.png"
                    alt={dict.site.name}
                    className="h-14 transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_20px_rgba(212,165,116,0.2)]"
                  />
                </a>
              </Magnetic>

              {/* ── Center nav pill (desktop) ── */}
              <div
                ref={linksRef}
                onMouseMove={handleNavMouseMove}
                onMouseLeave={() => { setHoveredKey(null); setGlowX(0); }}
                className={cn(
                  'hidden lg:flex items-center relative rounded-full transition-all duration-700',
                  scrolled
                    ? 'px-2 py-2 bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                    : 'px-2 py-2 bg-transparent border border-transparent'
                )}
              >
                {/* Cursor-following glow */}
                {glowX > 0 && (
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 w-28 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-300"
                    style={{
                      left: glowX,
                      opacity: hoveredKey ? 1 : 0,
                      background: 'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)',
                    }}
                  />
                )}

                {/* Sliding hover pill */}
                <AnimatePresence>
                  {hoveredKey && (
                    <motion.div
                      layout
                      className="absolute top-2 bottom-2 rounded-full bg-white/[0.06] border border-white/[0.05]"
                      style={{ left: pillRect.left, width: pillRect.width }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </AnimatePresence>

                {navItems.map((item) => {
                  const href = `/${locale}${item.href}`;
                  const isActive = pathname === href || (item.href && pathname.startsWith(href));
                  return (
                    <a
                      key={item.key}
                      href={href}
                      onMouseEnter={(e) => handleLinkHover(item.key, e.currentTarget)}
                      className={cn(
                        'relative px-4 py-2 text-sm tracking-[0.01em] transition-all duration-200 z-10 whitespace-nowrap',
                        isActive
                          ? 'text-accent'
                          : 'text-white/40 hover:text-white/90'
                      )}
                    >
                      {dict.nav[item.key]}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-accent shadow-[0_0_8px_rgba(212,165,116,0.5)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* ── Right actions (desktop) ── */}
              <div className="hidden lg:flex items-center gap-3">
                <LocaleSwitcher locale={locale} />

                <Magnetic className="ms-1" strength={0.1}>
                  <a
                    href={`/${locale}/contact`}
                    className="group relative flex items-center gap-2.5 px-7 py-3 rounded-full overflow-hidden"
                  >
                    {/* Animated gradient border */}
                    <span className="absolute inset-0 rounded-full p-[1.5px]">
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
                      <span className="absolute inset-[1.5px] rounded-full bg-[#0a0a0a] transition-all duration-500 group-hover:bg-accent" />
                    </span>
                    <span className="relative z-10 text-sm font-medium tracking-wide text-accent group-hover:text-primary transition-colors duration-300">
                      {dict.nav.joinUs}
                    </span>
                    <svg
                      className="relative z-10 w-4 h-4 text-accent group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </Magnetic>
              </div>

              {/* ── Mobile hamburger ── */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative z-[60] w-12 h-12 flex items-center justify-center rounded-full border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
                aria-label="Toggle menu"
              >
                <div className="w-[22px] h-[16px] relative flex flex-col justify-between">
                  <motion.span
                    animate={isOpen
                      ? { rotate: 45, y: 7, width: '100%' }
                      : { rotate: 0, y: 0, width: '100%' }
                    }
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="block h-[1.5px] bg-white rounded-full origin-center"
                  />
                  <motion.span
                    animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 0.5, scaleX: 1 }}
                    transition={{ duration: 0.25 }}
                    className="block h-[1.5px] w-[60%] bg-white rounded-full ms-auto"
                  />
                  <motion.span
                    animate={isOpen
                      ? { rotate: -45, y: -7, width: '100%' }
                      : { rotate: 0, y: 0, width: '40%' }
                    }
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="block h-[1.5px] bg-white/30 rounded-full origin-center"
                  />
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Bottom accent line that fades in on scroll */}
        <motion.div
          animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent origin-center"
        />
      </motion.header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE FULLSCREEN MENU
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030303]/[0.98] backdrop-blur-3xl"
            />

            {/* Ambient glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-accent/[0.025] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[15%] right-[10%] w-[200px] h-[200px] bg-accent/[0.015] rounded-full blur-[100px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full pt-32 pb-10 px-8">

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center -mt-10">
                {navItems.map((item, i) => {
                  const href = `/${locale}${item.href}`;
                  const isActive = pathname === href || (item.href && pathname.startsWith(href));
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                      transition={{
                        delay: 0.05 + i * 0.04,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <a
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'group flex items-center gap-5 py-[clamp(0.5rem,2.2vw,1.1rem)] transition-all duration-300',
                          isActive ? 'text-accent' : 'text-white/25 hover:text-white/80'
                        )}
                      >
                        {/* Index */}
                        <span className={cn(
                          'text-[11px] tracking-[0.3em] tabular-nums font-light transition-colors duration-300',
                          isActive ? 'text-accent/50' : 'text-white/[0.07] group-hover:text-white/15'
                        )}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {/* Divider tick */}
                        <span className={cn(
                          'w-3 h-px transition-all duration-300',
                          isActive ? 'bg-accent/40 w-6' : 'bg-white/[0.06] group-hover:bg-white/10 group-hover:w-5'
                        )} />
                        {/* Label */}
                        <span className="text-[clamp(1.5rem,5vw,2.5rem)] font-extralight tracking-tight leading-none">
                          {dict.nav[item.key]}
                        </span>
                      </a>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom bar */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent mb-8" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="/LOGO.png" alt="" className="h-8 opacity-30" />
                    <LocaleSwitcher locale={locale} />
                  </div>
                  <a
                    href={`/${locale}/contact`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-2.5 px-7 py-3.5 bg-accent text-primary text-sm font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,165,116,0.2)]"
                  >
                    {dict.nav.joinUs}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
