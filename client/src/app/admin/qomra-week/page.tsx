'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { QomraWeekEdition } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminQomraWeekPage() {
  const [editions, setEditions] = useState<QomraWeekEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    editionNumber: '', titleAr: '', titleEn: '', themeAr: '', themeEn: '',
    year: new Date().getFullYear().toString(), isPublished: true,
  });

  const fetchEditions = async () => {
    try {
      const { data } = await api.get('/qomra-week/admin/editions');
      setEditions(data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchEditions(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/qomra-week/editions', {
        editionNumber: Number(form.editionNumber),
        title: { ar: form.titleAr, en: form.titleEn },
        theme: { ar: form.themeAr, en: form.themeEn },
        year: Number(form.year),
        isPublished: form.isPublished,
      });
      fetchEditions();
      setShowForm(false);
    } catch { /* empty */ }
  };

  const handleDelete = async (num: number) => {
    if (!confirm(`Delete edition ${num} and all its photos?`)) return;
    try {
      await api.delete(`/qomra-week/editions/${num}`);
      setEditions((prev) => prev.filter((e) => e.editionNumber !== num));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Qomra Week</h1>
        <Button onClick={() => setShowForm(true)}>New Edition</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="space-y-3">
          {editions.map((edition) => (
            <div key={edition.editionNumber} className="bg-secondary rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{edition.title.en || edition.title.ar || `Edition ${edition.editionNumber}`}</h3>
                  <Badge variant="accent">#{edition.editionNumber}</Badge>
                  {edition.isCurrent && <Badge variant="success">Current</Badge>}
                </div>
                <p className="text-xs text-white/40">{edition.year} &bull; {edition.totalPhotos} photos</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/qomra-week/${edition.editionNumber}`}>
                  <Button size="sm" variant="secondary">Manage Photos</Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => handleDelete(edition.editionNumber)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Edition" className="max-w-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="editionNumber" label="Edition #" type="number" value={form.editionNumber} onChange={(e) => setForm({ ...form, editionNumber: e.target.value })} />
            <Input id="year" label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="titleAr" label="Title (AR)" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <Input id="titleEn" label="Title (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="themeAr" label="Theme (AR)" value={form.themeAr} onChange={(e) => setForm({ ...form, themeAr: e.target.value })} />
            <Input id="themeEn" label="Theme (EN)" value={form.themeEn} onChange={(e) => setForm({ ...form, themeEn: e.target.value })} />
          </div>
          <Button onClick={handleCreate} className="w-full">Create Edition</Button>
        </div>
      </Modal>
    </div>
  );
}
