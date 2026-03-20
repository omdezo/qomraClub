'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/types';

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const newLocale = locale === 'ar' ? 'en' : 'ar';
  const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);

  return (
    <a
      href={newPath}
      className="group relative px-3 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors duration-200"
    >
      <span className="relative z-10 tracking-wider">
        {locale === 'ar' ? 'EN' : 'عربي'}
      </span>
      <span className="absolute inset-0 rounded-full border border-white/[0.08] group-hover:border-white/20 group-hover:bg-white/[0.04] transition-all duration-300" />
    </a>
  );
}
