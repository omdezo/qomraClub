'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { getBilingual } from '@/lib/utils';
import type { Locale, Service, Member, PaginatedResponse } from '@/types';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const categories = ['all', 'photography', 'videography', 'editing', 'design', 'event-coverage', 'photo-printing', 'private-upload', 'photo-booth'];

export default function ServicesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'ar';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categoryLabels: Record<string, Record<string, string>> = {
    all: { ar: 'الكل', en: 'All' },
    photography: { ar: 'تصوير', en: 'Photography' },
    videography: { ar: 'تصوير فيديو', en: 'Videography' },
    editing: { ar: 'تحرير', en: 'Editing' },
    design: { ar: 'تصميم', en: 'Design' },
    'event-coverage': { ar: 'تغطية فعاليات', en: 'Event Coverage' },
    'photo-printing': { ar: 'طباعة صور', en: 'Photo Printing' },
    'private-upload': { ar: 'رفع الصور - خاص', en: 'Private Photo Upload' },
    'photo-booth': { ar: 'بوث تصوير', en: 'Photo Booth' },
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const p: any = { limit: 20 };
        if (category !== 'all') p.category = category;
        const { data } = await api.get<PaginatedResponse<Service>>('/services', { params: p });
        setServices(data.data);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [category]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          {locale === 'ar' ? 'الخدمات' : 'Services'}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                category === cat ? 'bg-accent text-primary font-medium' : 'bg-secondary text-white/60 hover:text-white'
              }`}
            >
              {categoryLabels[cat]?.[locale] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            {locale === 'ar' ? 'لا توجد خدمات بعد' : 'No services yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const member = typeof service.member === 'object' ? service.member as Member : null;
              return (
                <div
                  key={service._id}
                  className="bg-secondary rounded-xl border border-white/5 hover:border-accent/20 transition-all overflow-hidden cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-elevated overflow-hidden">
                        {member?.avatarUrl ? (
                          <Image src={member.avatarUrl} alt="" width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-white/20">
                            {member ? getBilingual(member.name, locale).charAt(0) : '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member ? getBilingual(member.name, locale) : ''}</p>
                        <Badge variant={service.isAvailable ? 'success' : 'error'} className="text-[10px]">
                          {service.isAvailable ? (locale === 'ar' ? 'متاح' : 'Available') : (locale === 'ar' ? 'مشغول' : 'Busy')}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{getBilingual(service.title, locale)}</h3>
                    <p className="text-sm text-white/50 line-clamp-2">{getBilingual(service.description, locale)}</p>
                    {(service.priceRange.ar || service.priceRange.en) && (
                      <p className="text-sm text-accent mt-2">
                        {getBilingual(service.priceRange, locale)}
                        {/* Append currency if not already included */}
                        {locale === 'ar'
                          ? (!service.priceRange.ar.includes('ر.ع') ? ' ر.ع' : '')
                          : (!service.priceRange.en.toLowerCase().includes('omr') ? ' OMR' : '')
                        }
                      </p>
                    )}
                  </div>
                  {service.portfolioImages.length > 0 && (
                    <div className="flex gap-1 px-5 pb-4 overflow-x-auto">
                      {service.portfolioImages.slice(0, 4).map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-elevated">
                          <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Service detail modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService ? getBilingual(selectedService.title, locale) : ''}
        className="max-w-2xl"
      >
        {selectedService && (
          <div>
            <p className="text-white/60 mb-4">{getBilingual(selectedService.description, locale)}</p>
            {selectedService.portfolioImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedService.portfolioImages.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Image src={img} alt="" width={300} height={200} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => setSelectedService(null)} className="w-full">
              {locale === 'ar' ? 'طلب الخدمة' : 'Request Service'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
