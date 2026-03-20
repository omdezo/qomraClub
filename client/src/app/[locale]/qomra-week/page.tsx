import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types';
import TextReveal from '@/components/animations/TextReveal';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

export default async function QomraWeekPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  // Placeholder editions for when API is not connected
  const placeholderEditions = Array.from({ length: 11 }, (_, i) => ({
    editionNumber: 11 - i,
    title: { ar: `أسبوع قمرة ${11 - i}`, en: `Qomra Week ${11 - i}` },
    year: 2014 + (11 - i),
    coverImageUrl: '',
  }));

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <TextReveal className="text-[clamp(2rem,5vw,4rem)] font-bold mb-4">
            {dict.qomraWeek.title}
          </TextReveal>
          <p className="text-white/50 text-lg">
            {params.locale === 'ar'
              ? 'المسابقة السنوية الأبرز لجماعة قمرة'
              : 'The flagship annual competition of Qomra Club'}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderEditions.map((edition, i) => (
            <FadeInOnScroll key={edition.editionNumber} delay={i * 0.05}>
              <Link
                href={`/${params.locale}/qomra-week/${edition.editionNumber}`}
                className="group block bg-secondary rounded-xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all"
              >
                <div className="aspect-video bg-elevated relative overflow-hidden">
                  {edition.coverImageUrl ? (
                    <Image src={edition.coverImageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/5">
                      {edition.editionNumber}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                    {params.locale === 'ar' ? edition.title.ar : edition.title.en}
                  </h3>
                  <p className="text-sm text-white/40 mt-1">{edition.year}</p>
                </div>
              </Link>
            </FadeInOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
}
