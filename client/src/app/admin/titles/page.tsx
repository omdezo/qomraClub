'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface Title {
  id: string;
  slug: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  requirements: { ar: string; en: string }[];
  color: string;
  tier: number;
  sortOrder: number;
  isPublished: boolean;
}

const emptyForm = {
  slug: '',
  nameAr: '', nameEn: '',
  descriptionAr: '', descriptionEn: '',
  requirementsText: '', // JSON string of [{ar,en}]
  color: '#d4a574',
  tier: '1',
  sortOrder: '0',
  isPublished: true,
};

export default function AdminTitlesPage() {
  const [items, setItems] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Title | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/titles/admin/all');
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (t: Title) => {
    setEditing(t);
    setForm({
      slug: t.slug,
      nameAr: t.name.ar, nameEn: t.name.en,
      descriptionAr: t.description.ar, descriptionEn: t.description.en,
      requirementsText: JSON.stringify(t.requirements, null, 2),
      color: t.color,
      tier: String(t.tier),
      sortOrder: String(t.sortOrder),
      isPublished: t.isPublished,
    });
    setShowForm(true);
  };

  const save = async () => {
    let requirements: any[] = [];
    try {
      requirements = JSON.parse(form.requirementsText || '[]');
    } catch {
      alert('Invalid JSON in requirements. Format: [{"ar":"...","en":"..."}]');
      return;
    }
    const body = {
      slug: form.slug,
      name: { ar: form.nameAr, en: form.nameEn },
      description: { ar: form.descriptionAr, en: form.descriptionEn },
      requirements,
      color: form.color,
      tier: Number(form.tier),
      sortOrder: Number(form.sortOrder),
      isPublished: form.isPublished,
    };
    try {
      if (editing) await api.put(`/titles/${editing.id}`, body);
      else await api.post('/titles', body);
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/titles/${id}`);
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Titles (ألقاب قمرة)</h1>
        <Button onClick={openNew}>Add Title</Button>
      </div>

      {loading ? <div className="text-white/50">Loading...</div> : items.length === 0 ? (
        <div className="text-white/30 py-20 text-center">No titles yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-secondary rounded-xl p-5 border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-light shrink-0"
                style={{ backgroundColor: `${t.color}22`, color: t.color }}>
                {t.tier}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{t.name.en || t.name.ar}</p>
                <p className="text-xs text-white/40 truncate">{t.description.en || t.description.ar}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => del(t.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit' : 'Add Title'} className="max-w-2xl">
        <div className="space-y-3">
          <Input id="slug" label="Slug (unique)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="descriptionAr" label="Description (AR)" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
            <Input id="descriptionEn" label="Description (EN)" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Requirements (JSON array of {`{ar, en}`})</label>
            <textarea
              className="w-full px-3 py-2 bg-elevated rounded-lg text-sm text-white font-mono resize-none"
              rows={6}
              value={form.requirementsText}
              onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
              placeholder='[{"ar":"شرط 1","en":"Requirement 1"}]'
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input id="tier" type="number" label="Tier (1-6)" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
            <Input id="sortOrder" type="number" label="Sort Order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            <div>
              <label className="block text-sm text-white/70 mb-1">Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-10 rounded-lg bg-elevated cursor-pointer" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
            Published
          </label>
          <Button onClick={save} className="w-full">{editing ? 'Save' : 'Create'}</Button>
        </div>
      </Modal>
    </div>
  );
}
