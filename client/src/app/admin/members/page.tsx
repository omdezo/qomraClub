'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import type { Member, PaginatedResponse } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', roleAr: '', roleEn: '', bioAr: '', bioEn: '',
    isBoardMember: false, isPublished: true,
  });

  const fetchMembers = async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Member>>('/members/admin/all', { params: { limit: 50 } });
      setMembers(data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSave = async () => {
    const body = {
      name: { ar: form.nameAr, en: form.nameEn },
      role: { ar: form.roleAr, en: form.roleEn },
      bio: { ar: form.bioAr, en: form.bioEn },
      isBoardMember: form.isBoardMember,
      isPublished: form.isPublished,
    };

    try {
      if (editing) {
        await api.put(`/members/${editing._id}`, body);
      } else {
        await api.post('/members', body);
      }
      fetchMembers();
      setShowForm(false);
      resetForm();
    } catch { /* empty */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch { /* empty */ }
  };

  const resetForm = () => {
    setForm({ nameAr: '', nameEn: '', roleAr: '', roleEn: '', bioAr: '', bioEn: '', isBoardMember: false, isPublished: true });
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>Add Member</Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading...</div>
      ) : (
        <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs text-white/40">
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-elevated overflow-hidden">
                        {member.avatarUrl ? (
                          <Image src={member.avatarUrl} alt="" width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/20">
                            {(member.name.en || member.name.ar).charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name.en || member.name.ar}</p>
                        <p className="text-xs text-white/40">{member.name.ar}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-white/60">{member.role.en || member.role.ar}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {member.isBoardMember && <Badge variant="accent">Board</Badge>}
                      {!member.isPublished && <Badge variant="error">Draft</Badge>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditing(member);
                        setForm({
                          nameAr: member.name.ar, nameEn: member.name.en,
                          roleAr: member.role.ar, roleEn: member.role.en,
                          bioAr: member.bio.ar, bioEn: member.bio.en,
                          isBoardMember: member.isBoardMember, isPublished: member.isPublished,
                        });
                        setShowForm(true);
                      }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(member._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editing ? 'Edit Member' : 'Add Member'}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="nameAr" label="Name (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            <Input id="nameEn" label="Name (EN)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="roleAr" label="Role (AR)" value={form.roleAr} onChange={(e) => setForm({ ...form, roleAr: e.target.value })} />
            <Input id="roleEn" label="Role (EN)" value={form.roleEn} onChange={(e) => setForm({ ...form, roleEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="bioAr" label="Bio (AR)" value={form.bioAr} onChange={(e) => setForm({ ...form, bioAr: e.target.value })} />
            <Input id="bioEn" label="Bio (EN)" value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={form.isBoardMember} onChange={(e) => setForm({ ...form, isBoardMember: e.target.checked })} className="accent-accent" />
              Board Member
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-accent" />
              Published
            </label>
          </div>
          <Button onClick={handleSave} className="w-full">
            {editing ? 'Save Changes' : 'Create Member'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
