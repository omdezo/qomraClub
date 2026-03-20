'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

interface GItem {
  _id: string;
  image: string;
  name: { ar: string; en: string };
  year: number;
  section: 'spotlight' | 'grid';
  sortOrder: number;
  isPublished: boolean;
}

export default function AdminGalleryPage() {
  const [tab, setTab] = useState<'spotlight' | 'grid' | 'hero-preview'>('spotlight');
  const [items, setItems] = useState<GItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nameAr: '', nameEn: '', year: String(new Date().getFullYear()), isPublished: true });

  const fetchItems = async (section: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/gallery-items/admin/all?section=${section}`);
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchItems(tab); }, [tab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data: upload } = await api.post(`/upload/image?folder=qomra/gallery/${tab}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await api.post('/gallery-items', {
        image: upload.url,
        cloudinaryPublicId: upload.publicId,
        name: { ar: form.nameAr, en: form.nameEn },
        year: Number(form.year),
        section: tab,
        sortOrder: items.length,
        isPublished: form.isPublished,
      });
      fetchItems(tab);
      setShowForm(false);
      setForm({ nameAr: '', nameEn: '', year: String(new Date().getFullYear()), isPublished: true });
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await api.put(`/gallery-items/${editing._id}`, {
        name: { ar: form.nameAr, en: form.nameEn },
        year: Number(form.year),
        isPublished: form.isPublished,
      });
      fetchItems(tab);
      setShowForm(false);
      setEditing(null);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/gallery-items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button onClick={() => { setEditing(null); setForm({ nameAr: '', nameEn: '', year: String(new Date().getFullYear()), isPublished: true }); setShowForm(true); }}>
          Add Item
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {(['hero-preview', 'spotlight', 'grid'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-accent text-primary' : 'bg-secondary text-white/60 hover:text-white'
            }`}
          >
            {t === 'hero-preview' ? 'Hero Preview (3)' : t === 'spotlight' ? 'Spotlight Gallery (10)' : 'Expanding Grid (16+)'}
          </button>
        ))}
      </div>

      <p className="text-white/40 text-sm mb-4">
        {tab === 'hero-preview'
          ? 'The 3 floating preview images shown in the Gallery hero section at the top.'
          : tab === 'spotlight'
          ? 'These are the 10 photos shown in the full-screen scroll gallery on the Gallery page.'
          : 'These photos appear in the expanding rows grid below the spotlight gallery.'}
      </p>

      {/* Items grid */}
      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-white/30 py-20">No items yet. Click &quot;Add Item&quot; to start.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <div key={item._id} className="bg-secondary rounded-lg overflow-hidden border border-white/5">
              <div className="aspect-video relative">
                <img src={item.image} alt={item.name.en || item.name.ar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="absolute top-2 end-2 flex gap-1">
                  {!item.isPublished && <Badge variant="error">Draft</Badge>}
                  <Badge variant="accent">#{i + 1}</Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.name.en || item.name.ar || 'Untitled'}</p>
                <p className="text-xs text-white/40">{item.name.ar} &bull; {item.year}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setEditing(item);
                    setForm({ nameAr: item.name.ar, nameEn: item.name.en, year: String(item.year), isPublished: item.isPublished });
                    setShowForm(true);
                  }}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Edit Item' : `Add ${tab === 'spotlight' ? 'Spotlight' : 'Grid'} Item`}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <Input id="year" type="number" label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
            Published
          </label>

          {editing ? (
            <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
          ) : (
            <div>
              <label className="block text-sm text-white/70 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-primary file:font-medium file:cursor-pointer"
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-accent mt-1">Uploading...</p>}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
