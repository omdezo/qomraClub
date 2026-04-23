'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

interface Alum {
  id: string;
  name: { ar: string; en: string };
  graduationYear: number;
  major: { ar: string; en: string };
  currentRole: { ar: string; en: string };
  bio: { ar: string; en: string };
  avatarUrl: string;
  title: string;
  sortOrder: number;
  isPublished: boolean;
}

const emptyForm = {
  nameAr: '', nameEn: '',
  graduationYear: String(new Date().getFullYear()),
  majorAr: '', majorEn: '',
  currentRoleAr: '', currentRoleEn: '',
  bioAr: '', bioEn: '',
  avatarUrl: '',
  title: '',
  sortOrder: '0',
  isPublished: true,
};

export default function AdminAlumniPage() {
  const [items, setItems] = useState<Alum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Alum | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/alumni/admin/all');
      setItems(data.data || data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (a: Alum) => {
    setEditing(a);
    setForm({
      nameAr: a.name.ar, nameEn: a.name.en,
      graduationYear: String(a.graduationYear),
      majorAr: a.major.ar, majorEn: a.major.en,
      currentRoleAr: a.currentRole.ar, currentRoleEn: a.currentRole.en,
      bioAr: a.bio.ar, bioEn: a.bio.en,
      avatarUrl: a.avatarUrl,
      title: a.title || '',
      sortOrder: String(a.sortOrder),
      isPublished: a.isPublished,
    });
    setShowForm(true);
  };

  const save = async () => {
    const body = {
      name: { ar: form.nameAr, en: form.nameEn },
      graduationYear: Number(form.graduationYear),
      major: { ar: form.majorAr, en: form.majorEn },
      currentRole: { ar: form.currentRoleAr, en: form.currentRoleEn },
      bio: { ar: form.bioAr, en: form.bioEn },
      avatarUrl: form.avatarUrl,
      title: form.title,
      sortOrder: Number(form.sortOrder),
      isPublished: form.isPublished,
    };
    try {
      if (editing) await api.put(`/alumni/${editing.id}`, body);
      else await api.post('/alumni', body);
      setShowForm(false);
      fetchItems();
    } catch {}
  };

  const del = async (id: string) => {
    if (!confirm('Delete this alumnus?')) return;
    await api.delete(`/alumni/${id}`);
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Alumni (خريجو قمرة)</h1>
        <Button onClick={openNew}>Add Alumnus</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-white/30 py-20 text-center">No alumni yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((a) => (
            <div key={a.id} className="bg-secondary rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-elevated overflow-hidden shrink-0">
                  {a.avatarUrl && <img src={a.avatarUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.name.en || a.name.ar}</p>
                  <p className="text-xs text-white/40">{a.graduationYear} • {a.major.en || a.major.ar}</p>
                </div>
                {!a.isPublished && <Badge variant="error">Draft</Badge>}
              </div>
              <p className="text-xs text-white/50 mb-3 truncate">{a.currentRole.en || a.currentRole.ar}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => del(a.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Alumnus' : 'Add Alumnus'} className="max-w-2xl">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="graduationYear" type="number" label="Graduation Year" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
            <Input id="sortOrder" type="number" label="Sort Order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="majorAr" label="Major (AR)" value={form.majorAr} onChange={(e) => setForm({ ...form, majorAr: e.target.value })} />
            <Input id="majorEn" label="Major (EN)" value={form.majorEn} onChange={(e) => setForm({ ...form, majorEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="currentRoleAr" label="Current Role (AR)" value={form.currentRoleAr} onChange={(e) => setForm({ ...form, currentRoleAr: e.target.value })} />
            <Input id="currentRoleEn" label="Current Role (EN)" value={form.currentRoleEn} onChange={(e) => setForm({ ...form, currentRoleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="bioAr" label="Bio (AR)" value={form.bioAr} onChange={(e) => setForm({ ...form, bioAr: e.target.value })} />
            <Input id="bioEn" label="Bio (EN)" value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} />
          </div>
          <Input id="avatarUrl" label="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
          <Input id="title" label="Qomra Title (e.g. فخر قمرة)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
            Published
          </label>
          <Button onClick={save} className="w-full">{editing ? 'Save Changes' : 'Create'}</Button>
        </div>
      </Modal>
    </div>
  );
}
