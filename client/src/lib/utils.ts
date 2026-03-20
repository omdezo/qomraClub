import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBilingual<T extends { ar: string; en: string }>(
  field: T,
  locale: string
): string {
  return locale === 'ar' ? field.ar : field.en;
}

export function formatDate(date: string | Date, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const HINDI_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Convert Western digits (0-9) to Arabic-Indic (٠-٩) when locale is Arabic */
export function localizeNum(value: number | string, locale: string): string {
  const str = String(value);
  if (locale !== 'ar') return str;
  return str.replace(/[0-9]/g, (d) => HINDI_DIGITS[parseInt(d)]);
}
