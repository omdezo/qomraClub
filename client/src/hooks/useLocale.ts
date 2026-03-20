'use client';

import { useParams } from 'next/navigation';
import type { Locale } from '@/types';

export function useLocale(): Locale {
  const params = useParams();
  return (params?.locale as Locale) || 'ar';
}
