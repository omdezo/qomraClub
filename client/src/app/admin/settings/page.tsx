'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { SiteSettings } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteNameAr: '', siteNameEn: '', taglineAr: '', taglineEn: '',
    missionAr: '', missionEn: '', email: '', phone: '', universityAr: '', universityEn: '',
    instagram: '', twitter: '', youtube: '', tiktok: '',
    announcementEnabled: false, announcementAr: '', announcementEn: '', announcementLink: '',
  });

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setSettings(data);
      setForm({
        siteNameAr: data.siteName?.ar || '', siteNameEn: data.siteName?.en || '',
        taglineAr: data.tagline?.ar || '', taglineEn: data.tagline?.en || '',
        missionAr: data.mission?.ar || '', missionEn: data.mission?.en || '',
        email: data.contactInfo?.email || '', phone: data.contactInfo?.phone || '',
        universityAr: data.contactInfo?.university?.ar || '', universityEn: data.contactInfo?.university?.en || '',
        instagram: data.socialLinks?.instagram || '', twitter: data.socialLinks?.twitter || '',
        youtube: data.socialLinks?.youtube || '', tiktok: data.socialLinks?.tiktok || '',
        announcementEnabled: data.announcementBar?.enabled || false,
        announcementAr: data.announcementBar?.text?.ar || '', announcementEn: data.announcementBar?.text?.en || '',
        announcementLink: data.announcementBar?.link || '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', {
        siteName: { ar: form.siteNameAr, en: form.siteNameEn },
        tagline: { ar: form.taglineAr, en: form.taglineEn },
        mission: { ar: form.missionAr, en: form.missionEn },
        contactInfo: { email: form.email, phone: form.phone, university: { ar: form.universityAr, en: form.universityEn } },
        socialLinks: { instagram: form.instagram, twitter: form.twitter, youtube: form.youtube, tiktok: form.tiktok },
        announcementBar: { enabled: form.announcementEnabled, text: { ar: form.announcementAr, en: form.announcementEn }, link: form.announcementLink },
      });
    } catch { /* empty */ }
    setSaving(false);
  };

  if (loading) return <div className="text-white/50">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-secondary rounded-xl p-6 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold">General</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input id="siteNameAr" label="Site Name (AR)" value={form.siteNameAr} onChange={(e) => setForm({ ...form, siteNameAr: e.target.value })} />
            <Input id="siteNameEn" label="Site Name (EN)" value={form.siteNameEn} onChange={(e) => setForm({ ...form, siteNameEn: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="taglineAr" label="Tagline (AR)" value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} />
            <Input id="taglineEn" label="Tagline (EN)" value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} />
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input id="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="universityAr" label="University (AR)" value={form.universityAr} onChange={(e) => setForm({ ...form, universityAr: e.target.value })} />
            <Input id="universityEn" label="University (EN)" value={form.universityEn} onChange={(e) => setForm({ ...form, universityEn: e.target.value })} />
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input id="instagram" label="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            <Input id="twitter" label="X (Twitter)" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
            <Input id="youtube" label="YouTube" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
            <Input id="tiktok" label="TikTok" value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} />
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-6 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold">Announcement Bar</h2>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={form.announcementEnabled} onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })} className="accent-accent" />
            Enable
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input id="announcementAr" label="Text (AR)" value={form.announcementAr} onChange={(e) => setForm({ ...form, announcementAr: e.target.value })} />
            <Input id="announcementEn" label="Text (EN)" value={form.announcementEn} onChange={(e) => setForm({ ...form, announcementEn: e.target.value })} />
          </div>
          <Input id="announcementLink" label="Link" value={form.announcementLink} onChange={(e) => setForm({ ...form, announcementLink: e.target.value })} />
        </div>

        <Button onClick={handleSave} size="lg" className="w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
