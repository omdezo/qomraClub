'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { getBilingual, localizeNum } from '@/lib/utils';
import type { Locale } from '@/types';
import ProtectedImage from '@/components/ui/ProtectedImage';
import { useImageProtection } from '@/hooks/useImageProtection';

interface Edition {
  id: string;
  editionNumber: number;
  title: { ar: string; en: string };
  theme: { ar: string; en: string };
  description: { ar: string; en: string };
  year: number;
  startDate?: string;
  endDate?: string;
  coverImageUrl: string;
  totalParticipants: number;
  totalPhotos: number;
  winners: Array<{
    place: number;
    name: { ar: string; en: string };
    prize: { ar: string; en: string };
  }>;
  judges: Array<{
    name: { ar: string; en: string };
    title: { ar: string; en: string };
  }>;
}

interface WeekPhoto {
  id: string;
  title: { ar: string; en: string };
  photographerName: { ar: string; en: string };
  imageUrl: string;
  isWinner: boolean;
  winnerPlace: number;
}

const placeLabels: Record<number, { ar: string; en: string }> = {
  1: { ar: 'المركز الأول', en: '1st Place' },
  2: { ar: 'المركز الثاني', en: '2nd Place' },
  3: { ar: 'المركز الثالث', en: '3rd Place' },
};

const placeColors: Record<number, string> = {
  1: '#ffd700',
  2: '#c0c0c0',
  3: '#cd7f32',
};

export default function QomraWeekEditionPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const editionNum = params?.edition as string;
  const [edition, setEdition] = useState<Edition | null>(null);
  const [photos, setPhotos] = useState<WeekPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WeekPhoto | null>(null);

  useImageProtection();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edRes, phRes] = await Promise.all([
          api.get(`/qomra-week/editions/${editionNum}`),
          api.get(`/qomra-week/editions/${editionNum}/photos`, { params: { limit: 50 } }),
        ]);
        setEdition(edRes.data);
        setPhotos(phRes.data.data || phRes.data);
      } catch (err) {
        console.error('Failed to load edition:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editionNum]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/30 animate-pulse">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!edition) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">
        {locale === 'ar' ? 'الإصدار غير موجود' : 'Edition not found'}
      </div>
    );
  }

  const winnerPhotos = photos.filter((p) => p.isWinner).sort((a, b) => a.winnerPlace - b.winnerPlace);
  const otherPhotos = photos.filter((p) => !p.isWinner);

  const formatDateRange = () => {
    if (!edition.startDate || !edition.endDate) return null;
    const start = new Date(edition.startDate);
    const end = new Date(edition.endDate);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const lc = locale === 'ar' ? 'ar-SA' : 'en-US';
    return `${start.toLocaleDateString(lc, opts)} — ${end.toLocaleDateString(lc, opts)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ───── Hero with cover image ───── */}
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        {edition.coverImageUrl && (
          <ProtectedImage
            src={edition.coverImageUrl}
            className="absolute inset-0 w-full h-full opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/60 to-[#0a0a0a]" />

        <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 md:px-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-accent text-xs tracking-[0.4em] uppercase mb-4">
              {locale === 'ar'
                ? `الإصدار ${localizeNum(edition.editionNumber, locale)} · ${localizeNum(edition.year, locale)}`
                : `Edition ${edition.editionNumber} · ${edition.year}`}
            </p>
            <h1
              className="text-[clamp(2.5rem,8vw,6rem)] font-extralight leading-[0.95] tracking-tight mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              {getBilingual(edition.title, locale)}
            </h1>
            {getBilingual(edition.theme, locale) && (
              <p className="text-xl md:text-2xl text-accent/80 font-light mb-6">
                {locale === 'ar'
                  ? `الموضوع · ${getBilingual(edition.theme, locale)}`
                  : `Theme · ${getBilingual(edition.theme, locale)}`}
              </p>
            )}
            {formatDateRange() && (
              <p className="text-white/40 text-sm tracking-wide">{formatDateRange()}</p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        {/* ───── Description + Stats ───── */}
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2"
          >
            <p className="text-accent text-[10px] tracking-[0.4em] uppercase mb-4">
              {locale === 'ar' ? 'عن الإصدار' : 'About the Edition'}
            </p>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed font-light">
              {getBilingual(edition.description, locale)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6 md:border-s md:border-white/10 md:ps-10"
          >
            {edition.totalParticipants > 0 && (
              <div>
                <p className="text-5xl font-extralight text-accent mb-1">
                  {localizeNum(edition.totalParticipants, locale)}
                </p>
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase">
                  {locale === 'ar' ? 'مشارك' : 'Participants'}
                </p>
              </div>
            )}
            {edition.totalPhotos > 0 && (
              <div>
                <p className="text-5xl font-extralight text-accent mb-1">
                  {localizeNum(edition.totalPhotos, locale)}
                </p>
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase">
                  {locale === 'ar' ? 'عمل فني' : 'Works'}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ───── Winners ───── */}
        {winnerPhotos.length > 0 && (
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-accent text-[10px] tracking-[0.4em] uppercase mb-2">
                {locale === 'ar' ? 'الفائزون' : 'Winners'}
              </p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
                {locale === 'ar' ? 'الأعمال المتوّجة' : 'Awarded Works'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {winnerPhotos.map((p, i) => {
                const color = placeColors[p.winnerPlace] || '#d4a574';
                return (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setSelected(p)}
                    className="group text-start"
                  >
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4 bg-elevated">
                      <ProtectedImage
                        src={p.imageUrl}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                        eager
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div
                        className="absolute top-4 start-4 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide backdrop-blur-md"
                        style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}
                      >
                        {getBilingual(placeLabels[p.winnerPlace], locale)}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* ───── Other photos grid ───── */}
        {otherPhotos.length > 0 && (
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-accent text-[10px] tracking-[0.4em] uppercase mb-2">
                {locale === 'ar' ? 'المعرض' : 'Gallery'}
              </p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
                {locale === 'ar' ? 'جميع الأعمال' : 'All Works'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherPhotos.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
                  onClick={() => setSelected(p)}
                  className="group text-start"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-elevated">
                    <ProtectedImage
                      src={p.imageUrl}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* ───── Judges ───── */}
        {edition.judges && edition.judges.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-accent text-[10px] tracking-[0.4em] uppercase mb-2">
                {locale === 'ar' ? 'لجنة التحكيم' : 'Judges'}
              </p>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
                {locale === 'ar' ? 'من حكّم الإصدار' : 'Who Judged the Edition'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {edition.judges.map((j, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent"
                >
                  <h4 className="text-lg font-light mb-2">{getBilingual(j.name, locale)}</h4>
                  <p className="text-sm text-accent/70">{getBilingual(j.title, locale)}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ───── Lightbox ───── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 end-6 text-white/70 hover:text-white text-2xl"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ProtectedImage
              src={selected.imageUrl}
              fit="contain"
              className="max-w-full max-h-[85vh] rounded-lg"
              style={{ width: '100%', height: '85vh' }}
              watermark="Qomra"
            />
          </div>
        </div>
      )}
    </div>
  );
}
