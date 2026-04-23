'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface Testimonial {
  id: string;
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  quote: { ar: string; en: string };
  avatarUrl: string;
  organization: { ar: string; en: string };
  sortOrder: number;
  isPublished: boolean;
}

const emptyForm = {
  nameAr: '', nameEn: '',
  roleAr: '', roleEn: '',
  quoteAr: '', quoteEn: '',
  organizationAr: '', organizationEn: '',
  avatarUrl: '',
  sortOrder: '0',
  isPublished: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/testimonials/admin/all');
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      nameAr: t.name.ar, nameEn: t.name.en,
      roleAr: t.role.ar, roleEn: t.role.en,
      quoteAr: t.quote.ar, quoteEn: t.quote.en,
      organizationAr: t.organization.ar, organizationEn: t.organization.en,
      avatarUrl: t.avatarUrl,
      sortOrder: String(t.sortOrder),
      isPublished: t.isPublished,
    });
    setShowForm(true);
  };

  const save = async () => {
    const body = {
      name: { ar: form.nameAr, en: form.nameEn },
      role: { ar: form.roleAr, en: form.roleEn },
      quote: { ar: form.quoteAr, en: form.quoteEn },
      organization: { ar: form.organizationAr, en: form.organizationEn },
      avatarUrl: form.avatarUrl,
      sortOrder: Number(form.sortOrder),
      isPublished: form.isPublished,
    };
    try {
      if (editing) await api.put(`/testimonials/${editing.id}`, body);
      else await api.post('/testimonials', body);
      setShowForm(false);
      fetchItems();
    } catch {}
  };

  const del = async (id: string) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/testimonials/${id}`);
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials (قالوا عنا)</h1>
        <Button onClick={openNew}>Add Testimonial</Button>
      </div>

      {loading ? <div className="text-white/50">Loading...</div> : items.length === 0 ? (
        <div className="text-white/30 py-20 text-center">No testimonials yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-secondary rounded-xl p-5 border border-white/5">
              <p className="text-white/70 italic mb-3">&quot;{t.quote.en || t.quote.ar}&quot;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t.name.en || t.name.ar}</p>
                  <p className="text-xs text-white/40">{t.role.en || t.role.ar}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => del(t.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit' : 'Add Testimonial'} className="max-w-2xl">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="roleAr" label="Role (AR)" value={form.roleAr} onChange={(e) => setForm({ ...form, roleAr: e.target.value })} />
            <Input id="roleEn" label="Role (EN)" value={form.roleEn} onChange={(e) => setForm({ ...form, roleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="quoteAr" label="Quote (AR)" value={form.quoteAr} onChange={(e) => setForm({ ...form, quoteAr: e.target.value })} />
            <Input id="quoteEn" label="Quote (EN)" value={form.quoteEn} onChange={(e) => setForm({ ...form, quoteEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="organizationAr" label="Organization (AR)" value={form.organizationAr} onChange={(e) => setForm({ ...form, organizationAr: e.target.value })} />
            <Input id="organizationEn" label="Organization (EN)" value={form.organizationEn} onChange={(e) => setForm({ ...form, organizationEn: e.target.value })} />
          </div>
          <Input id="avatarUrl" label="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
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
