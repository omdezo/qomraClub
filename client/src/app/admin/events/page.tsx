'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Event, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({
    titleAr: '', titleEn: '', slugAr: '', slugEn: '', descAr: '', descEn: '',
    contentAr: '', contentEn: '', type: 'meetup' as Event['type'],
    date: '', locationAr: '', locationEn: '', isPublished: true,
  });

  const fetchEvents = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Event>>('/events/admin/all', { params: { limit: 50 } });
      setEvents(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async () => {
    const body = {
      title: { ar: form.titleAr, en: form.titleEn },
      slug: { ar: form.slugAr || form.titleAr, en: form.slugEn || form.titleEn.toLowerCase().replace(/\s+/g, '-') },
      description: { ar: form.descAr, en: form.descEn },
      content: { ar: form.contentAr, en: form.contentEn },
      type: form.type,
      date: form.date,
      location: { ar: form.locationAr, en: form.locationEn },
      isPublished: form.isPublished,
    };

    try {
      if (editing) {
        await api.put(`/events/${editing._id}`, body);
      } else {
        await api.post('/events', body);
      }
      fetchEvents();
      setShowForm(false);
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch { /* empty */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Add Event</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event._id} className="bg-secondary rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{event.title.en || event.title.ar}</h3>
                  <Badge>{event.type}</Badge>
                  {!event.isPublished && <Badge variant="error">Draft</Badge>}
                </div>
                <p className="text-xs text-white/40">
                  {new Date(event.date).toLocaleDateString()} &bull; {event.location.en || event.location.ar}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => {
                  setEditing(event);
                  setForm({
                    titleAr: event.title.ar, titleEn: event.title.en,
                    slugAr: event.slug.ar, slugEn: event.slug.en,
                    descAr: event.description.ar, descEn: event.description.en,
                    contentAr: event.content.ar, contentEn: event.content.en,
                    type: event.type, date: event.date.split('T')[0],
                    locationAr: event.location.ar, locationEn: event.location.en,
                    isPublished: event.isPublished,
                  });
                  setShowForm(true);
                }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(event._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Edit Event' : 'Add Event'}
        className="max-w-lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Input id="titleAr" label="Title (AR)" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
            <Input id="titleEn" label="Title (EN)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="slugEn" label="Slug (EN)" value={form.slugEn} onChange={(e) => setForm({ ...form, slugEn: e.target.value })} />
            <div>
              <label className="block text-sm text-white/70 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Event['type'] })}
                className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
              >
                {['exhibition', 'workshop', 'trip', 'meetup', 'competition'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <Input id="date" type="date" label="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="locationAr" label="Location (AR)" value={form.locationAr} onChange={(e) => setForm({ ...form, locationAr: e.target.value })} />
            <Input id="locationEn" label="Location (EN)" value={form.locationEn} onChange={(e) => setForm({ ...form, locationEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="descAr" label="Description (AR)" value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} />
            <Input id="descEn" label="Description (EN)" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
            Published
          </label>
          <Button onClick={handleSave} className="w-full">
            {editing ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
