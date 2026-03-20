'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import type { QomraWeekPhoto, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminQomraWeekEditionPage() {
  const params = useParams();
  const editionNum = params?.edition as string;
  const [photos, setPhotos] = useState<QomraWeekPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titleAr: '', titleEn: '', photographerAr: '', photographerEn: '',
    isWinner: false, winnerPlace: 0,
  });

  const fetchPhotos = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<QomraWeekPhoto>>(`/qomra-week/editions/${editionNum}/photos`, { params: { limit: 100 } });
      setPhotos(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchPhotos(); }, [editionNum]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data: upload } = await api.post(`/upload/image?folder=qomra/qomra-week/${editionNum}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.post(`/qomra-week/editions/${editionNum}/photos`, {
        title: { ar: form.titleAr, en: form.titleEn },
        photographerName: { ar: form.photographerAr, en: form.photographerEn },
        imageUrl: upload.url,
        thumbnailUrl: upload.thumbnailUrl,
        blurDataUrl: upload.blurDataUrl,
        cloudinaryPublicId: upload.publicId,
        width: upload.width,
        height: upload.height,
        isWinner: form.isWinner,
        winnerPlace: form.winnerPlace,
      });

      fetchPhotos();
      setShowForm(false);
      setForm({ titleAr: '', titleEn: '', photographerAr: '', photographerEn: '', isWinner: false, winnerPlace: 0 });
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await api.delete(`/qomra-week/editions/${editionNum}/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edition {editionNum} Photos</h1>
        <Button onClick={() => setShowForm(true)}>Add Photo</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo._id} className="bg-secondary rounded-lg overflow-hidden border border-white/5">
              <div className="aspect-square relative">
                <Image
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title.en || photo.title.ar}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {photo.isWinner && (
                  <div className="absolute top-2 start-2">
                    <Badge variant="accent">#{photo.winnerPlace}</Badge>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{photo.title.en || photo.title.ar || 'Untitled'}</p>
                <p className="text-xs text-white/40">{photo.photographerName.en || photo.photographerName.ar}</p>
                <Button size="sm" variant="danger" onClick={() => handleDelete(photo._id)} className="mt-2">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Photo" className="max-w-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="titleAr" label="Title (AR)" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <Input id="titleEn" label="Title (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="photographerAr" label="Photographer (AR)" value={form.photographerAr} onChange={(e) => setForm({ ...form, photographerAr: e.target.value })} />
            <Input id="photographerEn" label="Photographer (EN)" value={form.photographerEn} onChange={(e) => setForm({ ...form, photographerEn: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={form.isWinner} onChange={(e) => setForm({ ...form, isWinner: e.target.checked })} className="accent-accent" />
              Winner
            </label>
            {form.isWinner && (
              <Input id="winnerPlace" type="number" label="Place" value={String(form.winnerPlace)} onChange={(e) => setForm({ ...form, winnerPlace: Number(e.target.value) })} className="w-20" />
            )}
          </div>
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
        </div>
      </Modal>
    </div>
  );
}
