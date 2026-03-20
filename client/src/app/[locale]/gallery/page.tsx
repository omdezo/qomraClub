import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types';
import GalleryClient from '@/components/gallery/GalleryClient';

export default async function GalleryPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return <GalleryClient locale={params.locale} dict={dict} />;
}
