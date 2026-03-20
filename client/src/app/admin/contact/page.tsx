'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { ContactMessage, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<ContactMessage>>('/contact/messages', { params: { limit: 50 } });
      setMessages(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/contact/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
    } catch { /* empty */ }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/contact/messages/${id}/archive`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setSelected(null);
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setSelected(null);
    } catch { /* empty */ }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-white/50 text-center py-20">No messages</div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => {
                setSelected(msg);
                if (!msg.isRead) handleMarkRead(msg._id);
              }}
              className={`bg-secondary rounded-xl p-4 border cursor-pointer transition-colors ${
                msg.isRead ? 'border-white/5' : 'border-accent/30 bg-accent/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {!msg.isRead && <div className="w-2 h-2 rounded-full bg-accent" />}
                  <span className="font-medium text-sm">{msg.name}</span>
                  <Badge>{msg.type}</Badge>
                </div>
                <span className="text-xs text-white/30">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-white/70 truncate">{msg.subject}</p>
              <p className="text-xs text-white/40 truncate">{msg.message}</p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject}
        className="max-w-lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40">Name:</span> {selected.name}</div>
              <div><span className="text-white/40">Email:</span> {selected.email}</div>
              {selected.phone && <div><span className="text-white/40">Phone:</span> {selected.phone}</div>}
              <div><span className="text-white/40">Type:</span> {selected.type}</div>
            </div>
            <p className="text-white/80 whitespace-pre-wrap">{selected.message}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleArchive(selected._id)}>Archive</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(selected._id)}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
