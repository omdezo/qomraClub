'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Section {
  _id: string;
  section: string;
  enabled: boolean;
  data: any;
  sortOrder: number;
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  parallax: 'Parallax Photo Grid',
  qomraWeek: 'Qomra Week Banner',
  featured: 'Featured Works (Horizontal Scroll)',
  events: 'Latest Events',
  joinCta: 'Join CTA',
};

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    api.get('/homepage/admin/all')
      .then(({ data }) => setSections(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateSection = async (sectionType: string, updates: any) => {
    setSaving(sectionType);
    try {
      const { data } = await api.put(`/homepage/${sectionType}`, updates);
      setSections((prev) => prev.map((s) => (s.section === sectionType ? data : s)));
    } catch {}
    setSaving(null);
  };

  const handleImageUpload = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post(`/upload/image?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  };

  if (loading) return <div className="text-white/50">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Homepage Sections</h1>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.section} className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setOpenSection(openSection === section.section ? null : section.section)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${section.enabled ? 'bg-success' : 'bg-error'}`} />
                <h2 className="font-medium">{SECTION_LABELS[section.section] || section.section}</h2>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-white/60" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => updateSection(section.section, { enabled: e.target.checked })}
                    className="accent-accent"
                  />
                  Enabled
                </label>
                <span className="text-white/30 text-sm">{openSection === section.section ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Body */}
            {openSection === section.section && (
              <div className="border-t border-white/5 p-4">
                <SectionEditor
                  section={section}
                  onSave={(data) => updateSection(section.section, { data })}
                  onUpload={handleImageUpload}
                  saving={saving === section.section}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  onSave,
  onUpload,
  saving,
}: {
  section: Section;
  onSave: (data: any) => void;
  onUpload: (file: File, folder: string) => Promise<string>;
  saving: boolean;
}) {
  const [data, setData] = useState(section.data || {});

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateBilingual = (key: string, lang: 'ar' | 'en', value: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [lang]: value },
    }));
  };

  switch (section.section) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Hero Image</label>
            {data.heroImage && (
              <div className="w-40 h-24 rounded-lg overflow-hidden mb-2">
                <img src={data.heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await onUpload(file, 'qomra/homepage');
              updateField('heroImage', url);
            }} className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-primary file:font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title (AR)" value={data.heroTitle?.ar || ''} onChange={(e) => updateBilingual('heroTitle', 'ar', e.target.value)} id="heroTitleAr" />
            <Input label="Title (EN)" value={data.heroTitle?.en || ''} onChange={(e) => updateBilingual('heroTitle', 'en', e.target.value)} id="heroTitleEn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Subtitle (AR)" value={data.heroSubtitle?.ar || ''} onChange={(e) => updateBilingual('heroSubtitle', 'ar', e.target.value)} id="heroSubAr" />
            <Input label="Subtitle (EN)" value={data.heroSubtitle?.en || ''} onChange={(e) => updateBilingual('heroSubtitle', 'en', e.target.value)} id="heroSubEn" />
          </div>
          <Button onClick={() => onSave(data)} disabled={saving}>{saving ? 'Saving...' : 'Save Hero'}</Button>
        </div>
      );

    case 'parallax':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Center Text (AR)" value={data.parallaxText?.ar || ''} onChange={(e) => updateBilingual('parallaxText', 'ar', e.target.value)} id="pxTextAr" />
            <Input label="Center Text (EN)" value={data.parallaxText?.en || ''} onChange={(e) => updateBilingual('parallaxText', 'en', e.target.value)} id="pxTextEn" />
          </div>
          <label className="block text-sm text-white/70">Images (16)</label>
          <div className="grid grid-cols-8 gap-2">
            {(data.parallaxImages || []).map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-elevated relative group">
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-[10px] text-white">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await onUpload(file, 'qomra/homepage/parallax');
                    const imgs = [...(data.parallaxImages || [])];
                    imgs[i] = url;
                    updateField('parallaxImages', imgs);
                  }} />
                </label>
              </div>
            ))}
          </div>
          <Button onClick={() => onSave(data)} disabled={saving}>{saving ? 'Saving...' : 'Save Parallax'}</Button>
        </div>
      );

    case 'qomraWeek':
      return (
        <div className="space-y-4">
          <Input label="Edition Number" type="number" value={String(data.editionNumber || 11)} onChange={(e) => updateField('editionNumber', Number(e.target.value))} id="qwNum" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title (AR)" value={data.editionTitle?.ar || ''} onChange={(e) => updateBilingual('editionTitle', 'ar', e.target.value)} id="qwTitleAr" />
            <Input label="Title (EN)" value={data.editionTitle?.en || ''} onChange={(e) => updateBilingual('editionTitle', 'en', e.target.value)} id="qwTitleEn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Description (AR)" value={data.editionDescription?.ar || ''} onChange={(e) => updateBilingual('editionDescription', 'ar', e.target.value)} id="qwDescAr" />
            <Input label="Description (EN)" value={data.editionDescription?.en || ''} onChange={(e) => updateBilingual('editionDescription', 'en', e.target.value)} id="qwDescEn" />
          </div>
          <Button onClick={() => onSave(data)} disabled={saving}>{saving ? 'Saving...' : 'Save Qomra Week'}</Button>
        </div>
      );

    case 'featured':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Section Label (AR)" value={data.featuredLabel?.ar || ''} onChange={(e) => updateBilingual('featuredLabel', 'ar', e.target.value)} id="featLabelAr" />
            <Input label="Section Label (EN)" value={data.featuredLabel?.en || ''} onChange={(e) => updateBilingual('featuredLabel', 'en', e.target.value)} id="featLabelEn" />
          </div>
          <label className="block text-sm text-white/70">Featured Photos ({(data.featuredImages || []).length})</label>
          <div className="grid grid-cols-4 gap-3">
            {(data.featuredImages || []).map((item: any, i: number) => (
              <div key={i} className="bg-elevated rounded-lg p-2 space-y-2">
                <div className="aspect-[3/4] rounded overflow-hidden bg-primary">
                  <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <input type="file" accept="image/*" className="text-[10px] text-white/40 w-full" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await onUpload(file, 'qomra/homepage/featured');
                  const imgs = [...(data.featuredImages || [])];
                  imgs[i] = { ...imgs[i], image: url };
                  updateField('featuredImages', imgs);
                }} />
                <input className="w-full px-2 py-1 bg-primary border border-white/10 rounded text-xs text-white" placeholder="Title AR" value={item.title?.ar || ''} onChange={(e) => {
                  const imgs = [...(data.featuredImages || [])];
                  imgs[i] = { ...imgs[i], title: { ...imgs[i].title, ar: e.target.value } };
                  updateField('featuredImages', imgs);
                }} />
                <input className="w-full px-2 py-1 bg-primary border border-white/10 rounded text-xs text-white" placeholder="Title EN" value={item.title?.en || ''} onChange={(e) => {
                  const imgs = [...(data.featuredImages || [])];
                  imgs[i] = { ...imgs[i], title: { ...imgs[i].title, en: e.target.value } };
                  updateField('featuredImages', imgs);
                }} />
              </div>
            ))}
          </div>
          <Button onClick={() => onSave(data)} disabled={saving}>{saving ? 'Saving...' : 'Save Featured'}</Button>
        </div>
      );

    case 'events':
      return (
        <div>
          <p className="text-white/50 text-sm">Events are auto-populated from the Events section. Use the toggle above to show/hide this section on the homepage.</p>
        </div>
      );

    case 'joinCta':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title (AR)" value={data.ctaTitle?.ar || ''} onChange={(e) => updateBilingual('ctaTitle', 'ar', e.target.value)} id="ctaTitleAr" />
            <Input label="Title (EN)" value={data.ctaTitle?.en || ''} onChange={(e) => updateBilingual('ctaTitle', 'en', e.target.value)} id="ctaTitleEn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Description (AR)" value={data.ctaDescription?.ar || ''} onChange={(e) => updateBilingual('ctaDescription', 'ar', e.target.value)} id="ctaDescAr" />
            <Input label="Description (EN)" value={data.ctaDescription?.en || ''} onChange={(e) => updateBilingual('ctaDescription', 'en', e.target.value)} id="ctaDescEn" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Button Text (AR)" value={data.ctaButtonText?.ar || ''} onChange={(e) => updateBilingual('ctaButtonText', 'ar', e.target.value)} id="ctaBtnAr" />
            <Input label="Button Text (EN)" value={data.ctaButtonText?.en || ''} onChange={(e) => updateBilingual('ctaButtonText', 'en', e.target.value)} id="ctaBtnEn" />
          </div>
          <Button onClick={() => onSave(data)} disabled={saving}>{saving ? 'Saving...' : 'Save CTA'}</Button>
        </div>
      );

    default:
      return <p className="text-white/50">Unknown section type</p>;
  }
}
