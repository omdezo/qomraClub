'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { getBilingual, localizeNum } from '@/lib/utils';
import type { Locale } from '@/types';

interface Alum {
  id: string;
  name: { ar: string; en: string };
  graduationYear: number;
  major: { ar: string; en: string };
  currentRole: { ar: string; en: string };
  bio: { ar: string; en: string };
  avatarUrl: string;
  title?: string;
}

export default function AlumniClient({ locale, dict }: { locale: Locale; dict: any }) {
  const [alumni, setAlumni] = useState<Alum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/alumni')
      .then(({ data }) => setAlumni(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-accent text-xs tracking-[0.4em] uppercase mb-6">
            {dict.alumni.subtitle}
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extralight leading-[0.95] tracking-tight mb-8"
            style={{ letterSpacing: '-0.03em' }}
          >
            {dict.alumni.title}
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light">
            {dict.alumni.description}
          </p>
        </motion.header>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-20 origin-center"
        />

        {loading ? (
          <div className="text-white/30 text-center py-20">{dict.common.loading}</div>
        ) : alumni.length === 0 ? (
          <div className="text-white/30 text-center py-20">{dict.common.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alumni.map((alum, i) => (
              <motion.div
                key={alum.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-accent/30 transition-all duration-500">
                  {/* Avatar */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.08] shrink-0">
                      {alum.avatarUrl ? (
                        <img src={alum.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-accent/60 text-xl font-light">
                          {getBilingual(alum.name, locale).charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-light text-white mb-1 truncate">
                        {getBilingual(alum.name, locale)}
                      </h3>
                      <p className="text-accent/80 text-sm">
                        {dict.alumni.graduatedIn} {localizeNum(alum.graduationYear, locale)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {getBilingual(alum.major, locale) && (
                      <div>
                        <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-1">
                          {dict.alumni.major}
                        </p>
                        <p className="text-white/70 text-sm">{getBilingual(alum.major, locale)}</p>
                      </div>
                    )}
                    {getBilingual(alum.currentRole, locale) && (
                      <div>
                        <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-1">
                          {dict.alumni.currentRole}
                        </p>
                        <p className="text-white/70 text-sm">{getBilingual(alum.currentRole, locale)}</p>
                      </div>
                    )}
                    {getBilingual(alum.bio, locale) && (
                      <p className="text-white/50 text-sm leading-relaxed pt-2 border-t border-white/[0.06]">
                        {getBilingual(alum.bio, locale)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
