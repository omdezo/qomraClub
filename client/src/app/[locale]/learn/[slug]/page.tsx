'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { getBilingual, formatDate } from '@/lib/utils';
import type { Locale, Article, Member } from '@/types';
import Badge from '@/components/ui/Badge';

export default function ArticleDetailPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    api.get(`/articles/${slug}`).then(({ data }) => setArticle(data)).catch(() => {});
  }, [slug]);

  if (!article) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-white/50">
        {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
      </div>
    );
  }

  const author = typeof article.author === 'object' ? article.author as Member : null;

  return (
    <div className="pt-20 min-h-screen bg-elevated">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Badge variant="accent" className="mb-4">{article.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{getBilingual(article.title, locale)}</h1>

        <div className="flex items-center gap-4 text-sm text-white/50 mb-8">
          {author && (
            <Link href={`/${locale}/members/${(article.author as Member)._id}`} className="flex items-center gap-2 hover:text-accent">
              {author.avatarUrl && (
                <Image src={author.avatarUrl} alt="" width={28} height={28} className="rounded-full" />
              )}
              <span>{getBilingual(author.name, locale)}</span>
            </Link>
          )}
          <span>{article.readTime} {locale === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
          <span>{formatDate(article.createdAt, locale)}</span>
        </div>

        {article.coverImageUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image src={article.coverImageUrl} alt="" fill className="object-cover" />
          </div>
        )}

        <div
          className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed"
          style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: getBilingual(article.content, locale) }}
        />
      </article>
    </div>
  );
}
