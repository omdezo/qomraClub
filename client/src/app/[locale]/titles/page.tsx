import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/types';
import TitlesClient from '@/components/titles/TitlesClient';

export default async function TitlesPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return <TitlesClient locale={params.locale} dict={dict} />;
}
