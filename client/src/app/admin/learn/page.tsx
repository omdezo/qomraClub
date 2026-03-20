'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Article, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({
    titleAr: '', titleEn: '', slugEn: '', contentAr: '', contentEn: '',
    excerptAr: '', excerptEn: '', category: 'tutorial' as Article['category'],
    readTime: '5', isPublished: true,
  });

  const fetchArticles = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Article>>('/articles/admin/all', { params: { limit: 50 } });
      setArticles(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSave = async () => {
    const body = {
      title: { ar: form.titleAr, en: form.titleEn },
      slug: { ar: form.titleAr, en: form.slugEn || form.titleEn.toLowerCase().replace(/\s+/g, '-') },
      content: { ar: form.contentAr, en: form.contentEn },
      excerpt: { ar: form.excerptAr, en: form.excerptEn },
      category: form.category,
      readTime: Number(form.readTime),
      isPublished: form.isPublished,
    };

    try {
      if (editing) {
        await api.put(`/articles/${editing._id}`, body);
      } else {
        await api.post('/articles', body);
      }
      fetchArticles();
      setShowForm(false);
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Add Article</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article._id} className="bg-secondary rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{article.title.en || article.title.ar}</h3>
                  <Badge>{article.category}</Badge>
                  {!article.isPublished && <Badge variant="error">Draft</Badge>}
                </div>
                <p className="text-xs text-white/40">{article.readTime} min read</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => {
                  setEditing(article);
                  setForm({
                    titleAr: article.title.ar, titleEn: article.title.en,
                    slugEn: article.slug.en, contentAr: article.content.ar, contentEn: article.content.en,
                    excerptAr: article.excerpt?.ar || '', excerptEn: article.excerpt?.en || '',
                    category: article.category, readTime: String(article.readTime), isPublished: article.isPublished,
                  });
                  setShowForm(true);
                }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(article._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Article' : 'Add Article'} className="max-w-lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Input id="titleAr" label="Title (AR)" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <Input id="titleEn" label="Title (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="slugEn" label="Slug (EN)" value={form.slugEn} onChange={(e) => setForm({ ...form, slugEn: e.target.value })} />
            <div>
              <label className="block text-sm text-white/70 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Article['category'] })}
                className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
              >
                {['tutorial', 'tip', 'review', 'technique'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <Input id="readTime" type="number" label="Read Time (min)" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Content (AR)</label>
              <textarea rows={4} value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Content (EN)</label>
              <textarea rows={4} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent resize-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
            Published
          </label>
          <Button onClick={handleSave} className="w-full">{editing ? 'Save Changes' : 'Create Article'}</Button>
        </div>
      </Modal>
    </div>
  );
}
