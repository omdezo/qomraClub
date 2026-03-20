import Link from 'next/link';
import type { Locale } from '@/types';

interface JoinCTAProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function JoinCTA({ locale, dict }: JoinCTAProps) {
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {dict.home.joinTitle}
        </h2>
        <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
          {dict.home.joinDescription}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block px-8 py-4 bg-accent text-primary text-lg font-semibold rounded-xl hover:bg-accent-hover transition-colors"
        >
          {dict.home.joinButton}
        </Link>
      </div>
    </section>
  );
}
