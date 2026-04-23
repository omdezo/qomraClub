'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface Partner {
  id: string;
  name: { ar: string; en: string };
  logoUrl: string;
  websiteUrl: string;
  description: { ar: string; en: string };
  sortOrder: number;
  isPublished: boolean;
}

const emptyForm = {
  nameAr: '', nameEn: '',
  logoUrl: '',
  websiteUrl: '',
  descriptionAr: '', descriptionEn: '',
  sortOrder: '0',
  isPublished: true,
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/partners/admin/all');
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({
      nameAr: p.name.ar, nameEn: p.name.en,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl,
      descriptionAr: p.description.ar, descriptionEn: p.description.en,
      sortOrder: String(p.sortOrder),
      isPublished: p.isPublished,
    });
    setShowForm(true);
  };

  const save = async () => {
    const body = {
      name: { ar: form.nameAr, en: form.nameEn },
      logoUrl: form.logoUrl,
      websiteUrl: form.websiteUrl,
      description: { ar: form.descriptionAr, en: form.descriptionEn },
      sortOrder: Number(form.sortOrder),
      isPublished: form.isPublished,
    };
    try {
      if (editing) await api.put(`/partners/${editing.id}`, body);
      else await api.post('/partners', body);
      setShowForm(false);
      fetchItems();
    } catch {}
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/partners/${id}`);
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Partners (شركاء النجاح)</h1>
        <Button onClick={openNew}>Add Partner</Button>
      </div>

      {loading ? <div className="text-white/50">Loading...</div> : items.length === 0 ? (
        <div className="text-white/30 py-20 text-center">No partners yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-secondary rounded-xl p-4 border border-white/5">
              <div className="h-20 flex items-center justify-center mb-3 bg-elevated rounded-lg">
                {p.logoUrl && <img src={p.logoUrl} alt="" className="max-h-full max-w-full object-contain" />}
              </div>
              <p className="text-sm font-medium truncate mb-2">{p.name.en || p.name.ar}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => del(p.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit' : 'Add Partner'} className="max-w-xl">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <Input id="logoUrl" label="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          <Input id="websiteUrl" label="Website URL" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="descriptionAr" label="Description (AR)" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
            <Input id="descriptionEn" label="Description (EN)" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          </div>
          <Input id="sortOrder" type="number" label="Sort Order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
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
