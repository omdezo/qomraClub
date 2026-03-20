'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, Article, Member, PaginatedResponse } from '@/types';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

interface LearnTeaserProps {
  locale: Locale;
  dict: Record<string, any>;
}

export default function LearnTeaser({ locale, dict }: LearnTeaserProps) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api.get<PaginatedResponse<Article>>('/articles', { params: { limit: 3 } })
      .then(({ data }) => setArticles(data.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold">{dict.home.learnTitle}</h2>
          </FadeInOnScroll>
          <Link
            href={`/${locale}/learn`}
            className="text-accent hover:text-accent-hover transition-colors text-sm"
          >
            {dict.home.viewAll} →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => {
              const author = typeof article.author === 'object' ? (article.author as Member) : null;
              return (
                <FadeInOnScroll key={article._id} delay={i * 0.1}>
                  <Link
                    href={`/${locale}/learn/${getBilingual(article.slug, locale) || article._id}`}
                    className="group bg-primary rounded-xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all block"
                  >
                    <div className="aspect-video relative bg-elevated overflow-hidden">
                      {article.coverImageUrl ? (
                        <Image src={article.coverImageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-elevated to-primary" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-accent">{article.category}</span>
                      <h3 className="font-semibold mt-1 group-hover:text-accent transition-colors line-clamp-2">
                        {getBilingual(article.title, locale)}
                      </h3>
                      <div className="flex items-center justify-between mt-3 text-xs text-white/40">
                        <span>{author ? getBilingual(author.name, locale) : ''}</span>
                        <span>{article.readTime} {locale === 'ar' ? 'دقائق' : 'min'}</span>
                      </div>
                    </div>
                  </Link>
                </FadeInOnScroll>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/30 mb-6">
              {locale === 'ar' ? 'المقالات قادمة قريباً' : 'Articles coming soon'}
            </p>
            <Link
              href={`/${locale}/learn`}
              className="inline-block px-6 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors"
            >
              {dict.home.viewAll}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
