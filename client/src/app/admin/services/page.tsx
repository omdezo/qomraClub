'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Service, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    memberId: '', titleAr: '', titleEn: '', descAr: '', descEn: '',
    category: 'photography', priceAr: '', priceEn: '', contactEmail: '',
    isAvailable: true, isPublished: true,
  });

  const fetchServices = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Service>>('/services/admin/all', { params: { limit: 50 } });
      setServices(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async () => {
    try {
      await api.post('/services', {
        member: form.memberId,
        title: { ar: form.titleAr, en: form.titleEn },
        description: { ar: form.descAr, en: form.descEn },
        category: form.category,
        priceRange: { ar: form.priceAr, en: form.priceEn },
        contactEmail: form.contactEmail,
        isAvailable: form.isAvailable,
        isPublished: form.isPublished,
      });
      fetchServices();
      setShowForm(false);
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setShowForm(true)}>Add Service</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service._id} className="bg-secondary rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{service.title.en || service.title.ar}</h3>
                  <Badge>{service.category}</Badge>
                  <Badge variant={service.isAvailable ? 'success' : 'error'}>
                    {service.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="danger" onClick={() => handleDelete(service._id)}>Delete</Button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Service" className="max-w-lg">
        <div className="space-y-4">
          <Input id="memberId" label="Member ID" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="titleAr" label="Title (AR)" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <Input id="titleEn" label="Title (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="descAr" label="Description (AR)" value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} />
            <Input id="descEn" label="Description (EN)" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="priceAr" label="السعر (ر.ع)" placeholder="مثال: ٥٠ ر.ع" value={form.priceAr} onChange={(e) => setForm({ ...form, priceAr: e.target.value })} />
            <Input id="priceEn" label="Price (OMR)" placeholder="e.g. 50 OMR" value={form.priceEn} onChange={(e) => setForm({ ...form, priceEn: e.target.value })} />
          </div>
          <Input id="contactEmail" label="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          <Button onClick={handleSave} className="w-full">Create Service</Button>
        </div>
      </Modal>
    </div>
  );
}
