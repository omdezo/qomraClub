'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Locale } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TextReveal from '@/components/animations/TextReveal';

export default function ContactPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const typeOptions = [
    { value: 'general', label: locale === 'ar' ? 'استفسار عام' : 'General Inquiry' },
    { value: 'membership', label: locale === 'ar' ? 'عضوية' : 'Membership' },
    { value: 'service-request', label: locale === 'ar' ? 'طلب خدمة' : 'Service Request' },
    { value: 'sponsorship', label: locale === 'ar' ? 'رعاية' : 'Sponsorship' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
    } catch (err: any) {
      setError(err?.response?.data?.message || (locale === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <TextReveal className="text-4xl font-bold mb-4">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </TextReveal>
          <p className="text-white/50">
            {locale === 'ar' ? 'نسعد بتواصلكم معنا' : 'We\'d love to hear from you'}
          </p>
        </div>

        {success ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">&#10003;</div>
            <h2 className="text-2xl font-bold text-accent mb-2">
              {locale === 'ar' ? 'تم الإرسال!' : 'Sent!'}
            </h2>
            <p className="text-white/50">
              {locale === 'ar' ? 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً' : 'Your message has been sent successfully. We\'ll get back to you soon.'}
            </p>
            <Button onClick={() => setSuccess(false)} variant="secondary" className="mt-6">
              {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              label={locale === 'ar' ? 'الاسم' : 'Name'}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              id="email"
              type="email"
              label={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              id="phone"
              label={locale === 'ar' ? 'الهاتف (اختياري)' : 'Phone (optional)'}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="space-y-1">
              <label htmlFor="type" className="block text-sm text-white/70">
                {locale === 'ar' ? 'نوع الرسالة' : 'Message Type'}
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                suppressHydrationWarning
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} suppressHydrationWarning>{opt.label}</option>
                ))}
              </select>
            </div>

            <Input
              id="subject"
              label={locale === 'ar' ? 'الموضوع' : 'Subject'}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />

            <div className="space-y-1">
              <label htmlFor="message" className="block text-sm text-white/70">
                {locale === 'ar' ? 'الرسالة' : 'Message'}
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-elevated border border-white/10 rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading
                ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                : (locale === 'ar' ? 'إرسال' : 'Send')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
