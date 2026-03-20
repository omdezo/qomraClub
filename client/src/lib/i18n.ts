import type { Locale } from '@/types';

const dictionaries: Record<Locale, () => Promise<Record<string, any>>> = {
  ar: () => import('@/dictionaries/ar.json').then((m) => m.default),
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries[defaultLocale];
  return loader();
};

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';
