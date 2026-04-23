import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types';
import AlumniClient from '@/components/alumni/AlumniClient';

export default async function AlumniPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return <AlumniClient locale={params.locale} dict={dict} />;
}
