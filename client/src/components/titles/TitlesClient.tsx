'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale } from '@/types';

interface TitleItem {
  _id?: string;
  id?: string;
  slug: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  requirements: { ar: string; en: string }[];
  color: string;
  tier: number;
  iconUrl?: string;
}

export default function TitlesClient({ locale, dict }: { locale: Locale; dict: any }) {
  const [titles, setTitles] = useState<TitleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/titles')
      .then(({ data }) => setTitles(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-accent text-xs tracking-[0.4em] uppercase mb-6">
            {dict.titles.subtitle}
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extralight leading-[0.95] tracking-tight mb-8"
            style={{ letterSpacing: '-0.03em' }}
          >
            {dict.titles.title}
          </h1>
          <p className="text-white/50 max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-light">
            {dict.titles.description}
          </p>
        </motion.header>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-20 origin-center"
        />

        {/* Titles timeline */}
        {loading ? (
          <div className="text-white/30 text-center py-20">{dict.common.loading}</div>
        ) : titles.length === 0 ? (
          <div className="text-white/30 text-center py-20">{dict.common.noResults}</div>
        ) : (
          <div className="space-y-6">
            {titles.map((t, i) => (
              <motion.div
                key={t.id || t._id || t.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative group"
              >
                <div
                  className="relative p-8 md:p-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/[0.12] transition-all duration-500 overflow-hidden"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-[0.15] pointer-events-none transition-opacity duration-500 group-hover:opacity-25"
                    style={{ backgroundColor: t.color }}
                  />

                  <div className="relative flex flex-col md:flex-row md:items-start gap-8">
                    {/* Tier badge */}
                    <div className="shrink-0">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center border relative"
                        style={{
                          borderColor: `${t.color}44`,
                          background: `linear-gradient(135deg, ${t.color}22, transparent)`,
                        }}
                      >
                        <span
                          className="text-[11px] tracking-[0.3em] uppercase mb-1"
                          style={{ color: t.color }}
                        >
                          {dict.titles.tier}
                        </span>
                        <span
                          className="absolute text-4xl font-extralight mt-5"
                          style={{ color: t.color }}
                        >
                          {locale === 'ar'
                            ? ['٠١','٠٢','٠٣','٠٤','٠٥','٠٦','٠٧','٠٨','٠٩','١٠'][t.tier - 1]
                            : String(t.tier).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-3xl md:text-4xl font-light mb-3 tracking-tight"
                        style={{ color: t.color }}
                      >
                        {getBilingual(t.name, locale)}
                      </h3>
                      <p className="text-white/60 text-base md:text-lg leading-relaxed font-light mb-6">
                        {getBilingual(t.description, locale)}
                      </p>

                      <div className="pt-4 border-t border-white/[0.06]">
                        <p className="text-white/40 text-xs tracking-[0.25em] uppercase mb-4">
                          {dict.titles.requirements}
                        </p>
                        <ul className="space-y-2.5">
                          {t.requirements.map((req, ri) => (
                            <li key={ri} className="flex items-start gap-3 text-white/75 text-sm md:text-base leading-relaxed">
                              <span
                                className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: t.color }}
                              />
                              <span>{getBilingual(req, locale)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection line to next tier */}
                {i < titles.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
