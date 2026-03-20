import Link from 'next/link';
import type { Locale } from '@/types';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

interface QomraWeekBannerProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function QomraWeekBanner({ locale, dict }: QomraWeekBannerProps) {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-bold text-white select-none">
          11
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <FadeInOnScroll>
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
            {dict.home.qomraWeekTeaser}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 font-dialogue">
            {locale === 'ar' ? 'أسبوع قمرة ١١' : 'Qomra Week 11'}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.2}>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'المسابقة السنوية الأبرز لجماعة قمرة في التصوير الفوتوغرافي'
              : 'The flagship annual photography competition by Qomra Club'}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <Link
            href={`/${locale}/qomra-week`}
            className="inline-block px-8 py-4 bg-accent text-primary text-lg font-semibold rounded-xl hover:bg-accent-hover transition-colors"
          >
            {dict.home.exploreEdition}
          </Link>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
