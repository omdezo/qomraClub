'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale } from '@/types';

interface Partner {
  id: string;
  name: { ar: string; en: string };
  logoUrl: string;
  websiteUrl: string;
}

export default function HomePartners({ locale, dict }: { locale: Locale; dict: any }) {
  const [items, setItems] = useState<Partner[]>([]);

  useEffect(() => {
    api.get('/partners').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-xs tracking-[0.4em] uppercase mb-4">
            {dict.partners.subtitle}
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extralight tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            {dict.partners.title}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16"
        >
          {items.map((p) => {
            const LogoImg = (
              <img
                src={p.logoUrl}
                alt={getBilingual(p.name, locale)}
                className="h-12 md:h-16 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
              />
            );
            return p.websiteUrl ? (
              <a
                key={p.id}
                href={p.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                title={getBilingual(p.name, locale)}
              >
                {LogoImg}
              </a>
            ) : (
              <div key={p.id} title={getBilingual(p.name, locale)}>
                {LogoImg}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
