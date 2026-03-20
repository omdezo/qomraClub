'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getBilingual, formatDate } from '@/lib/utils';
import type { Locale, Article, Member, PaginatedResponse } from '@/types';
import Badge from '@/components/ui/Badge';

const categories = ['all', 'tutorial', 'tip', 'review', 'technique'];

export default function LearnPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const categoryLabels: Record<string, Record<string, string>> = {
    all: { ar: 'الكل', en: 'All' },
    tutorial: { ar: 'دروس', en: 'Tutorials' },
    tip: { ar: 'نصائح', en: 'Tips' },
    review: { ar: 'مراجعات', en: 'Reviews' },
    technique: { ar: 'تقنيات', en: 'Techniques' },
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const p: any = { limit: 20 };
        if (category !== 'all') p.category = category;
        const { data } = await api.get<PaginatedResponse<Article>>('/articles', { params: p });
        setArticles(data.data);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [category]);

  return (
    <div className="pt-20 min-h-screen bg-elevated">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          {locale === 'ar' ? 'تعلّم' : 'Learn'}
        </h1>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                category === cat
                  ? 'bg-accent text-primary font-medium'
                  : 'bg-secondary text-white/60 hover:text-white'
              }`}
            >
              {categoryLabels[cat]?.[locale] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {locale === 'ar' ? 'لا توجد مقالات بعد' : 'No articles yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const author = typeof article.author === 'object' ? article.author as Member : null;
              return (
                <Link
                  key={article._id}
                  href={`/${locale}/learn/${getBilingual(article.slug, locale) || article._id}`}
                  className="group bg-secondary rounded-xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all"
                >
                  <div className="aspect-video relative bg-primary overflow-hidden">
                    {article.coverImageUrl ? (
                      <Image src={article.coverImageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/10 text-sm">
                        {getBilingual(article.title, locale)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2">{categoryLabels[article.category]?.[locale] || article.category}</Badge>
                    <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-2 mb-2">
                      {getBilingual(article.title, locale)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{author ? getBilingual(author.name, locale) : ''}</span>
                      <span>{article.readTime} {locale === 'ar' ? 'دقائق' : 'min'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
