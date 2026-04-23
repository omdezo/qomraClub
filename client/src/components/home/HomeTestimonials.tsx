'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale } from '@/types';

interface Testimonial {
  id: string;
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  quote: { ar: string; en: string };
  avatarUrl: string;
  organization: { ar: string; en: string };
}

export default function HomeTestimonials({ locale, dict }: { locale: Locale; dict: any }) {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.get('/testimonials').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-xs tracking-[0.4em] uppercase mb-4">
            {dict.testimonials.subtitle}
          </p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-extralight tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            {dict.testimonials.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-accent/20 transition-all duration-500"
            >
              <span className="text-accent/40 text-5xl font-serif leading-none block mb-4">"</span>
              <p className="text-white/75 text-base leading-relaxed font-light mb-6">
                {getBilingual(t.quote, locale)}
              </p>
              <footer className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/[0.04] shrink-0">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent/50 text-sm">
                      {getBilingual(t.name, locale).charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{getBilingual(t.name, locale)}</p>
                  <p className="text-xs text-white/40 truncate">
                    {getBilingual(t.role, locale)}
                    {getBilingual(t.organization, locale) && ` • ${getBilingual(t.organization, locale)}`}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
